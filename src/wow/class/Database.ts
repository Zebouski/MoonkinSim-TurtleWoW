import jsonQuery from 'json-query'
import SpellJSON from '../interface/SpellJSON'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'
import WeaponComboJSON from '../interface/WeaponComboJSON'
import ItemSearch from '../interface/ItemSearch'

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

  static queryEnchants(query: string): any {
    return jsonQuery(query, { data: enchants }).value
  }

  static queryItemSets(query: string): any {
    return jsonQuery(query, { data: itemSets }).value
  }

  /* list functions */

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
      for (let itemName of itemSet.itemNames) {
        if (itemName === name) {
          return itemSet
        }
      }
    }
    return undefined
  }

  static isUniqueEquip(itemJSON: ItemJSON) {
    return itemJSON.unique || (itemJSON.boss && itemJSON.boss.includes('Quest:')) ? true : false
  }

  /****************/
  static getLockedItem(slot: number, itemSearch: ItemSearch) {
    let item = undefined
    let itemName = this.getLockedItemName(slot, itemSearch)
    if (itemName) {
      item = this.gearByName(itemName)
    }
    return item
  }

  static getLockedItemName(slot: number, itemSearch: ItemSearch) {
    switch (slot) {
      case ItemSlot.Head:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.head : undefined
      case ItemSlot.Hands:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.hands : undefined
      case ItemSlot.Neck:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.neck : undefined
      case ItemSlot.Waist:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.waist : undefined
      case ItemSlot.Shoulder:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.shoulder : undefined
      case ItemSlot.Legs:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.legs : undefined
      case ItemSlot.Back:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.back : undefined
      case ItemSlot.Feet:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.feet : undefined
      case ItemSlot.Chest:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.chest : undefined
      case ItemSlot.Wrist:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.wrist : undefined
      case ItemSlot.Finger:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.finger : undefined
      case ItemSlot.Finger2:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.finger2 : undefined
      case ItemSlot.Twohand:
      case ItemSlot.Mainhand:
      case ItemSlot.Onehand:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.mainhand : undefined
      case ItemSlot.Offhand:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.offhand : undefined
      case ItemSlot.Trinket:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.trinket : undefined
      case ItemSlot.Trinket2:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.trinket2 : undefined
      case ItemSlot.Relic:
        return itemSearch && itemSearch.lockedItems ? itemSearch.lockedItems.idol : undefined
      default:
        return undefined
    }
  }

  static getWeightedEquipmentBySlot(slot: ItemSlot, itemSearch: ItemSearch) {
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

    /* Handle locked items. This is a piece of gear the user manually selected. The name of the
     * item is stored in itemSearch and retrieved by getLockedItem */
    let lockedItem = this.getLockedItem(slot, itemSearch)
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

    let result = jsonQuery(slot2query(slot), { data: gear }).value
    result = jsonQuery(`[* faction = ${itemSearch.faction} | faction = ${Faction.Horde | Faction.Alliance}]`, {
      data: result
    }).value
    result = jsonQuery(`[* phase <= ${itemSearch.phase}]`, { data: result }).value
    result = jsonQuery(`[* pvpRank <= ${itemSearch.pvpRank}]`, { data: result }).value
    result = jsonQuery(`[* worldBoss = false | worldBoss = ${itemSearch.worldBosses}]`, { data: result }).value
    result = jsonQuery(`[* raid = false | raid = ${itemSearch.raids}]`, { data: result }).value

    /* score items */
    for (let i in result) {
      result[i].score = Item.scoreItem(
        result[i],
        itemSearch.magicSchool,
        itemSearch.targetType,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
    }
    result.sort(itemSearch.sortOrder === SortOrder.Descending ? Item.sortScoreDes : Item.sortScoreAsc)
    return result
  }

  static getWeightedEnchantBySlot(slot: ItemSlot, itemSearch: ItemSearch) {
    let result = jsonQuery(`[* slot = ${slot} & phase <= ${itemSearch.phase}]`, { data: enchants }).value
    for (let i in result) {
      result[i].score = Item.scoreEnchant(
        result[i],
        itemSearch.magicSchool,
        itemSearch.spellHitWeight,
        itemSearch.spellCritWeight
      )
    }
    result.sort(itemSearch.sortOrder === SortOrder.Descending ? Item.sortScoreDes : Item.sortScoreAsc)
    return result
  }

  static getItemSet(name: string, itemSearch: ItemSearch) {
    /* Find the set and filter */
    let itemSet = this.queryItemSets(`[name=${name}]`)
    if (!itemSearch.raids && itemSet.raid) {
      return undefined
    }

    if (itemSearch.phase < itemSet.phase) {
      return undefined
    }

    /* Find each item in set, score them and add to array */
    let itemSetItems = []
    let itemSetItemsScore = 0
    for (let itemName of itemSet.itemNames) {
      let item = this.gearByName(itemName)
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
    let result = this.getWeightedEquipmentBySlot(slot, itemSearch)
    return result[0]
  }

  static getBestInSlotEnchant(slot: ItemSlot, itemSearch: ItemSearch) {
    let result = this.getWeightedEnchantBySlot(slot, itemSearch)
    return result[0]
  }

  static getBestInSlotItemWithEnchant(slot: ItemSlot, itemSearch: ItemSearch) {
    const item = this.getBestInSlotItem(slot, itemSearch)
    const enchant = this.getBestInSlotEnchant(slot, itemSearch)
    return new Item(slot, item, enchant)
  }

  static getBestInSlotChestLegsFeet(itemSearch: ItemSearch) {
    let bloodvine = undefined
    let chest = this.getBestInSlotItem(ItemSlot.Chest, itemSearch)
    let legs = this.getBestInSlotItem(ItemSlot.Legs, itemSearch)
    let feet = this.getBestInSlotItem(ItemSlot.Feet, itemSearch)
    let normScore = chest.score + legs.score + feet.score

    let customChest = itemSearch.lockedItems !== undefined && itemSearch.lockedItems.chest
    let customLegs = itemSearch.lockedItems !== undefined && itemSearch.lockedItems.legs
    let customFeet = itemSearch.lockedItems !== undefined && itemSearch.lockedItems.feet

    if (!customChest && !customLegs && !customFeet) {
      bloodvine = this.getItemSet(`Bloodvine Garb`, itemSearch)
      if (bloodvine && bloodvine.score > normScore) {
        console.log(`ATTENTION: I favored bloodvine set (${bloodvine.score}) over other items (${normScore})`)
        console.log(itemSearch)
        chest = bloodvine.items[0]
        legs = bloodvine.items[1]
        feet = bloodvine.items[2]
      }
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
    let result = this.getWeightedEquipmentBySlot(ItemSlot.Trinket, itemSearch)
    let result2 = this.getWeightedEquipmentBySlot(ItemSlot.Trinket2, itemSearch)

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
    let result = this.getWeightedEquipmentBySlot(ItemSlot.Finger, itemSearch)
    let result2 = this.getWeightedEquipmentBySlot(ItemSlot.Finger2, itemSearch)

    let ring1 = result[0]
    let ring2 = result2[0]
    if (this.isUniqueEquip(result[0]) && result[0].name === result2[0].name) {
      ring2 = result2[1]
    }

    let basicScore = (ring1 ? ring1.score : 0) + (ring2 ? ring2.score : 0)
    let customFinger = itemSearch.lockedItems !== undefined && itemSearch.lockedItems.finger
    let customFinger2 = itemSearch.lockedItems !== undefined && itemSearch.lockedItems.finger2

    if (!customFinger && !customFinger2) {
      zanzils = this.getItemSet(`Zanzil's Concentration`, itemSearch)
      if (zanzils && zanzils.score > basicScore) {
        ring1 = zanzils.items[0]
        ring2 = zanzils.items[1]
      }
    }

    console.log(ring1)
    console.log(ring2)

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

    const onehandscore = onehand !== undefined ? onehand.score : 0
    const offhandscore = offhand !== undefined ? offhand.score : 0
    const twohandscore = twohand !== undefined ? twohand.score : 0

    const _offhand = this.getLockedItemName(ItemSlot.Offhand, itemSearch)

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
}
