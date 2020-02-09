import jsonQuery from 'json-query'
import constants from '../constants'
import SpellCoefficient from '../interface/SpellCoefficient'
import SpellJSON from '../interface/SpellJSON'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const druidSpells = require('../db/spells/druid.yaml')

/**
 * Spell details. The values returned from this class are referred to as 'native'. These are raw values that don't factor
 * in talents, spellpower, buffs, debuffs, etc. These are the values you would find when looking up the spell on a site
 * such as wowhead.
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

  /**
   * Return base (short) name, parsed from name.
   */
  public get baseName(): string {
    return this.spellJSON.name.split(' ')[0]
  }

  /**
   * Spell is Starfire
   */
  public get isStarfire(): boolean {
    return this.baseName.toUpperCase() === 'STARFIRE'
  }

  /**
   * Spell is Warth
   */
  public get isWrath(): boolean {
    return this.baseName.toUpperCase() === 'WRATH'
  }

  /**
   * Spell is Moonfire
   */
  public get isMoonfire(): boolean {
    return this.baseName.toUpperCase() === 'MOONFIRE'
  }

  /**
   * Return spell rank, parsed from name.
   */
  public get rank(): string {
    return this.spellJSON.name.split(' ')[2]
  }

  /**
   * Return spell type (direct, periodic or hybrid)
   */
  public get type(): string {
    return this.spellJSON.type.toUpperCase()
  }

  /**
   * Return spell reqLvl, unmodified.
   */
  public get reqLvl(): number {
    return this.spellJSON.reqLvl
  }

  /**
   * Return cast time, limited to globalCoolDown FIXME: dont limit to gcd here
   */
  public get castTime(): number {
    return Math.max(constants.globalCoolDown, this.spellJSON.castTime)
  }

  /**
   * Return spell school, unmodified.
   */
  public get school(): string {
    return this.spellJSON.school
  }

  /**
   * is spell nature damage?
   */
  public get isNature(): boolean {
    return this.school.toUpperCase() === 'NATURE'
  }

  /**
   * is spell arcane damage?
   */
  public get isArcane(): boolean {
    return this.school.toUpperCase() === 'ARCANE'
  }

  /**
   * Return spell range, unmodified.
   */
  public get range(): number {
    return this.spellJSON.range
  }

  /**
   * Return mana cost, unmodified.
   */
  public get manaCost(): number {
    return this.spellJSON.manaCost
  }

  /**
   * Return spell minimum damage, unmodified.
   */
  public get minDmg(): number {
    return this.spellJSON.minDmg ? this.spellJSON.minDmg : 0
  }

  /**
   * Return spell max damage, unmodified.
   */
  public get maxDmg(): number {
    return this.spellJSON.maxDmg ? this.spellJSON.maxDmg : 0
  }

  /**
   * avg spell damage (minDmg + maxDmg) / 2.
   */
  public get avgDmg(): number {
    return ((this.minDmg ? this.minDmg : 0) + (this.maxDmg ? this.maxDmg : 0)) / 2
  }

  public get tickDmg(): number {
    return this.spellJSON.tickDmg ? this.spellJSON.tickDmg : 0
  }

  public get tickRate(): number {
    return this.spellJSON.tickRate ? this.spellJSON.tickRate : 0
  }

  public get ticks(): number {
    return this.duration > 0 && this.tickRate > 0 ? this.duration / this.tickRate : 0
  }

  public get duration(): number {
    return this.spellJSON.duration ? this.spellJSON.duration : 0
  }

  public get periodicDmg(): number {
    return this.tickDmg * (this.duration / this.tickRate)
  }

  public get secondaryEffect(): string | undefined {
    return this.spellJSON.secondary
  }

  /**
   * Return spell coefficients. There are three types of spells, each with their
   * own coefficient formulas: direct, periodic, and hybrid (direct + periodic). Spells also
   * suffer penalties when they're below level 20 or have secondary spell
   * effects (e.g. insect swarm)
   *
   * Source: https://classicwow.live/guides/670/ozgar-s-downranking-guide-tool
   */
  public get coefficient(): SpellCoefficient {
    const baseDirectCoefficient = this.castTime / 3.5
    const spellLevelPenalty = this.reqLvl < 20 ? 1 - (20 - this.reqLvl) * 0.0375 : 0
    const secondaryEffectPenalty = this.secondaryEffect ? 0.05 : 0

    // (TODO: this is dumb and only applies to hurricane. i'm guessing the 3 here is the
    // number of mobs, but don't know if that's accurate)
    if (this.baseName.toUpperCase() === 'HURRICANE') {
      return {
        direct: 0,
        periodic: (1 * (1 - secondaryEffectPenalty)) / 3
      }
    }

    // direct damage spell
    if (this.type.toUpperCase() === 'DIRECT') {
      return {
        direct: baseDirectCoefficient * (1 - spellLevelPenalty) * (1 - secondaryEffectPenalty),
        periodic: 0
      }
    }

    // periodic spell
    const basePeriodicCoefficient = this.duration ? this.duration / 15 : 0
    if (this.type.toUpperCase() === 'PERIODIC') {
      return {
        direct: 0,
        periodic: basePeriodicCoefficient * (1 - spellLevelPenalty) * (1 - secondaryEffectPenalty)
      }
    }

    // hybrid spell (direct + periodic)
    const baseHybridCoefficient = basePeriodicCoefficient / (baseDirectCoefficient + basePeriodicCoefficient)
    return {
      direct:
        baseDirectCoefficient * (1 - baseHybridCoefficient) * (1 - spellLevelPenalty) * (1 - secondaryEffectPenalty),
      periodic: basePeriodicCoefficient * baseHybridCoefficient * (1 - spellLevelPenalty) * (1 - secondaryEffectPenalty)
    }
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this)
    const jsonObj: any = Object.assign({}, this)

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key]
            jsonObj[key] = val
          } catch (error) {
            console.error(`Error calling getter ${key}`, error)
          }
        }
      })

    return jsonObj
  }
}
