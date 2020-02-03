import constants from '../constants'
import Talents from './Talents'
import Gear from './Gear'
import Buffs from './Buffs'

/**
 * Stores character attributes, Talents, Gear, and Buffs
 */
export default class Character {
  public level: number
  public race: string
  public className: string
  public gender: string
  public talents: Talents
  public gear: Gear
  public buffs: Buffs

  public constructor(
    level: number,
    race: string,
    className: string,
    gender: string,
    talents: Talents,
    gear: Gear,
    buffs: Buffs
  ) {
    this.level = level
    this.race = race.toUpperCase()
    this.gender = gender.toUpperCase()
    this.className = className.toUpperCase()
    this.talents = talents
    this.gear = gear
    this.buffs = buffs
  }

  /**
   * TODO: Return faction name based on race
   */
  public get faction(): string {
    switch (this.race.toUpperCase()) {
      case 'TAUREN':
      case 'ORC':
      case 'UNDEAD':
      case 'TROLL':
        return 'Horde'
      default:
        return 'Alliance'
    }
  }

  /**
   * TODO: Return total spell power (gear + talents + buffs)
   * In the future each spell school should also have a function
   */
  public get spellPower(): number {
    return this.gear.spellPower
  }

  /**
   * TODO: Return total spell crit rating (base + gear + (int / 60) + talents + buffs)
   */
  public get spellCrit(): number {
    return Math.min(
      constants.spellBaseChanceToCrit + this.gear.spellCrit,
      constants.spellCritCap
    )
  }

  /**
   * TODO: Return total spell hit rating (gear + talents + buffs)
   */
  public get spellHit(): number {
    return Math.min(this.gear.spellHit, constants.spellHitCap)
  }

  /**
   * Chance of hitting with a spell
   *
   */
  public get spellChanceToHit(): number {
    return 83 + this.spellHit
  }

  /**
   * Chance of missing a spell
   *
   */
  public get spellChanceToMiss(): number {
    return 100 - this.spellChanceToHit
  }

  /**
   * Chance of critting with a spell
   *
   */
  public get spellChanceToCrit(): number {
    return this.spellCrit * (this.spellChanceToHit / 100)
  }

  /**
   * Chance of landing a Normal hit i.e. not a miss and not a crit
   *
   */
  public get spellChanceToNormal(): number {
    return this.spellChanceToHit - this.spellChanceToCrit
  }
}
