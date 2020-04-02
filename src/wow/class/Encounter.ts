import Options from '../interface/Options'
import ItemSearch from '../interface/ItemSearch'

import TargetType from '../enum/TargetType'
import ItemSlot from '../enum/ItemSlot'
import SortOrder from '../enum/SortOrder'

import Spell from './Spell'
import Target from './Target'
import Cast from './Cast'
import Character from './Character'
import Equipment from './Equipment'
import Database from './Database'
import Item from './Item'

export default class Encounter {
  options: Options
  spellCast: Cast

  constructor(options: Options) {
    this.options = options
    this.spellCast = new Cast(
      new Character(this.options.character, Encounter.optimalEquipment(this.options)),
      new Spell(this.options.spellName),
      new Target(this.options.target)
    )
  }

  static itemSearchFromOptions(options: Options, spellHitWeight?: number, spellCritWeight?: number) {
    let spell = new Spell(options.spellName)
    return {
      phase: options.phase,
      faction: Character.factionFromRace(options.character.race),
      pvpRank: options.character.pvpRank,
      raids: options.raids,
      worldBosses: options.worldBosses,
      tailoring: options.tailoring,
      magicSchool: spell.magicSchool,
      targetType: options.target.type,
      spellHitWeight: spellHitWeight ? spellHitWeight : 15,
      spellCritWeight: spellCritWeight ? spellCritWeight : 10,
      lockedItems: options.character.lockedItems,
      sortOrder: SortOrder.Descending
    }
  }

  static optimalEquipment(options: Options) {
    let maxTries = 5
    let dps = 0
    let prevDps = 0
    let spellCast = undefined
    let prevSpellCast = undefined
    let itemSearch = Encounter.itemSearchFromOptions(options)

    console.log(`--- starting gear optimization with maximum of ${maxTries} tries ---`)
    for (let i = 0; i <= maxTries; i++) {
      if (spellCast) {
        itemSearch.spellHitWeight = spellCast.spellHitWeight
        itemSearch.spellCritWeight = spellCast.spellCritWeight
      }
      spellCast = new Cast(
        new Character(options.character, Encounter.calcBisGear(itemSearch)),
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
    return Encounter.calcBisGear(itemSearch)
  }

  /* returns optimal equipment depending on options. will keep calculating, equipping,
   * and re-evaluating stat weights until the equipment no longer changes */
  /*
  static optimalEquipment(options: Options) {
    let itemSearch = Encounter.itemSearchFromOptions(options)
    let equipment = Encounter.calcBisGear(itemSearch)
    let spellCast = new Cast(
      new Character(options.character, equipment),
      new Spell(options.spellName),
      new Target(options.target)
    )

    let maxTries = 5
    let prevKey = 0
    let key = 0
    let prevDps = 0
    let dps = spellCast.dps.effective.avg
    for (let i = 0; i <= maxTries; i++) {
      prevKey = key
      key = itemSearch.spellHitWeight + itemSearch.spellCritWeight

      if (i > 4 && prevKey !== 0 && key === prevKey) {
        console.log('No changes in weights, all done.')
        break
      }

      if (i > 4 && dps >= prevDps) {
        console.log(`dps less than or equal to previous run dps=${dps} prev=${prevDps}`)
        break
      }
      console.log(
        `[attempt=${i}, key=${key}] hit=${itemSearch.spellHitWeight} crit=${itemSearch.spellCritWeight} dps=${dps}`
      )
      Equipment.printItemNames(equipment)

      equipment = Encounter.calcBisGear(itemSearch)
      spellCast = new Cast(
        new Character(options.character, equipment),
        new Spell(options.spellName),
        new Target(options.target)
      )
      itemSearch.spellHitWeight = spellCast.spellHitWeight
      itemSearch.spellCritWeight = spellCast.spellCritWeight
      prevDps = dps
      dps = spellCast.dps.effective.avg
    }

    return equipment
  }
  */

  static calcBisGear(itemSearch: ItemSearch): Equipment {
    let _bis = (slot: number) => {
      return Database.getBestInSlotItemWithEnchant(slot, itemSearch)
    }

    let bisTrinkets = Database.getBestInSlotTrinkets(itemSearch)
    let bisRings = Database.getBestInSlotRings(itemSearch)
    let bisWeaponCombo = Database.getBestInSlotWeaponCombo(itemSearch)
    let bisChestLegsFeet = Database.getBestInSlotChestLegsFeet(itemSearch)

    let bisHead = _bis(ItemSlot.Head)
    let bisHands = _bis(ItemSlot.Hands)
    let bisNeck = _bis(ItemSlot.Neck)
    let bisWaist = _bis(ItemSlot.Waist)
    let bisShoulder = _bis(ItemSlot.Shoulder)
    let bisLegs = new Item(ItemSlot.Legs, bisChestLegsFeet.legs, bisChestLegsFeet.legsEnchant)
    let bisBack = _bis(ItemSlot.Back)
    let bisFeet = new Item(ItemSlot.Feet, bisChestLegsFeet.feet, bisChestLegsFeet.feetEnchant)
    let bisChest = new Item(ItemSlot.Chest, bisChestLegsFeet.chest, bisChestLegsFeet.chestEnchant)
    let bisFinger = new Item(ItemSlot.Finger, bisRings.finger)
    let bisWrist = _bis(ItemSlot.Wrist)
    let bisFinger2 = new Item(ItemSlot.Finger2, bisRings.finger2)
    let bisMainHand = new Item(ItemSlot.Mainhand, bisWeaponCombo.mainHand, bisWeaponCombo.enchant)
    let bisTrinket = new Item(ItemSlot.Trinket, bisTrinkets.trinket)
    let bisOffHand = bisWeaponCombo.offHand ? new Item(ItemSlot.Offhand, bisWeaponCombo.offHand) : undefined
    let bisTrinket2 = new Item(ItemSlot.Trinket2, bisTrinkets.trinket2)
    let bisRelic = _bis(ItemSlot.Relic)

    let equipment = new Equipment(
      itemSearch,
      bisHead,
      bisHands,
      bisNeck,
      bisWaist,
      bisShoulder,
      bisLegs,
      bisBack,
      bisFeet,
      bisChest,
      bisFinger,
      bisWrist,
      bisFinger2,
      bisMainHand,
      bisTrinket,
      bisOffHand,
      bisTrinket2,
      bisRelic
    )

    return equipment
  }
}
