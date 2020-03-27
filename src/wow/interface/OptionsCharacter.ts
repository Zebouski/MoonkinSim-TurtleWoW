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
  lockedItems?: {
    head?: string,
    hands?: string,
    neck?: string,
    waist?: string,
    shoulders?: string,
    legs?: string,
    back?: string,
    feet?: string,
    chest?: string,
    finger1?: string,
    wrists?: string,
    finger2?: string,
    mainhand?: string,
    trinket1?: string,
    offhand?: string,
    trinket2?: string,
    idol?: string
  }
  talents: {
    naturesGraceRank: number
    moonFuryRank: number
    vengeanceRank: number
    improvedWrathRank: number
    improvedStarfireRank: number
    improvedMoonfireRank: number
  }
}
