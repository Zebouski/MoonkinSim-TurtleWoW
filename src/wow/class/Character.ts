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

  public get isHorde(): boolean {
    return this.faction.toUpperCase() === 'HORDE'
  }

  public get isAlliance(): boolean {
    return this.faction.toUpperCase() === 'ALLIANCE'
  }

  public get isTauren(): boolean {
    return this.race.toUpperCase() === 'TAUREN'
  }

  public get isNightElf(): boolean {
    return this.race.toUpperCase() === 'NIGHTELF'
  }

  /**
   * TODO: https://classicwow.live/guides/46/basic-stats-sheet
   */

  public get baseIntellect(): number {
    return (this.isNightElf ? 100 : 95) + this.gear.intellect
  }

  public get intellect(): number {
    return (
      (this.baseIntellect +
        this.buffs.arcaneBrillianceBonus +
        this.buffs.improvedGiftOfTheWildAttributeBonus +
        this.buffs.songflowerSerenadeAttributeBonus +
        this.buffs.cerebralCortexCompoundBonus +
        this.buffs.runnTumTuberSurpriseBonus) *
      (this.isAlliance ? this.buffs.blessingOfKingsBonus : 1)
    )
  }

  public get baseSpirit(): number {
    return (this.isNightElf ? 100 : 95) + this.gear.spirit
  }

  public get enduranceRacialBonus(): number {
    return this.isTauren ? 1.05 : 1
  }

  public get baseStamina(): number {
    switch (this.race.toUpperCase()) {
      case 'TAUREN':
        return 72
      case 'NIGHTELF':
        return 69
      default:
        return 0
    }
  }

  public get nativeHealth(): number {
    return 1483
  }

  public get baseHealth(): number {
    switch (this.race.toUpperCase()) {
      case 'TAUREN':
        return this.nativeHealth + 10 * this.baseStamina
      case 'NIGHTELF':
        return this.nativeHealth + 10 * this.baseStamina
      default:
        return 0
    }
  }

  public get nativeMana(): number {
    return 1244
  }

  public get spellDamage(): number {
    return this.gear.spellDamage
  }

  public get arcaneDamage(): number {
    return this.gear.arcaneDamage + this.gear.spellDamage
  }

  public get natureDamage(): number {
    return this.gear.natureDamage + this.gear.spellDamage
  }

  public get spellCritFromIntellect(): number {
    return this.intellect / 60
  }

  public get baseSpellCrit(): number {
    return constants.baseSpellChanceToCrit + this.spellCritFromIntellect + this.gear.spellCrit
  }

  /**
   * TODO: Return total spell crit rating (base + gear + (int / 60) + talents + buffs)
   */
  public get spellCrit(): number {
    return Math.min(
      constants.spellCritCap,
      this.baseSpellCrit +
        this.buffs.rallyingCryOfTheDragonSlayerSpellCritBonus +
        this.buffs.moonkinAuraBonus +
        this.buffs.slipkiksSavvyBonus +
        this.buffs.songflowerSerenadeSpellCritBonus
    )
  }

  /**
   * TODO: Return total spell hit rating (gear + talents + buffs)
   */
  public get spellHit(): number {
    return Math.min(this.gear.spellHit, constants.spellHitCap)
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
