import ItemSlot from '../enum/ItemSlot'

export default interface EnchantJSON {
  name: string
  slot: ItemSlot
  phase: number
  icon: string
  score: number
  text: string
  spellDamage: number
  arcaneDamage: number
  natureDamage: number
  spellHit: number
  spellCrit: number
  spellPenetration: number
  stamina: number
  intellect: number
  spirit: number
  mp5: number
}
