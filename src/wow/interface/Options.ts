import Gender from '../enum/Gender'
import PlayableRace from '../enum/PlayableRace'
import PlayableClass from '../enum/PlayableClass'
import PvPRank from '../enum/PvPRank'
import MagicSchool from '../enum/MagicSchool'
import TargetType from '../enum/TargetType'

export default interface Options {
  debug: boolean
  phase: number
  raids: boolean
  worldBosses: boolean
  combatLength: number
  character: {
    level: number
    gender: Gender
    race: PlayableRace
    class: PlayableClass
    pvpRank: PvPRank
  }
  talents: {
    naturesGraceRank: number
    moonFuryRank: number
    vengeanceRank: number
    improvedWrathRank: number
    improvedStarfireRank: number
    improvedMoonfireRank: number
  }
  buffs: string[]
  spell: {
    name: string
  }
  target: {
    shimmer: MagicSchool
    thunderfury: number
    type: TargetType
    spellResistance: number
    debuffs: string[]
  }
}
