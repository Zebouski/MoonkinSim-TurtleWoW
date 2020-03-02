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

/* these are converted to JSON by webpack at build-time */
const spells = require('../db/spells.yaml')
const targets = require('../db/targets.yaml')
const gear = require('../db/gear.yaml')
const rawGear = require('../db/rawGear.yaml')
const testGear = require('../db/testGear.yaml')
const enchants = require('../db/enchants.yaml')

export default class Database {
  public spells: JSON
  public targets: JSON
  public gear: JSON
  public rawGear: JSON
  public testGear: JSON
  public enchants: JSON

  public constructor() {
    this.spells = spells
    this.targets = targets
    this.gear = gear
    this.rawGear = rawGear
    this.testGear = testGear
    this.enchants = enchants
  }

  /* generic query functions */
  public static querySpells(query: string): any {
    return jsonQuery(query, { data: spells }).value
  }

  public static queryTargets(query: string): any {
    return jsonQuery(query, { data: targets }).value
  }

  public static queryGear(query: string): any {
    return jsonQuery(query, { data: gear }).value
  }

  public static queryRawGear(query: string): any {
    return jsonQuery(query, { data: rawGear }).value
  }

  public static queryTestGear(query: string): any {
    return jsonQuery(query, { data: testGear }).value
  }

  public static queryEnchants(query: string): any {
    return jsonQuery(query, { data: enchants }).value
  }

  /* list functions */

  public static phaseList(): JSON {
    return this.queryRawGear('.phase')
  }

  public static spellList(): JSON {
    return this.querySpells('.name')
  }

  public static spellListByPhase(phase: number): JSON {
    let spells = this.querySpells(`[* phase <= ${phase}].name`)
    return spells
  }

  public static targetList(): JSON {
    return this.queryTargets('.name')
  }

  public static enchantList(): JSON {
    return this.queryEnchants('.name')
  }

  /* single item fetch functions */

  public static spell(name: string): SpellJSON {
    return this.querySpells(`[name=${name}]`)
  }

  public static target(name: string): JSON {
    return this.queryTargets(`[name=${name}]`)
  }

  public static enchant(name: string): EnchantJSON {
    return this.queryEnchants(`[name=${name}]`)
  }

  public static rawGear(phase: number): RawGearJSON {
    return this.queryRawGear(`[phase=${phase}]`)
  }

  public static gearById(id: number): ItemJSON {
    return this.queryGear(`[id=${id}]`)
  }

  public static gearByName(name: string): ItemJSON {
    return this.queryGear(`[name=${name}]`)
  }

  public static testGearByName(name: string): ItemJSON {
    return this.queryTestGear(`[name=${name}]`)
  }

  /* multiple item fetch functions */
  public static gearBySlot(slot: ItemSlot): any {
    return this.queryGear(`[*slot=${slot}]`)
  }

  public static enchantsBySlot(slot: ItemSlot): any {
    return this.queryEnchants(`[*slot=${slot}]`)
  }

  public static testGearBySlot(slot: ItemSlot): any {
    return this.queryTestGear(`[*slot=${slot}]`)
  }

  /****************/

  public static getBestInSlotWeaponCombo(
    phase: number,
    faction: Faction,
    magicSchool: MagicSchool,
    spellHitWeight: number,
    spellCritWeight: number
  ): WeaponComboJSON {
    const twohand = this.getBestInSlotItem(
      ItemSlot.Twohand,
      phase,
      faction,
      magicSchool,
      spellHitWeight,
      spellCritWeight
    )
    const onehand = this.getBestInSlotItem(
      ItemSlot.Onehand,
      phase,
      faction,
      magicSchool,
      spellHitWeight,
      spellCritWeight
    )
    const offhand = this.getBestInSlotItem(
      ItemSlot.Offhand,
      phase,
      faction,
      magicSchool,
      spellHitWeight,
      spellCritWeight
    )

    const onehandscore = onehand !== undefined ? onehand.score : 0
    const offhandscore = offhand !== undefined ? offhand.score : 0
    const twohandscore = twohand !== undefined ? twohand.score : 0

    if (twohandscore > onehandscore + offhandscore) {
      return {
        mainHand: twohand
      }
    }

    return {
      mainHand: onehand,
      offHand: offhand
    }
  }

  public static getBestInSlotItem(
    slot: ItemSlot,
    phase: number,
    faction: Faction,
    magicSchool: MagicSchool,
    spellHitWeight: number,
    spellCritWeight: number
  ) {
    let result = this.getWeightedEquipmentBySlot(
      slot,
      phase,
      faction,
      magicSchool,
      spellHitWeight,
      spellCritWeight,
      SortOrder.Descending
    )
    return result[0]
  }

  public static getWeightedEquipmentBySlot(
    slot: ItemSlot,
    phase: number,
    faction: Faction,
    magicSchool: MagicSchool,
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

    let result = jsonQuery(slot2query(slot), { data: testGear }).value
    result = jsonQuery(`[* faction = ${faction}]`, { data: result }).value
    result = jsonQuery(`[* phase <= ${phase}]`, { data: result }).value
    for (let i in result) {
      result[i].score = Item.scoreItem(result[i], magicSchool, spellHitWeight, spellCritWeight)
    }
    result.sort(sortOrder === SortOrder.Descending ? Item.sortScoreDes : Item.sortScoreAsc)
    return result
  }

  public static getBestInSlotEnchant(
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

  public static getWeightedEnchantBySlot(
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
