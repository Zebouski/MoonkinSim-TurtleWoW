import Database from './Database'
import constants from '../constants'
import SpellCoefficient from '../interface/SpellCoefficient'
import SpellJSON from '../interface/SpellJSON'
import MagicSchool from '../enum/MagicSchool'

/**
 * Spell details. These are base values that don't factor in talents, spellpower, buffs, debuffs, etc.
 */
export default class Spell {
  name: string
  spellJSON: SpellJSON

  constructor(name: string) {
    this.name = name
    this.spellJSON = Database.spell(name)
  }

  /**
   * Return base (short) name, parsed from name.
   */
  get baseName(): string {
    let splitStr = this.spellJSON.name.split(' ')
    splitStr.length = splitStr.length - 2
    return splitStr.join(' ')
  }

  /**
   * Return spell rank, parsed from name.
   */
  get rank(): string {
    let splitStr = this.spellJSON.name.split(' ')
    return splitStr[splitStr.length - 1]
  }

  /**
   * Spell is Starfire
   */
  get isStarfire(): boolean {
    return this.baseName.toUpperCase() === 'STARFIRE'
  }

  /**
   * Spell is Warth
   */
  get isWrath(): boolean {
    return this.baseName.toUpperCase() === 'WRATH'
  }

  /**
   * Spell is Moonfire
   */
  get isMoonfire(): boolean {
    return this.baseName.toUpperCase() === 'MOONFIRE'
  }

  /**
   * Spell is Insect Swarm
   */
  get isInsectSwarm(): boolean {
    return this.baseName.toUpperCase() === 'INSECT SWARM'
  }

  /**
   * Spell is Hurricane
   */
  get isHurricane(): boolean {
    return this.baseName.toUpperCase() === 'HURRICANE'
  }

  get canCrit(): boolean {
    return this.isStarfire || this.isWrath || this.isMoonfire ? true : false
  }

  get canMiss(): boolean {
    return this.isStarfire || this.isWrath || this.isMoonfire || this.isInsectSwarm ? true : false
  }

  get canPartialResist(): boolean {
    return this.isStarfire || this.isWrath || this.isMoonfire || this.isInsectSwarm ? true : false
  }

  get icon(): string {
    return `${this.spellJSON.icon}.jpg`
  }

  get iconFullPath(): string {
    return process.env.BASE_URL + 'wow-icons/' + this.icon
  }

  /**
   * Return spell type (direct, periodic or hybrid)
   */
  get type(): string {
    return this.spellJSON.type.toUpperCase()
  }

  /**
   * Return spell reqLvl, unmodified.
   */
  get reqLvl(): number {
    return this.spellJSON.reqLvl
  }

  /**
   * Return cast time, limited to globalCoolDown FIXME: dont limit to gcd here
   */
  get castTime(): number {
    return Math.max(constants.globalCoolDown, this.spellJSON.castTime)
  }

  /**
   * Return spell magicSchool, unmodified.
   */
  get magicSchool(): MagicSchool {
    return this.spellJSON.magicSchool
  }

  get magicSchoolText(): string {
    return MagicSchool[this.spellJSON.magicSchool]
  }

  /**
   * is spell nature damage?
   */
  get isNature(): boolean {
    return this.magicSchool === MagicSchool.Nature
  }

  /**
   * is spell arcane damage?
   */
  get isArcane(): boolean {
    return this.magicSchool === MagicSchool.Arcane
  }

  /**
   * Return spell range, unmodified.
   */
  get range(): number {
    return this.spellJSON.range
  }

  /**
   * Return mana cost, unmodified.
   */
  get manaCost(): number {
    return this.spellJSON.manaCost
  }

  /**
   * Return spell minimum damage, unmodified.
   */
  get minDmg(): number {
    return this.spellJSON.minDmg ? this.spellJSON.minDmg : 0
  }

  /**
   * Return spell max damage, unmodified.
   */
  get maxDmg(): number {
    return this.spellJSON.maxDmg ? this.spellJSON.maxDmg : 0
  }

  /**
   * avg spell damage (minDmg + maxDmg) / 2.
   */
  get avgDmg(): number {
    return ((this.minDmg ? this.minDmg : 0) + (this.maxDmg ? this.maxDmg : 0)) / 2
  }

  get tickDmg(): number {
    return this.spellJSON.tickDmg ? this.spellJSON.tickDmg : 0
  }

  get tickRate(): number {
    return this.spellJSON.tickRate ? this.spellJSON.tickRate : 0
  }

  get ticks(): number {
    return this.duration > 0 && this.tickRate > 0 ? this.duration / this.tickRate : 0
  }

  get duration(): number {
    return this.spellJSON.duration ? this.spellJSON.duration : 0
  }

  get periodicDmg(): number {
    return this.tickDmg * (this.duration / this.tickRate)
  }

  get secondaryEffect(): string | undefined {
    return this.spellJSON.secondary
  }

  get isBinary(): boolean {
    return this.secondaryEffect && this.secondaryEffect !== '' ? true : false
  }

  /**
   * Return spell coefficients. There are three types of spells, each with their
   * own coefficient formulas: direct, periodic, and hybrid (direct + periodic). Spells also
   * suffer penalties when they're below level 20 or have secondary spell
   * effects (e.g. insect swarm)
   *
   * Source: https://classicwow.live/guides/670/ozgar-s-downranking-guide-tool
   */
  get coefficient(): SpellCoefficient {
    const baseDirectCoefficient = this.castTime / 3.5
    const spellLevelPenalty = this.reqLvl < 20 ? 1 - (20 - this.reqLvl) * 0.0375 : 0
    const secondaryEffectPenalty = this.secondaryEffect ? 0.05 : 0
    const penaltyMultiplier = (1 - spellLevelPenalty) * (1 - secondaryEffectPenalty)

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
        direct: baseDirectCoefficient * penaltyMultiplier,
        periodic: 0
      }
    }

    // periodic spell
    const basePeriodicCoefficient = this.duration ? this.duration / 15 : 0
    if (this.type.toUpperCase() === 'PERIODIC') {
      return {
        direct: 0,
        periodic: basePeriodicCoefficient * penaltyMultiplier
      }
    }

    // hybrid spell (direct + periodic)
    const baseHybridCoefficient = basePeriodicCoefficient / (baseDirectCoefficient + basePeriodicCoefficient)
    return {
      direct: baseDirectCoefficient * (1 - baseHybridCoefficient) * penaltyMultiplier,
      periodic: basePeriodicCoefficient * baseHybridCoefficient * penaltyMultiplier
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
