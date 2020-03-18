import Buff from '../enum/Buff'
import TargetType from '../enum/TargetType'
import MagicSchool from '../enum/MagicSchool'

/* XXX: I originally wanted to allow user to select a target from a list. The lack of
 * resistance information on bosses makes this pretty fruitless, so I abandoned it.
interface TargetJSON {
  name: string
  level: number
  class: string
  faction: string
  health: number
  minDmg: number
  maxDmg: number
  attackSpeed: number
  armor: number
  fireResist: number
  natureResist: number
  frostResist: number
  shadowResist: number
  arcaneResist: number
}
*/

export default class Target {
  level: number
  type: TargetType
  spellResistance: number
  debuffs: Buff
  shimmer: MagicSchool
  thunderfury: number

  constructor(
    level: number,
    type: TargetType,
    spellResistance: number,
    shimmer: MagicSchool,
    thunderfury: number,
    debuffs: Buff
  ) {
    this.level = level
    this.type = type
    this.debuffs = debuffs
    this.spellResistance = spellResistance
    this.shimmer = shimmer
    this.thunderfury = thunderfury
  }

  get spellVulnBonus(): number {
    return (this.debuffs & Buff.SpellVulnerability) === Buff.SpellVulnerability ? 1.15 : 1.0
  }

  /**
   * ...reducing Shadow and Arcane resistances by 75...
   */
  get curseOfShadowResistBonus(): number {
    return (this.debuffs & Buff.CurseOfShadow) === Buff.CurseOfShadow ? 75 : 0
  }

  /**
   * ...reducing nature resistances 25 per "jump"...
   */
  get thunderfuryResistBonus(): number {
    return this.thunderfury ? this.thunderfury * 25 : 0
  }

  /**
   * ...and increasing Shadow and Arcane damage taken by 10%...
   */
  get curseOfShadowDamageBonus(): number {
    return (this.debuffs & Buff.CurseOfShadow) === Buff.CurseOfShadow ? 1.1 : 1.0
  }

  /**
   * ..the next 2 sources of Nature damage dealt to the target are increased by 20%
   */
  get stormStrikeBonus(): number {
    return (this.debuffs & Buff.StormStrike) === Buff.StormStrike ? 1.2 : 1.0
  }

  get arcaneSpellResistance(): number {
    return this.spellResistance
  }

  get natureSpellResistance(): number {
    return this.spellResistance
  }

  get fireSpellResistance(): number {
    return this.spellResistance
  }

  get frostSpellResistance(): number {
    return this.spellResistance
  }

  get shadowSpellResistance(): number {
    return this.spellResistance
  }
}
