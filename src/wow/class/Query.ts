import jsonQuery from 'json-query'
import Tools from './Tools'

import SpellJSON from '../interface/SpellJSON'
import ItemJSON from '../interface/ItemJSON'
import ItemSetJSON from '../interface/ItemSetJSON'
import EnchantJSON from '../interface/EnchantJSON'
import ItemSlot from '../enum/ItemSlot'

import Faction from '../enum/Faction'
import PvPRank from '../enum/PvPRank'

import spells from '../db/spells.json'
import items from '../db/items.json'
import enchants from '../db/enchants.json'
import itemSets from '../db/itemSets.json'

interface ItemQuery {
  id?: number
  customId?: string
  name?: string
  slot?: ItemSlot
  phase?: number
  faction?: Faction
  pvpRank?: PvPRank
  worldBosses?: boolean
  raids?: boolean
  randomEnchants?: boolean
  enchantExploit?: boolean
  cloneResults?: boolean
}

interface SpellQuery {
  name?: string
  baseName?: string
  rank?: number
  phase?: number
  cloneResults?: boolean
}

export default class Query {
  /* return input, deep clone it if cloneResults is true */
  static _result(o: any, cloneResults: boolean) {
    if (cloneResults) {
      return Tools.CloneObject(o ? o : {})
    }

    return o ? o : {}
  }

  static Item(opts: ItemQuery): ItemJSON | undefined {
    let items = this.Items(opts)
    if (items && items[0]) {
      return items[0]
    }
    return undefined
  }

  static Items(opts: ItemQuery): ItemJSON[] {
    let noRandomEnchants = (itemJSON: ItemJSON) => {
      if (!itemJSON || !itemJSON.customId) {
        return true
      }

      return Tools.isLetter(itemJSON.customId.charAt(0)) ? false : true
    }

    let slot2query = (slot: ItemSlot) => {
      switch (slot) {
        case ItemSlot.Finger2:
          return `[* slot=${ItemSlot.Finger}]`
        case ItemSlot.Trinket2:
          return `[* slot=${ItemSlot.Trinket}]`
        case ItemSlot.Mainhand:
          return `[* slot=${ItemSlot.Mainhand} | slot=${ItemSlot.Onehand} | slot=${ItemSlot.Twohand}]`
        case ItemSlot.Onehand:
          return `[* slot=${ItemSlot.Mainhand} | slot=${ItemSlot.Onehand}]`
        default:
          return `[* slot=${slot}]`
      }
    }

    let singleItemQuery = (query: string): ItemJSON[] => {
      let result: ItemJSON[] = []
      let x = jsonQuery(query, { data: items }).value
      if (x) {
        result.push(x)
      }

      return this._result(result, opts.cloneResults ? opts.cloneResults : false)
    }

    /* id, customId and name are unique. if one is passed just lookup and return */
    if (opts.id) {
      return singleItemQuery(`[id=${opts.id}]`)
    } else if (opts.customId) {
      return singleItemQuery(`[customId=${opts.customId}]`)
    } else if (opts.name) {
      return singleItemQuery(`[name=${opts.name}]`)
    }

    let result: ItemJSON[] = []

    /* at this point if we don't have slot just return an empty set. we don't really
     * have a use-case for returning array of items from different slots */
    if (opts.slot === undefined) {
      return result
    }

    result = jsonQuery(slot2query(opts.slot), { data: items }).value

    if (opts.faction !== undefined) {
      result = jsonQuery(`[* faction = ${opts.faction} | faction = ${Faction.Horde | Faction.Alliance}]`, {
        data: result
      }).value
    }

    if (opts.phase !== undefined) {
      result = jsonQuery(`[* phase <= ${opts.phase}]`, { data: result }).value
    }

    if (opts.pvpRank !== undefined) {
      result = jsonQuery(`[* pvpRank <= ${opts.pvpRank}]`, { data: result }).value
    }

    if (opts.worldBosses !== undefined && opts.worldBosses === false) {
      result = jsonQuery(`[* worldBoss = false ]`, { data: result }).value
    }

    if (opts.raids !== undefined && opts.raids === false) {
      result = jsonQuery(`[* raid = false ]`, { data: result }).value
    }

    if (opts.randomEnchants !== undefined && opts.randomEnchants === false) {
      result = result.filter(noRandomEnchants)
    }

    return this._result(result, opts.cloneResults ? opts.cloneResults : false)
  }

  static ItemSet(opts: ItemQuery): ItemSetJSON | undefined {
    let itemSets = this.ItemSets(opts)
    if (itemSets && itemSets[0]) {
      return itemSets[0]
    }
    return undefined
  }

  static ItemSets(opts: ItemQuery): ItemSetJSON[] {
    let singleItemSetQuery = (query: string): ItemSetJSON[] => {
      let result: ItemSetJSON[] = []
      let x = jsonQuery(query, { data: itemSets }).value
      if (x) {
        result.push(x)
      }
      return this._result(result, opts.cloneResults ? opts.cloneResults : false)
    }

    if (opts.name) {
      return singleItemSetQuery(`[name=${opts.name}]`)
    }

    let result: ItemSetJSON[] = []

    result = jsonQuery(``, { data: itemSets }).value

    if (opts.raids !== undefined && opts.raids === false) {
      result = jsonQuery(`[* raid = false ]`, { data: result }).value
    }

    if (opts.phase !== undefined) {
      result = jsonQuery(`[* phase <= ${opts.phase}]`, { data: result }).value
    }

    return this._result(result, opts.cloneResults ? opts.cloneResults : false)
  }

  static Enchant(opts: ItemQuery): EnchantJSON | undefined {
    let enchants = this.Enchants(opts)
    if (enchants && enchants[0]) {
      return enchants[0]
    }
    return undefined
  }

  static Enchants(opts: ItemQuery): EnchantJSON[] {
    let singleEnchantQuery = (query: string): EnchantJSON[] => {
      let result: EnchantJSON[] = []
      let x = jsonQuery(query, { data: enchants }).value
      if (x) {
        result.push(x)
      }
      return this._result(result, opts.cloneResults ? opts.cloneResults : false)
    }

    let noExploit = (enchantJSON: EnchantJSON) => {
      if (!enchantJSON || !enchantJSON.exploit) {
        return true
      }

      return false
    }

    /* id and name are unique. if one is passed just lookup and return */
    if (opts.id) {
      return singleEnchantQuery(`[id=${opts.id}]`)
    } else if (opts.name) {
      return singleEnchantQuery(`[name=${opts.name}]`)
    }

    let result: EnchantJSON[] = []

    if (opts.slot === undefined) {
      return result
    }

    result = jsonQuery(`[* slot = ${opts.slot} | slot = -2 ]`, { data: enchants }).value

    if (opts.phase !== undefined) {
      result = jsonQuery(`[* phase <= ${opts.phase}]`, { data: result }).value
    }

    if (!opts.enchantExploit) {
      result = result.filter(noExploit)
    }

    return this._result(result, opts.cloneResults ? opts.cloneResults : false)
  }

  static Spell(opts: SpellQuery): SpellJSON | undefined {
    let spells = this.Spells(opts)
    if (spells && spells[0]) {
      return spells[0]
    }
    return undefined
  }

  static Spells(opts: SpellQuery) {
    let singleSpellQuery = (query: string): SpellJSON[] => {
      let result: SpellJSON[] = []
      let x = jsonQuery(query, { data: spells }).value
      if (x) {
        result.push(x)
      }
      return this._result(result, opts.cloneResults ? opts.cloneResults : false)
    }

    if (opts.name) {
      return singleSpellQuery(`[name=${opts.name}]`)
    }

    if (opts.baseName && opts.rank) {
      return singleSpellQuery(`[name=${opts.baseName} Rank ${opts.rank}]`)
    }

    let result: SpellJSON[] = []

    if (opts.phase !== undefined) {
      result = jsonQuery(`[* phase <= ${opts.phase}]`, { data: spells }).value
    }

    return this._result(result, opts.cloneResults ? opts.cloneResults : false)
  }
}
