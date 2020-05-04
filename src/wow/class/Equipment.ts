import Item from './Item'
import Character from './Character'
import Spell from './Spell'
import Target from './Target'
import Cast from './Cast'
import Tools from './Tools'
import Locked from './Locked'
import Query from './Query'

import ItemSlot from '../enum/ItemSlot'
import SortOrder from '../enum/SortOrder'

import Options from '../interface/Options'
import LockedItems from '../interface/LockedItems'
import ItemSearch from '../interface/ItemSearch'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'
import constants from '../constants'

/* Object containing:
 *
 * - The BiS equipment shown on main gear selection box
 * - The BiS items shown in table modal when selecting an item slot (if applicable)
 * - The BiS enchants shown in table modal when selected an enchant slot (if applicable)
 *
 * Each of these sets of data required running the same optimization function, so this
 * is an attempt to refactor and handle them all at the same time.
 *
 */
interface OptimalEquipment {
  equipment: Equipment
  items: ItemJSON[]
  enchants: EnchantJSON[]
}

/* Object used in optimization routine to store/sort/return the equipment
 * with the highest resulting DPS */
interface EquipmentArray {
  dps: number
  equipment: Equipment
}

export default class Equipment {
  options: Options
  itemSearch: ItemSearch
  head: Item
  hands: Item
  neck: Item
  waist: Item
  shoulder: Item
  legs: Item
  back: Item
  feet: Item
  chest: Item
  finger: Item
  wrist: Item
  finger2: Item
  mainhand: Item
  offhand: Item
  trinket: Item
  trinket2: Item
  idol: Item

  /* TODO: can I make it so the constructor could take list of item ids or something instead? */
  constructor(options: Options, spellHitWeight?: number, spellCritWeight?: number) {
    let _bis = (slot: number) => {
      return Equipment.getBestInSlotItemWithEnchant(slot, this.itemSearch)
    }

    this.options = options
    this.itemSearch = Equipment.itemSearchFromOptions(options, spellHitWeight, spellCritWeight)

    let bisTrinkets = Equipment.getBestInSlotTrinkets(this.itemSearch)
    let bisRings = Equipment.getBestInSlotRings(this.itemSearch)
    let bisWeaponCombo = Equipment.getBestInSlotWeaponCombo(this.itemSearch)
    let bisChestLegsFeet = Equipment.getBestInSlotChestLegsFeet(this.itemSearch)
    this.head = _bis(ItemSlot.Head)
    this.hands = _bis(ItemSlot.Hands)
    this.neck = _bis(ItemSlot.Neck)
    this.waist = _bis(ItemSlot.Waist)
    this.shoulder = _bis(ItemSlot.Shoulder)
    this.legs = new Item(ItemSlot.Legs, bisChestLegsFeet.legs, bisChestLegsFeet.legsEnchant)
    this.back = _bis(ItemSlot.Back)
    this.feet = new Item(ItemSlot.Feet, bisChestLegsFeet.feet, bisChestLegsFeet.feetEnchant)
    this.chest = new Item(ItemSlot.Chest, bisChestLegsFeet.chest, bisChestLegsFeet.chestEnchant)
    this.finger = new Item(ItemSlot.Finger, bisRings.finger)
    this.wrist = _bis(ItemSlot.Wrist)
    this.finger2 = new Item(ItemSlot.Finger2, bisRings.finger2)
    this.mainhand = new Item(ItemSlot.Mainhand, bisWeaponCombo.mainHand, bisWeaponCombo.enchant)
    this.offhand = bisWeaponCombo.offHand
      ? new Item(ItemSlot.Offhand, bisWeaponCombo.offHand)
      : new Item(ItemSlot.Offhand)
    this.trinket = new Item(ItemSlot.Trinket, bisTrinkets.trinket)
    this.trinket2 = new Item(ItemSlot.Trinket2, bisTrinkets.trinket2)
    this.idol = _bis(ItemSlot.Relic)

    /* TODO: think need to re-evaluate stat weights, update the itemsearch, and rescore
     * all the items. pita the way this is structured. */
  }

  static itemSearchFromOptions(
    options: Options,
    spellHitWeight?: number,
    spellCritWeight?: number,
    spellCastTime?: number
  ) {
    let myOptions = Tools.CloneObject(options)
    let spell = new Spell(myOptions.spellName)

    return {
      phase: myOptions.phase,
      faction: Character.factionFromRace(myOptions.character.race),
      pvpRank: myOptions.character.pvpRank,
      raids: myOptions.raids,
      worldBosses: myOptions.worldBosses,
      randomEnchants: myOptions.randomEnchants,
      tailoring: myOptions.tailoring,
      enchantExploit: myOptions.enchantExploit,
      encounterLength: myOptions.encounterLength,
      onUseItems: myOptions.onUseItems,
      magicSchool: spell.magicSchool,
      targetType: myOptions.target.type,
      spellHitWeight: spellHitWeight !== undefined ? spellHitWeight : 15,
      spellCritWeight: spellCritWeight !== undefined ? spellCritWeight : 10,
      spellCastTime: spellCastTime !== undefined ? spellCastTime : constants.globalCoolDown,
      lockedItems: myOptions.character.lockedItems,
      lockedEnchants: myOptions.character.lockedEnchants,
      slot: myOptions.itemSearchSlot,
      sortOrder: SortOrder.Descending
    }
  }

  static optimalItemsForSlot(options: Options) {
    /* itemSearchSlot is only set when a user clicks a slot to equip an item. If that's not
     * the case then we don't need to do anything */
    let slot = options.itemSearchSlot
    if (slot === ItemSlot.None) {
      return undefined
    }

    /* We need the stat weights MINUS the slot we're getting items for. So make a private
     * copy of options, unequip the slot, and run the equipment optimization function.
     * Our stat weights will be contained in the itemSearch. */
    let tmpOptions: Options = Tools.CloneObject(options)
    Locked.UnequipItem(tmpOptions.character.lockedItems, slot)
    let tmpEquipment: Equipment = Equipment.optimalEquipment(tmpOptions)
    let tmpItemSearch: ItemSearch = tmpEquipment.itemSearch

    /* and finally retrieve the items for this slot, using the weights
     * we just got. Copy the original version of what we overwrote above
     * and unlock the slot so it doesn't return a user locked item */
    tmpItemSearch.lockedItems = Tools.CloneObject(options.character.lockedItems)
    Locked.UnlockItem(tmpItemSearch.lockedItems, tmpOptions.itemSearchSlot)
    return Equipment.getWeightedItemsBySlot(slot, tmpItemSearch)
  }

  static optimalEnchantsForSlot(options: Options) {
    /* Same process as above, but for enchants */
    let slot = options.enchantSearchSlot
    if (slot === ItemSlot.None) {
      return undefined
    }

    let tmpOptions: Options = Tools.CloneObject(options)
    Locked.UnequipEnchant(tmpOptions.character.lockedEnchants, slot)
    let tmpEquipment: Equipment = Equipment.optimalEquipment(tmpOptions)
    let tmpItemSearch: ItemSearch = tmpEquipment.itemSearch

    tmpItemSearch.lockedEnchants = Tools.CloneObject(options.character.lockedEnchants)
    Locked.UnlockEnchant(tmpItemSearch.lockedEnchants, tmpOptions.enchantSearchSlot)
    return Equipment.getWeightedEnchantsBySlot(slot, tmpItemSearch)
  }

  static sortByDps(a: EquipmentArray, b: EquipmentArray) {
    return (b.dps ? b.dps : 0) - (a.dps ? a.dps : 0)
  }

  /* TODO: If itemSearchSlot isn't none, need to ignore that slot when weighting */
  static optimalEquipment(options: Options) {
    let myOptions = Tools.CloneObject(options)
    let maxTries = 5
    let spellCast = undefined
    let equipmentArray = new Array<EquipmentArray>()

    console.log(`--- starting gear optimization with maximum of ${maxTries} tries ---`)
    for (let i = 0; i <= maxTries - 1; i++) {
      console.log(
        `Attempt ${i + 1}: spellHitWeight=${spellCast ? spellCast.spellHitWeight : 15}, spellCritWeight=${
          spellCast ? spellCast.spellCritWeight : 10
        }`
      )
      spellCast = new Cast(myOptions, {
        spellHitWeight: spellCast ? spellCast.spellHitWeight : undefined,
        spellCritWeight: spellCast ? spellCast.spellCritWeight : undefined
      })

      equipmentArray.push({
        dps: spellCast.dps.effective.avg,
        equipment: spellCast.character.equipment
      })
    }

    console.log(`--- finished gear optimization ---`)
    equipmentArray.sort(Equipment.sortByDps)

    return equipmentArray[0].equipment
  }

  static printItemNames(equipment: Equipment) {
    console.log(`
      ${equipment.head.name}, ${equipment.hands.name}, ${equipment.neck.name},
      ${equipment.waist.name}, ${equipment.shoulder.name}, ${equipment.legs.name},
      ${equipment.back.name}, ${equipment.feet.name}, ${equipment.chest.name},
      ${equipment.finger.name}, ${equipment.wrist.name}, ${equipment.finger2.name},
      ${equipment.mainhand.name}, ${equipment.trinket.name}, ${equipment.offhand.name},
      ${equipment.trinket2.name}, ${equipment.idol.spellDamage}`)
  }

  /*************************** TODO **********************************/
  /*************************** UGLY **********************************/
  /*************************** STUFF **********************************/
  static isUniqueEquip(itemJSON: ItemJSON) {
    return itemJSON.unique || (itemJSON.boss && itemJSON.boss.includes('Quest:')) ? true : false
  }

  static getWeightedItemsBySlot(slot: ItemSlot, itemSearch: ItemSearch) {
    let _scoreOnUseTrinket = (itemJSON: ItemJSON): number => {
      /* Add additional score from onUse effect */
      if (itemSearch.onUseItems && (slot === ItemSlot.Trinket || slot === ItemSlot.Trinket2) && itemJSON.onUse) {
        console.log(`Hello trinkets: encounterLength=${itemSearch.encounterLength}`)
        if (itemJSON.name && itemJSON.name === 'Talisman of Ephemeral Power') {
          return 200
        }
      }
      return 0
    }

    let lockedItem = Locked.GetItem(itemSearch.lockedItems, slot)
    if (lockedItem) {
      let x = []
      lockedItem.score = Item.scoreItem(
        lockedItem,
        itemSearch.magicSchool,
        itemSearch.targetType,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      x.push(lockedItem)
      return x
    }

    let result = Query.Items({
      cloneResults: false,
      slot: slot,
      phase: itemSearch.phase,
      faction: itemSearch.faction,
      pvpRank: itemSearch.pvpRank,
      worldBosses: itemSearch.worldBosses,
      raids: itemSearch.raids,
      randomEnchants: itemSearch.randomEnchants
    })

    /* score items */
    for (let i = 0; i < result.length; i++) {
      let score = Item.scoreItem(
        result[i],
        itemSearch.magicSchool,
        itemSearch.targetType,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      score += _scoreOnUseTrinket(result[i])
      result[i].score = score
    }

    result.sort(itemSearch.sortOrder === SortOrder.Descending ? Item.sortScoreDes : Item.sortScoreAsc)
    return result
  }

  static getWeightedEnchantsBySlot(slot: ItemSlot, itemSearch: ItemSearch) {
    let lockedEnchant = Locked.GetEnchant(itemSearch.lockedEnchants, slot)
    if (lockedEnchant) {
      let x = []
      lockedEnchant.score = Item.scoreEnchant(
        lockedEnchant,
        itemSearch.magicSchool,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      x.push(lockedEnchant)
      return x
    }

    let result = Query.Enchants({
      cloneResults: false,
      slot: slot,
      phase: itemSearch.phase,
      enchantExploit: itemSearch.enchantExploit
    })

    for (let i in result) {
      let score = Item.scoreEnchant(
        result[i],
        itemSearch.magicSchool,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      result[i].score = score
    }
    result.sort(itemSearch.sortOrder === SortOrder.Descending ? Item.sortScoreDes : Item.sortScoreAsc)
    return result
  }

  static getItemSet(name: string, itemSearch: ItemSearch) {
    /* Find the set and filter */
    let itemSets = Query.ItemSets({ cloneResults: false, name: name, raids: itemSearch.raids, phase: itemSearch.phase })
    if (!itemSets || !itemSets[0]) {
      return undefined
    }
    let itemSet = itemSets[0]

    /* TODO: Should be aborting here custom selections are disallowing the set */

    /* Find each item in set, score them and add to array */
    let itemSetItems = []
    let itemSetItemsScore = 0
    for (let itemName of itemSet.itemNames) {
      let items = Query.Items({
        phase: itemSearch.phase,
        raids: itemSearch.raids,
        cloneResults: false,
        name: itemName
      })
      // let item = this.itemByName(itemName)
      let item = items[0]
      item.score = Item.scoreItem(
        item,
        itemSearch.magicSchool,
        itemSearch.targetType,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      itemSetItemsScore += item.score
      itemSetItems.push(item)
    }

    /* Combine score of items plus set bonus */
    itemSet.score = itemSetItemsScore
    if (itemSearch.tailoring) {
      let isb = Item.scoreItemSetBonus(
        itemSet,
        itemSearch.magicSchool,
        itemSearch.targetType,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
      itemSet.score += isb
    }

    /* Slap items array onto itemset and return*/
    itemSet.items = itemSetItems
    return itemSet
  }

  static getBestInSlotItem(slot: ItemSlot, itemSearch: ItemSearch) {
    let result = this.getWeightedItemsBySlot(slot, itemSearch)
    return result[0]
  }

  static getBestInSlotEnchant(slot: ItemSlot, itemSearch: ItemSearch) {
    let result = this.getWeightedEnchantsBySlot(slot, itemSearch)
    return result[0]
  }

  static getBestInSlotItemWithEnchant(slot: ItemSlot, itemSearch: ItemSearch) {
    const item = this.getBestInSlotItem(slot, itemSearch)
    let enchant = this.getBestInSlotEnchant(slot, itemSearch)

    return new Item(slot, item, enchant)
  }

  static getBestInSlotChestLegsFeet(itemSearch: ItemSearch) {
    let chest: ItemJSON | undefined = this.getBestInSlotItem(ItemSlot.Chest, itemSearch)
    let legs: ItemJSON | undefined = this.getBestInSlotItem(ItemSlot.Legs, itemSearch)
    let feet: ItemJSON | undefined = this.getBestInSlotItem(ItemSlot.Feet, itemSearch)
    let bloodvine = this.getItemSet(`Bloodvine Garb`, itemSearch)
    let bloodvineScore = bloodvine && bloodvine.score ? bloodvine.score : 0

    let normScore =
      (chest && chest.score ? chest.score : 0) +
      (legs && legs.score ? legs.score : 0) +
      (feet && feet.score ? feet.score : 0)

    let customChest =
      itemSearch &&
      itemSearch.lockedItems &&
      itemSearch.lockedItems.chest !== '' &&
      itemSearch.lockedItems.chest !== '19682'
    let customLegs =
      itemSearch &&
      itemSearch.lockedItems &&
      itemSearch.lockedItems.legs !== '' &&
      itemSearch.lockedItems.legs !== '19683'
    let customFeet =
      itemSearch &&
      itemSearch.lockedItems &&
      itemSearch.lockedItems.feet !== '' &&
      itemSearch.lockedItems.feet !== '19684'

    if (!customChest && !customLegs && !customFeet && bloodvine && bloodvineScore > normScore) {
      chest = bloodvine.items ? bloodvine.items[0] : undefined
      legs = bloodvine.items ? bloodvine.items[1] : undefined
      feet = bloodvine.items ? bloodvine.items[2] : undefined
    }

    return {
      chest: chest,
      chestEnchant: this.getBestInSlotEnchant(ItemSlot.Chest, itemSearch),
      legs: legs,
      legsEnchant: this.getBestInSlotEnchant(ItemSlot.Legs, itemSearch),
      feet: feet,
      feetEnchant: this.getBestInSlotEnchant(ItemSlot.Feet, itemSearch)
    }
  }

  static getBestInSlotTrinkets(itemSearch: ItemSearch) {
    let result = this.getWeightedItemsBySlot(ItemSlot.Trinket, itemSearch)
    let result2 = this.getWeightedItemsBySlot(ItemSlot.Trinket2, itemSearch)

    let trinket1 = result[0]
    let trinket2 = result2[0]

    if (this.isUniqueEquip(result[0]) && result[0].name === result2[0].name) {
      trinket2 = result2[1]
    }

    return {
      trinket: trinket1,
      trinket2: trinket2
    }
  }

  static getBestInSlotRings(itemSearch: ItemSearch) {
    let zanzils = undefined
    let result = this.getWeightedItemsBySlot(ItemSlot.Finger, itemSearch)
    let result2 = this.getWeightedItemsBySlot(ItemSlot.Finger2, itemSearch)

    let ring1: ItemJSON | undefined = result[0]
    let ring2: ItemJSON | undefined = result2[0]
    if (this.isUniqueEquip(result[0]) && result[0].name === result2[0].name) {
      ring2 = result2[1]
    }

    let basicScore = (ring1 && ring1.score ? ring1.score : 0) + (ring2 && ring2.score ? ring2.score : 0)
    let customFinger = itemSearch.lockedItems !== undefined && itemSearch.lockedItems.finger
    let customFinger2 = itemSearch.lockedItems !== undefined && itemSearch.lockedItems.finger2

    if (!customFinger && !customFinger2) {
      zanzils = this.getItemSet(`Zanzil's Concentration`, itemSearch)
      if (zanzils && (zanzils.score ? zanzils.score : 0) > basicScore) {
        ring1 = zanzils.items ? zanzils.items[0] : undefined
        ring2 = zanzils.items ? zanzils.items[1] : undefined
      }
    }

    return {
      finger: ring1,
      finger2: ring2
    }
  }

  static getBestInSlotWeaponCombo(itemSearch: ItemSearch) {
    const twohand = this.getBestInSlotItem(ItemSlot.Twohand, itemSearch)
    const onehand = this.getBestInSlotItem(ItemSlot.Onehand, itemSearch)
    const offhand = this.getBestInSlotItem(ItemSlot.Offhand, itemSearch)
    const enchant = this.getBestInSlotEnchant(ItemSlot.Mainhand, itemSearch)

    const onehandscore = onehand && onehand.score ? onehand.score : 0
    const offhandscore = offhand && offhand.score ? offhand.score : 0
    const twohandscore = twohand && twohand.score ? twohand.score : 0

    const _offhand = Locked.GetItemId(itemSearch.lockedItems, ItemSlot.Offhand)

    if (!_offhand && twohandscore > onehandscore + offhandscore) {
      return {
        mainHand: twohand,
        enchant: enchant
      }
    }

    let mainhand = onehand

    return {
      mainHand: mainhand,
      offHand: mainhand.slot === ItemSlot.Twohand ? undefined : offhand,
      enchant: enchant
    }
  }

  /*************************** /UGLY **********************************/
  get hasBloodvine() {
    if (
      this.itemSearch.tailoring &&
      this.chest.name === `Bloodvine Vest` &&
      this.legs.name === `Bloodvine Leggings` &&
      this.feet.name === `Bloodvine Boots`
    ) {
      return true
    }
    return false
  }

  get hasZanzils() {
    if (
      (this.finger.name === `Zanzil's Band` || this.finger.name === `Zanzil's Seal`) &&
      (this.finger2.name === `Zanzil's Band` || this.finger2.name === `Zanzil's Seal`)
    ) {
      return true
    }
    return false
  }

  get spellDamage(): number {
    return (
      (this.hasZanzils ? 6 : 0) +
      this.head.spellDamage +
      this.hands.spellDamage +
      this.neck.spellDamage +
      this.waist.spellDamage +
      this.shoulder.spellDamage +
      this.legs.spellDamage +
      this.back.spellDamage +
      this.feet.spellDamage +
      this.chest.spellDamage +
      this.finger.spellDamage +
      this.wrist.spellDamage +
      this.finger2.spellDamage +
      this.mainhand.spellDamage +
      this.offhand.spellDamage +
      this.trinket.spellDamage +
      this.trinket2.spellDamage +
      this.idol.spellDamage
    )
  }

  get arcaneDamage(): number {
    return (
      this.head.arcaneDamage +
      this.hands.arcaneDamage +
      this.neck.arcaneDamage +
      this.waist.arcaneDamage +
      this.shoulder.arcaneDamage +
      this.legs.arcaneDamage +
      this.back.arcaneDamage +
      this.feet.arcaneDamage +
      this.chest.arcaneDamage +
      this.finger.arcaneDamage +
      this.wrist.arcaneDamage +
      this.finger2.arcaneDamage +
      this.mainhand.arcaneDamage +
      this.offhand.arcaneDamage +
      this.trinket.arcaneDamage +
      this.trinket2.arcaneDamage +
      this.idol.arcaneDamage
    )
  }

  get natureDamage(): number {
    return (
      this.head.natureDamage +
      this.hands.natureDamage +
      this.neck.natureDamage +
      this.waist.natureDamage +
      this.shoulder.natureDamage +
      this.legs.natureDamage +
      this.back.natureDamage +
      this.feet.natureDamage +
      this.chest.natureDamage +
      this.finger.natureDamage +
      this.wrist.natureDamage +
      this.finger2.natureDamage +
      this.mainhand.natureDamage +
      this.offhand.natureDamage +
      this.trinket.natureDamage +
      this.trinket2.natureDamage +
      this.idol.natureDamage
    )
  }

  get spellHit(): number {
    return (
      (this.hasZanzils ? 1 : 0) +
      this.head.spellHit +
      this.hands.spellHit +
      this.neck.spellHit +
      this.waist.spellHit +
      this.shoulder.spellHit +
      this.legs.spellHit +
      this.back.spellHit +
      this.feet.spellHit +
      this.chest.spellHit +
      this.finger.spellHit +
      this.wrist.spellHit +
      this.finger2.spellHit +
      this.mainhand.spellHit +
      this.offhand.spellHit +
      this.trinket.spellHit +
      this.trinket2.spellHit +
      this.idol.spellHit
    )
  }

  get spellCrit(): number {
    return (
      (this.hasBloodvine ? 2 : 0) +
      this.head.spellCrit +
      this.hands.spellCrit +
      this.neck.spellCrit +
      this.waist.spellCrit +
      this.shoulder.spellCrit +
      this.legs.spellCrit +
      this.back.spellCrit +
      this.feet.spellCrit +
      this.chest.spellCrit +
      this.finger.spellCrit +
      this.wrist.spellCrit +
      this.finger2.spellCrit +
      this.mainhand.spellCrit +
      this.offhand.spellCrit +
      this.trinket.spellCrit +
      this.trinket2.spellCrit +
      this.idol.spellDamage
    )
  }

  get intellect(): number {
    return (
      this.head.intellect +
      this.hands.intellect +
      this.neck.intellect +
      this.waist.intellect +
      this.shoulder.intellect +
      this.legs.intellect +
      this.back.intellect +
      this.feet.intellect +
      this.chest.intellect +
      this.finger.intellect +
      this.wrist.intellect +
      this.finger2.intellect +
      this.mainhand.intellect +
      this.offhand.intellect +
      this.trinket.intellect +
      this.trinket2.intellect +
      this.idol.intellect
    )
  }

  get stamina(): number {
    return (
      this.head.stamina +
      this.hands.stamina +
      this.neck.stamina +
      this.waist.stamina +
      this.shoulder.stamina +
      this.legs.stamina +
      this.back.stamina +
      this.feet.stamina +
      this.chest.stamina +
      this.finger.stamina +
      this.wrist.stamina +
      this.finger2.stamina +
      this.mainhand.stamina +
      this.offhand.stamina +
      this.trinket.stamina +
      this.trinket2.stamina +
      this.idol.stamina
    )
  }

  get spirit(): number {
    return (
      this.head.spirit +
      this.hands.spirit +
      this.neck.spirit +
      this.waist.spirit +
      this.shoulder.spirit +
      this.legs.spirit +
      this.back.spirit +
      this.feet.spirit +
      this.chest.spirit +
      this.finger.spirit +
      this.wrist.spirit +
      this.finger2.spirit +
      this.mainhand.spirit +
      this.offhand.spirit +
      this.trinket.spirit +
      this.trinket2.spirit +
      this.idol.spirit
    )
  }

  get mp5(): number {
    return (
      this.head.mp5 +
      this.hands.mp5 +
      this.neck.mp5 +
      this.waist.mp5 +
      this.shoulder.mp5 +
      this.legs.mp5 +
      this.back.mp5 +
      this.feet.mp5 +
      this.chest.mp5 +
      this.finger.mp5 +
      this.wrist.mp5 +
      this.finger2.mp5 +
      this.mainhand.mp5 +
      this.offhand.mp5 +
      this.trinket.mp5 +
      this.trinket2.mp5 +
      this.idol.mp5
    )
  }

  /* TODO: There's isn't any spell pen gear yet */
  get spellPenetration(): number {
    return 0
  }
}
