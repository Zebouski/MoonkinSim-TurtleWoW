import TargetType from '../enum/TargetType'
import Faction from '../enum/Faction'
import PvPRank from '../enum/PvPRank'
import MagicSchool from '../enum/MagicSchool'
import SortOrder from '../enum/SortOrder'

export default interface ItemSearch {
  phase: number
  faction: Faction
  pvpRank: PvPRank
  raids: boolean
  tailoring: boolean
  worldBosses: boolean
  magicSchool: MagicSchool
  targetType: TargetType
  spellHitWeight: number
  spellCritWeight: number
  sortOrder?: SortOrder
}
