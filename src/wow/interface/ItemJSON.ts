import ItemSlot from '../enum/ItemSlot'
import ItemQuality from '../enum/ItemQuality'
import ItemClass from '../enum/ItemClass'
import ArmorSubclass from '../enum/ArmorSubclass'
import WeaponSubclass from '../enum/WeaponSubclass'
import PlayableClass from '../enum/PlayableClass'
import Faction from '../enum/Faction'
import PvPRank from '../enum/PvPRank'
import TargetType from '../enum/TargetType'

export default interface ItemJSON {
  id?: number
  name?: string
  class?: ItemClass
  subclass?: ArmorSubclass | WeaponSubclass
  slot: ItemSlot
  quality?: ItemQuality
  level?: number
  reqLevel?: number
  bop?: boolean
  unique?: boolean
  allowableClasses?: PlayableClass[]
  targetType?: TargetType
  phase?: number
  pvpRank?: PvPRank
  icon?: string
  location?: string
  boss?: string
  faction?: Faction
  score?: number
  spellDamage?: number
  arcaneDamage?: number
  natureDamage?: number
  spellHealing?: number
  spellHit?: number
  spellCrit?: number
  spellPenetration?: number
  stamina?: number
  intellect?: number
  spirit?: number
  mp5?: number
  armor?: number
  durability?: number
  minDmg?: number
  maxDmg?: number
  speed?: number
  dps?: number
}
