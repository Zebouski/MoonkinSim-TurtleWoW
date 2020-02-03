import jsonQuery from 'json-query'
import constants from '../constants'
import SpellCoefficient from '../interface/SpellCoefficient'
import SpellJSON from '../interface/SpellJSON'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const druidSpells = require('../db/spells/druid.yaml')

/**
 * Base spell attributes. Fields are calculated only if they don't require outside
 * information, like character or target.
 */
export default class Spell {
  public name: string
  public spellJSON: SpellJSON

  public constructor(name: string) {
    this.name = name
    this.spellJSON = jsonQuery(`[name=${name}]`, { data: druidSpells }).value
  }

  /**
   * Return array of spell names.
   */
  public static getSpellNames(): JSON {
    return jsonQuery('.name', { data: druidSpells }).value
  }

  public get secondaryEffect(): string {
    return this.spellJSON.secondary
  }

  /**
   * Return spell coefficients. There are three types of spells, each with their
   * own coefficient formulas: direct, dot, and hybrid (direct + dot). Spells also
   * suffer penalties when they're below level 20 or have secondary spell
   * effects (e.g. insect swarm)
   *
   * Source: https://classicwow.live/guides/670/ozgar-s-downranking-guide-tool
   */
  public get coefficient(): SpellCoefficient {
    const baseDirectCoefficient = this.castTime / 3.5
    const spellLevelPenalty =
      this.level < 20 ? 1 - (20 - this.level) * 0.0375 : 0
    const secondaryEffectPenalty = this.secondaryEffect ? 0.05 : 0

    // direct damage spell
    if (this.type.toUpperCase() === 'DIRECT') {
      return {
        direct:
          baseDirectCoefficient *
          (1 - spellLevelPenalty) *
          (1 - secondaryEffectPenalty),
        dot: 0
      }
    }

    // dot spell
    const baseDotCoefficient = this.dotDuration / 15
    if (this.type.toUpperCase() === 'DOT') {
      return {
        direct: 0,
        dot:
          baseDotCoefficient *
          (1 - spellLevelPenalty) *
          (1 - secondaryEffectPenalty)
      }
    }

    // hybrid spell (direct + dot)
    const baseHybridCoefficient =
      baseDotCoefficient / (baseDirectCoefficient + baseDotCoefficient)
    return {
      direct:
        baseDirectCoefficient *
        (1 - baseHybridCoefficient) *
        (1 - spellLevelPenalty) *
        (1 - secondaryEffectPenalty),
      dot:
        baseDotCoefficient *
        baseHybridCoefficient *
        (1 - spellLevelPenalty) *
        (1 - secondaryEffectPenalty)
    }
  }

  /**
   * Return base (short) name, parsed from name.
   */
  public get baseName(): string {
    return this.spellJSON.name.split(' ')[0]
  }

  /**
   * Return spell type (direct, dot or hybrid)
   */
  public get type(): string {
    return this.spellJSON.type.toLowerCase()
  }

  /**
   * Return spell rank, parsed from name.
   */
  public get rank(): string {
    return this.spellJSON.name.split(' ')[2]
  }

  /**
   * Return spell minimum damage, unmodified.
   */
  public get minDmg(): number {
    return this.spellJSON.minDmg
  }

  /**
   * Return spell max damage, unmodified.
   */
  public get maxDmg(): number {
    return this.spellJSON.maxDmg
  }

  /**
   * Return spell base damage (minDmg + maxDmg) / 2.
   */
  public get baseDmg(): number {
    return (this.minDmg + this.maxDmg) / 2
  }

  /**
   * Dot dmg.
   */
  public get baseDotDmg(): number {
    return this.spellJSON.dotDmg
  }
  /**
   * Return spell school, unmodified.
   */
  public get school(): string {
    return this.spellJSON.school
  }

  /**
   * Return cast time, limited to globalCoolDown
   */
  public get castTime(): number {
    return this.spellJSON.castTime <= constants.globalCoolDown
      ? constants.globalCoolDown
      : this.spellJSON.castTime
  }

  /**
   * Dot duration.
   */
  public get dotDuration(): number {
    return this.spellJSON.dotDuration
  }

  public get dotTick(): number {
    return this.spellJSON.dotTick
  }

  /**
   * Return mana cost, unmodified.
   */
  public get manaCost(): number {
    return this.spellJSON.manaCost
  }

  /**
   * Return spell level, unmodified.
   */
  public get level(): number {
    return this.spellJSON.level
  }

  /**
   * Return spell range, unmodified.
   */
  public get range(): number {
    return this.spellJSON.range
  }
}
