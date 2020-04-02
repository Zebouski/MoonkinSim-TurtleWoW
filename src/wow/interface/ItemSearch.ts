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
  lockedItems?: {
    head?: string
    hands?: string
    neck?: string
    waist?: string
    shoulder?: string
    legs?: string
    back?: string
    feet?: string
    chest?: string
    wrist?: string
    finger?: string
    finger2?: string
    trinket?: string
    trinket2?: string
    mainhand?: string
    offhand?: string
    idol?: string
  }
  spellHitWeight: number
  spellCritWeight: number
  sortOrder?: SortOrder
}
