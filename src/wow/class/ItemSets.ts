import ItemSlot from '../enum/ItemSlot'
import ItemQuality from '../enum/ItemQuality'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'

export default class ItemSets {
  public _slot: ItemSlot
  public itemJSON: ItemJSON | undefined
  public enchantJSON: EnchantJSON | undefined

  public constructor(slot: ItemSlot, itemJSON?: ItemJSON, enchantJSON?: EnchantJSON) {
    this._slot = slot
    this.itemJSON = itemJSON ? itemJSON : undefined
    this.enchantJSON = enchantJSON ? enchantJSON : undefined
  }
}
