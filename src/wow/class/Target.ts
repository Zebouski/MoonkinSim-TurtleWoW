import jsonQuery from 'json-query'
import Buff from '../enum/Buff'
import TargetType from '../enum/TargetType'
import MagicSchool from '../enum/MagicSchool'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const targets = require('../db/targets.yaml')

/**
 * Object format of targets stored in db/targets.
 * Targets are stored as YAML, but converted to
 * JSON at build time.
 */
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

export default class Target {
  // public name: string
  public targetType: TargetType
  // public targetJSON: TargetJSON
  public spellResistance: number
  public debuffs: Buff
  public shimmer: MagicSchool

  public constructor(targetType: TargetType, spellResistance: number, shimmer: MagicSchool, debuffs: Buff) {
    // this.name = name
    this.targetType = targetType
    this.debuffs = debuffs
    this.spellResistance = spellResistance
    this.shimmer = shimmer
    // this.targetJSON = jsonQuery(`[name=${name}]`, { data: targets }).value
  }

  public get spellVulnBonus(): number {
    return (this.debuffs & Buff.SpellVulnerability) === Buff.SpellVulnerability ? 1.15 : 1.0
  }

  /**
   * ...reducing Shadow and Arcane resistances by 75...
   */
  public get curseOfShadowResistBonus(): number {
    return (this.debuffs & Buff.CurseOfShadow) === Buff.CurseOfShadow ? 75 : 0
  }

  /**
   * ...and increasing Shadow and Arcane damage taken by 10%...
   */
  public get curseOfShadowDamageBonus(): number {
    return (this.debuffs & Buff.CurseOfShadow) === Buff.CurseOfShadow ? 1.1 : 1.0
  }

  /**
   * ..the next 2 sources of Nature damage dealt to the target are increased by 20%
   */
  public get stormStrikeBonus(): number {
    return (this.debuffs & Buff.StormStrike) === Buff.StormStrike ? 1.2 : 1.0
  }

  /**
   * Return array of target names.
   */
  public static getTargetNames(): JSON {
    return jsonQuery('.name', { data: targets }).value
  }
}
