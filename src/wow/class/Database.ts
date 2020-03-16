import jsonQuery from 'json-query'
import SpellJSON from '../interface/SpellJSON'
import RawGearJSON from '../interface/RawGearJSON'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'
import WeaponComboJSON from '../interface/WeaponComboJSON'
import ItemSlot from '../enum/ItemSlot'
import MagicSchool from '../enum/MagicSchool'
import SortOrder from '../enum/SortOrder'

import Item from './Item'
import Faction from '../enum/Faction'
import TargetType from '../enum/TargetType'
import PvPRank from '../enum/PvPRank'

import spells from '../db/spells.json'
import targets from '../db/targets.json'
import gear from '../db/gear.json'
import rawGear from '../db/rawGear.json'
import enchants from '../db/enchants.json'
import itemSets from '../db/itemSets.json'

export default class Database {
  /* generic query functions */
  static querySpells(query: string): any {
    return jsonQuery(query, { data: spells }).value
  }

  static queryTargets(query: string): any {
    return jsonQuery(query, { data: targets }).value
  }

  static queryGear(query: string): any {
    return jsonQuery(query, { data: gear }).value
  }

  static queryRawGear(query: string): any {
    return jsonQuery(query, { data: rawGear }).value
  }

  static queryEnchants(query: string): any {
    return jsonQuery(query, { data: enchants }).value
  }

  static queryItemSets(query: string): any {
    return jsonQuery(query, { data: itemSets }).value
  }

  /* list functions */

  static phaseList(): JSON {
    return this.queryRawGear('.phase')
  }

  static spellList(): JSON {
    return this.querySpells('.name')
  }

  static spellListByPhase(phase: number): JSON {
    let spells = this.querySpells(`[* phase <= ${phase}].name`)
    return spells
  }

  static targetList(): JSON {
    return this.queryTargets('.name')
  }

  static enchantList(): JSON {
    return this.queryEnchants('.name')
  }

  /* single item fetch functions */

  static spell(name: string): SpellJSON {
    return this.querySpells(`[name=${name}]`)
  }

  static target(name: string): JSON {
    return this.queryTargets(`[name=${name}]`)
  }

  static enchant(name: string): EnchantJSON {
    return this.queryEnchants(`[name=${name}]`)
  }

  static rawGear(phase: number): RawGearJSON {
    return this.queryRawGear(`[phase=${phase}]`)
  }

  static gearById(id: number): ItemJSON {
    return this.queryGear(`[id=${id}]`)
  }

  static gearByName(name: string): ItemJSON {
    return this.queryGear(`[name=${name}]`)
  }

  /* multiple item fetch functions */
  static gearBySlot(slot: ItemSlot): any {
    return this.queryGear(`[*slot=${slot}]`)
  }

  static enchantsBySlot(slot: ItemSlot): any {
    return this.queryEnchants(`[*slot=${slot}]`)
  }

  static itemSet(name: string): Object | undefined {
    let itemSets = this.queryItemSets(``)
    for (let itemSet of itemSets) {
      for (let item of itemSet.items) {
        if (item === name) {
          return itemSet
        }
      }
    }
    return undefined
  }

  /****************/
  static isUniqueEquip(itemJSON: ItemJSON) {
    return itemJSON.unique || (itemJSON.boss && itemJSON.boss.includes('Quest:')) ? true : false
  }

  static getBestInSlotTrinkets(
    phase: number,
    faction: Faction,
    pvpRank: PvPRank,
    raids: boolean,
    worldBosses: boolean,
    magicSchool: MagicSchool,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number
  ) {
    let result = this.getWeightedEquipmentBySlot(
      ItemSlot.Trinket,
      phase,
      faction,
      pvpRank,
      raids,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight,
      SortOrder.Descending
    )

    return {
      trinket: result[0],
      trinket2: this.isUniqueEquip(result[0]) ? result[1] : result[0]
    }
  }

  static getBestInSlotRings(
    phase: number,
    faction: Faction,
    pvpRank: PvPRank,
    raids: boolean,
    worldBosses: boolean,
    magicSchool: MagicSchool,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number
  ) {
    let result = this.getWeightedEquipmentBySlot(
      ItemSlot.Finger,
      phase,
      faction,
      pvpRank,
      raids,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight,
      SortOrder.Descending
    )

    return {
      finger: result[0],
      finger2: this.isUniqueEquip(result[0]) ? result[1] : result[0]
    }
  }

  static getBestInSlotItemWithEnchant(
    slot: ItemSlot,
    phase: number,
    faction: Faction,
    pvpRank: PvPRank,
    raids: boolean,
    worldBosses: boolean,
    magicSchool: MagicSchool,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number
  ) {
    const item = this.getBestInSlotItem(
      slot,
      phase,
      faction,
      pvpRank,
      raids,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight
    )
    const enchant = this.getBestInSlotEnchant(slot, phase, magicSchool, spellHitWeight, spellCritWeight)

    return new Item(slot, item, enchant)
  }

  static getBestInSlotWeaponCombo(
    phase: number,
    faction: Faction,
    pvpRank: PvPRank,
    raids: boolean,
    worldBosses: boolean,
    magicSchool: MagicSchool,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number
  ): WeaponComboJSON {
    const twohand = this.getBestInSlotItem(
      ItemSlot.Twohand,
      phase,
      faction,
      pvpRank,
      raids,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight
    )
    const onehand = this.getBestInSlotItem(
      ItemSlot.Onehand,
      phase,
      faction,
      pvpRank,
      raids,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight
    )
    const offhand = this.getBestInSlotItem(
      ItemSlot.Offhand,
      phase,
      faction,
      pvpRank,
      raids,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight
    )

    const enchant = this.getBestInSlotEnchant(ItemSlot.Mainhand, phase, magicSchool, spellHitWeight, spellCritWeight)

    const onehandscore = onehand !== undefined ? onehand.score : 0
    const offhandscore = offhand !== undefined ? offhand.score : 0
    const twohandscore = twohand !== undefined ? twohand.score : 0

    if (twohandscore > onehandscore + offhandscore) {
      return {
        mainHand: twohand,
        enchant: enchant
      }
    }

    return {
      mainHand: onehand,
      offHand: offhand,
      enchant: enchant
    }
  }

  static getBestInSlotItem(
    slot: ItemSlot,
    phase: number,
    faction: Faction,
    pvpRank: PvPRank,
    raids: boolean,
    worldBosses: boolean,
    magicSchool: MagicSchool,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number
  ) {
    let result = this.getWeightedEquipmentBySlot(
      slot,
      phase,
      faction,
      pvpRank,
      raids,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight,
      SortOrder.Descending
    )
    return result[0]
  }

  static getWeightedEquipmentBySlot(
    slot: ItemSlot,
    phase: number,
    faction: Faction,
    pvpRank: PvPRank,
    raids: boolean,
    worldBosses: boolean,
    magicSchool: MagicSchool,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number,
    sortOrder: SortOrder
  ) {
    let slot2query = (slot: ItemSlot) => {
      switch (slot) {
        case ItemSlot.Finger2:
          return `[* slot=${ItemSlot.Finger}]`
        case ItemSlot.Trinket2:
          return `[* slot=${ItemSlot.Trinket}]`
        case ItemSlot.Mainhand:
        case ItemSlot.Onehand:
          return `[* slot=${ItemSlot.Mainhand} | slot=${ItemSlot.Onehand}]`
        default:
          return `[* slot=${slot}]`
      }
    }

    let result = jsonQuery(slot2query(slot), { data: gear }).value
    result = jsonQuery(`[* faction = ${faction} | faction = ${Faction.Horde | Faction.Alliance}]`, { data: result })
      .value
    result = jsonQuery(`[* phase <= ${phase}]`, { data: result }).value
    result = jsonQuery(`[* pvpRank <= ${pvpRank}]`, { data: result }).value
    result = jsonQuery(`[* worldBoss = false | worldBoss = ${worldBosses}]`, { data: result }).value
    result = jsonQuery(`[* raid = false | raid = ${raids}]`, { data: result }).value

    /* score items */
    for (let i in result) {
      result[i].score = Item.scoreItem(result[i], magicSchool, targetType, spellHitWeight, spellCritWeight)
    }
    result.sort(sortOrder === SortOrder.Descending ? Item.sortScoreDes : Item.sortScoreAsc)
    return result
  }

  static getBestInSlotEnchant(
    slot: ItemSlot,
    phase: number,
    magicSchool: MagicSchool,
    spellHitWeight: number,
    spellCritWeight: number
  ) {
    let result = this.getWeightedEnchantBySlot(
      slot,
      phase,
      magicSchool,
      spellHitWeight,
      spellCritWeight,
      SortOrder.Descending
    )
    return result[0]
  }

  static getWeightedEnchantBySlot(
    slot: ItemSlot,
    phase: number,
    magicSchool: MagicSchool,
    spellHitWeight: number,
    spellCritWeight: number,
    sortOrder: SortOrder
  ) {
    let result = jsonQuery(`[* slot = ${slot} & phase <= ${phase}]`, { data: enchants }).value
    for (let i in result) {
      result[i].score = Item.scoreEnchant(result[i], magicSchool, spellHitWeight, spellCritWeight)
    }
    result.sort(sortOrder === SortOrder.Descending ? Item.sortScoreDes : Item.sortScoreAsc)
    return result
  }
}
