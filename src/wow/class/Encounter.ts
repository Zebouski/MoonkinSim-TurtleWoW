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
  equipment: Equipment

  constructor(options: Options) {
    this.options = options
    let spell = new Spell(this.options.spellName)
    let itemSearch = {
      phase: this.options.phase,
      faction: Character.factionFromRace(this.options.character.race),
      pvpRank: this.options.character.pvpRank,
      raids: this.options.raids,
      worldBosses: this.options.worldBosses,
      tailoring: this.options.tailoring,
      magicSchool: spell.magicSchool,
      targetType: this.options.target.type,
      spellHitWeight: 15,
      spellCritWeight: 10,
      sortOrder: SortOrder.Descending
    }
    this.equipment = Encounter.calcBisGear(itemSearch)
    this.spellCast = new Cast(
      new Character(this.options.character, this.equipment),
      spell,
      new Target(this.options.target)
    )

    let maxTries = 5
    let prevKey = 0
    let key = 0
    for (let i = 0; i <= maxTries; i++) {
      prevKey = key
      key = itemSearch.spellHitWeight + itemSearch.spellCritWeight
      if (prevKey !== 0 && key === prevKey) {
        console.log('No changes in weights, all done.')
        break
      }
      console.log(
        `[attempt=${i}, key=${key}] hit=${itemSearch.spellHitWeight} crit=${itemSearch.spellCritWeight} dps=${this.spellCast.dps.effective.avg}`
      )
      Equipment.printItemNames(this.equipment)

      this.equipment = Encounter.calcBisGear(itemSearch)
      this.spellCast = new Cast(
        new Character(this.options.character, this.equipment),
        spell,
        new Target(this.options.target)
      )

      itemSearch.spellHitWeight = this.spellCast.spellHitWeight
      itemSearch.spellCritWeight = this.spellCast.spellCritWeight
    }
  }

  static calcBisGear(itemSearch: ItemSearch): Equipment {
    let _bis = (slot: number) => {
      return Database.getBestInSlotItemWithEnchant(slot, itemSearch)
    }

    let bisTrinkets = Database.getBestInSlotTrinkets(itemSearch)
    let bisRings = Database.getBestInSlotRings(itemSearch)
    let bisWeaponCombo = Database.getBestInSlotWeaponCombo(itemSearch)
    let bisChestLegsFeet = Database.getBestInSlotChestLegsFeet(itemSearch)

    let equipment = new Equipment(
      itemSearch,
      _bis(ItemSlot.Head),
      _bis(ItemSlot.Hands),
      _bis(ItemSlot.Neck),
      _bis(ItemSlot.Waist),
      _bis(ItemSlot.Shoulder),
      new Item(ItemSlot.Legs, bisChestLegsFeet.legs, bisChestLegsFeet.legsEnchant),
      _bis(ItemSlot.Back),
      new Item(ItemSlot.Feet, bisChestLegsFeet.feet, bisChestLegsFeet.feetEnchant),
      new Item(ItemSlot.Chest, bisChestLegsFeet.chest, bisChestLegsFeet.chestEnchant),
      new Item(ItemSlot.Finger, bisRings.finger),
      _bis(ItemSlot.Wrist),
      new Item(ItemSlot.Finger2, bisRings.finger2),
      new Item(ItemSlot.Mainhand, bisWeaponCombo.mainHand, bisWeaponCombo.enchant),
      new Item(ItemSlot.Trinket, bisTrinkets.trinket),
      bisWeaponCombo.offHand ? new Item(ItemSlot.Offhand, bisWeaponCombo.offHand) : undefined,
      new Item(ItemSlot.Trinket2, bisTrinkets.trinket2),
      _bis(ItemSlot.Relic)
    )

    return equipment
  }
}
