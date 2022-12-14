import Buffs from '../enum/Buffs'
import OptionsTarget from '../interface/OptionsTarget'
import Character from '../class/Character'
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
  options: OptionsTarget
  debuffFlags: Buffs
  constructor(options: OptionsTarget) {
    this.options = options
    this.debuffFlags = Character.buffListToFlags(options.debuffs)
  }

  get level(): number {
    return this.options.level
  }

  /* assumes character level 60 */
  get hitChance(): number {
    switch (this.level) {
      case 63:
        return 83
      case 62:
        return 94
      case 61:
        return 95
      case 60:
        return 96
      case 59:
        return 97
      case 58:
        return 98
      default:
        return 99
    }
  }

  get spellResistance(): number {
    return this.options.spellResistance
  }

  get shimmer(): MagicSchool {
    return this.options.shimmer
  }

  get spellVulnBonus(): number {
    return (this.debuffFlags & Buffs.SpellVulnerability) === Buffs.SpellVulnerability ? 1.15 : 1.0
  }

  /**
   * ...reducing Shadow and Arcane resistances by 75...
   */
  get curseOfShadowResistBonus(): number {
    return (this.debuffFlags & Buffs.CurseOfShadow) === Buffs.CurseOfShadow ? 75 : 0
  }

  /**
   * ...reducing nature resistances 25 per "jump"...
   */
  get thunderfuryResistBonus(): number {
    return this.options.thunderfury ? this.options.thunderfury * 25 : 0
  }

  /**
   * ...and increasing Shadow and Arcane damage taken by 10%...
   */
  get curseOfShadowDamageBonus(): number {
    return (this.debuffFlags & Buffs.CurseOfShadow) === Buffs.CurseOfShadow ? 1.1 : 1.0
  }

  /**
   * ..the next 2 sources of Nature damage dealt to the target are increased by 20%
   */
  get stormStrikeBonus(): number {
    return (this.debuffFlags & Buffs.StormStrike) === Buffs.StormStrike ? 1.2 : 1.0
  }

  get arcaneSpellResistance(): number {
    return this.options.spellResistance
  }

  get natureSpellResistance(): number {
    return this.options.spellResistance
  }

  get fireSpellResistance(): number {
    return this.options.spellResistance
  }

  get frostSpellResistance(): number {
    return this.options.spellResistance
  }

  get shadowSpellResistance(): number {
    return this.options.spellResistance
  }
}
