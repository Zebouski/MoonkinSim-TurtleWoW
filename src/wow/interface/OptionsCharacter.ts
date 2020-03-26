import Gender from '../enum/Gender'
import PlayableRace from '../enum/PlayableRace'
import PlayableClass from '../enum/PlayableClass'
import PvPRank from '../enum/PvPRank'

export default interface OptionsCharacter {
  level: number
  gender: Gender
  race: PlayableRace
  class: PlayableClass
  pvpRank: PvPRank
  buffs: string[]
  talents: {
    naturesGraceRank: number
    moonFuryRank: number
    vengeanceRank: number
    improvedWrathRank: number
    improvedStarfireRank: number
    improvedMoonfireRank: number
  }
}
