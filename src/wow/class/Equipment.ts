import Item from './Item'
import Character from './Character'
import Spell from './Spell'
import Database from './Database'
import Target from './Target'
import Cast from './Cast'

import ItemSlot from '../enum/ItemSlot'
import SortOrder from '../enum/SortOrder'

import Options from '../interface/Options'
import ItemSearch from '../interface/ItemSearch'

export default class Equipment {
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

  constructor(options: Options, spellHitWeight?: number, spellCritWeight?: number) {
    let _bis = (slot: number) => {
      return Database.getBestInSlotItemWithEnchant(slot, this.itemSearch)
    }

    this.itemSearch = Equipment.itemSearchFromOptions(options, spellHitWeight, spellCritWeight)

    let bisTrinkets = Database.getBestInSlotTrinkets(this.itemSearch)
    let bisRings = Database.getBestInSlotRings(this.itemSearch)
    let bisWeaponCombo = Database.getBestInSlotWeaponCombo(this.itemSearch)
    let bisChestLegsFeet = Database.getBestInSlotChestLegsFeet(this.itemSearch)
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
  }

  static itemSearchFromOptions(options: Options, spellHitWeight?: number, spellCritWeight?: number) {
    let spell = new Spell(options.spellName)

    return {
      phase: options.phase,
      faction: Character.factionFromRace(options.character.race),
      pvpRank: options.character.pvpRank,
      raids: options.raids,
      worldBosses: options.worldBosses,
      randomEnchants: options.randomEnchants,
      tailoring: options.tailoring,
      magicSchool: spell.magicSchool,
      targetType: options.target.type,
      spellHitWeight: spellHitWeight !== undefined ? spellHitWeight : 15,
      spellCritWeight: spellCritWeight !== undefined ? spellCritWeight : 10,
      lockedItems: options.character.lockedItems,
      lockedEnchants: options.character.lockedEnchants,
      slot: options.itemSearchSlot,
      sortOrder: SortOrder.Descending
    }
  }

  static optimalEnchantsForSlot(options: Options) {
    let myOptions = options

    /* Unequip the slot in question so we get a list of properly weighted enchants */
    switch (myOptions.enchantSearchSlot) {
      case ItemSlot.Head:
        myOptions.character.lockedEnchants.head = 0
        break
      case ItemSlot.Hands:
        myOptions.character.lockedEnchants.hands = 0
        break
      case ItemSlot.Shoulder:
        myOptions.character.lockedEnchants.shoulder = 0
        break
      case ItemSlot.Legs:
        myOptions.character.lockedEnchants.legs = 0
        break
      case ItemSlot.Back:
        myOptions.character.lockedEnchants.back = 0
        break
      case ItemSlot.Feet:
        myOptions.character.lockedEnchants.feet = 0
        break
      case ItemSlot.Chest:
        myOptions.character.lockedEnchants.chest = 0
        break
      case ItemSlot.Wrist:
        myOptions.character.lockedEnchants.wrist = 0
        break
      case ItemSlot.Mainhand:
        myOptions.character.lockedEnchants.mainhand = 0
        break
      default:
        break
    }

    let equipment = Equipment.optimalEquipment(myOptions)
    return Database.getWeightedEnchantsBySlot(myOptions.enchantSearchSlot, equipment.itemSearch)
  }

  static optimalItemsForSlot(options: Options) {
    let myOptions = options

    /* Unequip the slot in question so we get a list of properly weighted items */
    switch (myOptions.itemSearchSlot) {
      case ItemSlot.Head:
        myOptions.character.lockedItems.head = ''
        break
      case ItemSlot.Hands:
        myOptions.character.lockedItems.hands = ''
        break
      case ItemSlot.Neck:
        myOptions.character.lockedItems.neck = ''
        break
      case ItemSlot.Waist:
        myOptions.character.lockedItems.waist = ''
        break
      case ItemSlot.Shoulder:
        myOptions.character.lockedItems.shoulder = ''
        break
      case ItemSlot.Legs:
        myOptions.character.lockedItems.legs = ''
        break
      case ItemSlot.Back:
        myOptions.character.lockedItems.back = ''
        break
      case ItemSlot.Feet:
        myOptions.character.lockedItems.feet = ''
        break
      case ItemSlot.Chest:
        myOptions.character.lockedItems.chest = ''
        break
      case ItemSlot.Wrist:
        myOptions.character.lockedItems.wrist = ''
        break
      case ItemSlot.Finger:
        myOptions.character.lockedItems.finger = ''
        break
      case ItemSlot.Finger2:
        myOptions.character.lockedItems.finger2 = ''
        break
      case ItemSlot.Mainhand:
        myOptions.character.lockedItems.mainhand = ''
        break
      case ItemSlot.Offhand:
        myOptions.character.lockedItems.offhand = ''
        break
      case ItemSlot.Trinket:
        myOptions.character.lockedItems.trinket = ''
        break
      case ItemSlot.Trinket2:
        myOptions.character.lockedItems.trinket2 = ''
        break
      case ItemSlot.Relic:
        myOptions.character.lockedItems.idol = ''
        break
      default:
        break
    }

    let equipment = Equipment.optimalEquipment(myOptions)
    return Database.getWeightedItemsBySlot(myOptions.itemSearchSlot, equipment.itemSearch)
  }

  /* TODO: If itemSearchSlot isn't none, need to ignore that slot when weighting */
  static optimalEquipment(options: Options) {
    let maxTries = 5
    let dps = 0
    let prevDps = 0
    let spellCast = undefined
    let prevSpellCast = undefined

    console.log(`--- starting gear optimization with maximum of ${maxTries} tries ---`)
    for (let i = 0; i <= maxTries; i++) {
      spellCast = new Cast(
        new Character(
          options.character,
          new Equipment(
            options,
            spellCast ? spellCast.spellHitWeight : undefined,
            spellCast ? spellCast.spellCritWeight : undefined
          )
        ),
        new Spell(options.spellName),
        new Target(options.target)
      )

      console.log(`spellHitWeight=${spellCast.spellHitWeight}, spellCritWeight=${spellCast.spellCritWeight}`)
      dps = spellCast.dps.effective.avg
      prevDps = prevSpellCast ? prevSpellCast.dps.effective.avg : 0
      if (prevSpellCast && prevDps === dps) {
        console.log(`[try ${i}] no change in dps (${dps}), using previous set.`)
        // Equipment.printItemNames(prevSpellCast.character.equipment)
        console.log(`--- finished gear optimization in ${i} tries ---`)
        return prevSpellCast.character.equipment
      } else if (prevSpellCast && prevDps > dps) {
        console.log(`[try ${i}] dps loss of ${prevDps - dps}, using previous set.`)
        // Equipment.printItemNames(prevSpellCast.character.equipment)
        console.log(`--- finished gear optimization in ${i} tries ---`)
        return prevSpellCast.character.equipment
      } else {
        console.log(`[try ${i}] dps increase of ${dps - prevDps}, continuing.`)
        Equipment.printItemNames(spellCast.character.equipment)
      }

      prevSpellCast = spellCast
    }

    console.log(`reach the end condition? not good.`)
    return new Equipment(options)
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
