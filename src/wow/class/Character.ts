import constants from '../constants'
import Talents from './Talents'
import Gear from './Gear'

import PlayableRace from '../enum/PlayableRace'
import PlayableClass from '../enum/PlayableClass'
import Gender from '../enum/Gender'
import Faction from '../enum/Faction'
import Buff from '../enum/Buff'

declare type BuffFlagType = keyof typeof Buff

/**
 * Stores character attributes, Talents, Gear, and Buffs
 */
export default class Character {
  public level: number
  public playerRace: PlayableRace
  public playableClass: PlayableClass
  public gender: Gender
  public talents: Talents
  public gear: Gear
  public buffs: Buff

  public constructor(
    level: number,
    playableRace: PlayableRace,
    playableClass: PlayableClass,
    gender: Gender,
    talents: Talents,
    gear: Gear,
    buffs: Buff
  ) {
    this.level = level
    this.playerRace = playableRace
    this.gender = gender
    this.playableClass = playableClass
    this.talents = talents
    this.gear = gear
    this.buffs = buffs
  }

  /**
   * TODO: Return faction name based on race
   */
  public get faction(): Faction {
    switch (this.playerRace) {
      case PlayableRace.Tauren:
      case PlayableRace.Orc:
      case PlayableRace.Undead:
      case PlayableRace.Troll:
        return Faction.Horde
      default:
        return Faction.Alliance
    }
  }

  public get isHorde(): boolean {
    return (this.faction & Faction.Horde) === Faction.Horde
  }

  public get isAlliance(): boolean {
    return (this.faction & Faction.Alliance) === Faction.Alliance
  }

  public get isTauren(): boolean {
    return this.playerRace === PlayableRace.Tauren
  }

  public get isNightElf(): boolean {
    return this.playerRace === PlayableRace.NightElf
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
        this.arcaneBrillianceBonus +
        this.improvedGiftOfTheWildAttributeBonus +
        this.songflowerSerenadeAttributeBonus +
        this.cerebralCortexCompoundBonus +
        this.runnTumTuberSurpriseBonus) *
      (this.isAlliance ? this.blessingOfKingsBonus : 1)
    )
  }

  public get baseSpirit(): number {
    return (this.isNightElf ? 100 : 95) + this.gear.spirit
  }

  public get enduranceRacialBonus(): number {
    return this.isTauren ? 1.05 : 1
  }

  public get baseStamina(): number {
    switch (this.playerRace) {
      case PlayableRace.Tauren:
        return 72
      case PlayableRace.NightElf:
        return 69
      default:
        return 0
    }
  }

  public get nativeHealth(): number {
    return 1483
  }

  public get baseHealth(): number {
    switch (this.playerRace) {
      case PlayableRace.Tauren:
        return this.nativeHealth + 10 * this.baseStamina
      case PlayableRace.NightElf:
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

  public get actualSpellCrit(): number {
    return constants.baseSpellCrit + this.spellCritFromIntellect + this.gear.spellCrit
  }

  /**
   * TODO: Return total spell crit rating (base + gear + (int / 60) + talents + buffs)
   */
  public get spellCrit(): number {
    return Math.min(
      constants.spellCritCap,
      this.actualSpellCrit +
        this.rallyingCryOfTheDragonSlayerSpellCritBonus +
        this.moonkinAuraBonus +
        this.slipkiksSavvyBonus +
        this.songflowerSerenadeSpellCritBonus
    )
  }

  /**
   * TODO: Return total spell hit rating (gear + talents + buffs)
   */
  public get spellHit(): number {
    return Math.min(this.gear.spellHit, constants.spellHitCap)
  }

  public static buffListToFlags(buffList: string[]): Buff {
    let buffs: Buff = Buff.None

    for (let buffName of buffList) {
      buffs |= Buff[buffName as BuffFlagType]
    }
    return buffs
  }

  public get moonkinAuraBonus(): number {
    return (this.buffs & Buff.MoonkinAura) === Buff.MoonkinAura ? 3 : 0
  }

  /* CONSUMABLE BUFFS */

  public get flaskOfSupremePowerBonus(): number {
    return (this.buffs & Buff.FlaskOfSupremePower) === Buff.FlaskOfSupremePower ? 150 : 0
  }

  public get greaterArcaneElixirBonus(): number {
    return (this.buffs & Buff.GreaterArcaneElixir) === Buff.GreaterArcaneElixir ? 35 : 0
  }

  public get cerebralCortexCompoundBonus(): number {
    return (this.buffs & Buff.CerebralCortexCompound) === Buff.CerebralCortexCompound ? 25 : 0
  }

  public get runnTumTuberSurpriseBonus(): number {
    return (this.buffs & Buff.RunnTumTuberSurprise) === Buff.RunnTumTuberSurprise ? 10 : 0
  }

  /* PROC BUFFS */

  public get powerInfusionBonus(): number {
    return (this.buffs & Buff.PowerInfusion) === Buff.PowerInfusion ? 1.2 : 1.0
  }

  public get ephemeralPowerBonus(): number {
    return (this.buffs & Buff.EphemeralPower) === Buff.EphemeralPower ? 175 : 0
  }

  /* WORLD BUFFS */

  public get rallyingCryOfTheDragonSlayerSpellCritBonus(): number {
    return (this.buffs & Buff.RallyingCryOfTheDragonSlayer) === Buff.RallyingCryOfTheDragonSlayer ? 10 : 0
  }

  public get slipkiksSavvyBonus(): number {
    return (this.buffs & Buff.SlipkiksSavvy) === Buff.SlipkiksSavvy ? 3 : 0
  }

  public get songflowerSerenadeSpellCritBonus(): number {
    return (this.buffs & Buff.SongflowerSerenade) === Buff.SongflowerSerenade ? 5 : 0
  }

  public get songflowerSerenadeAttributeBonus(): number {
    return (this.buffs & Buff.SongflowerSerenade) === Buff.SongflowerSerenade ? 15 : 0
  }

  public get saygesDarkFortuneBonus(): number {
    return (this.buffs & Buff.SaygesDarkFortune) === Buff.SaygesDarkFortune ? 1.1 : 1.0
  }

  public get tracesOfSilithystBonus(): number {
    return (this.buffs & Buff.TracesOfSilithyst) === Buff.TracesOfSilithyst ? 1.05 : 1.0
  }

  /* RAID BUFFS */

  public get arcaneBrillianceBonus(): number {
    return (this.buffs & Buff.ArcaneBrilliance) === Buff.ArcaneBrilliance ? 31 : 0
  }

  public get blessingOfKingsBonus(): number {
    return (this.buffs & Buff.BlessingOfKings) === Buff.BlessingOfKings ? 1.1 : 1
  }

  public get improvedGiftOfTheWildAttributeBonus(): number {
    return (this.buffs & Buff.ImprovedGiftOfTheWild) === Buff.ImprovedGiftOfTheWild ? 16 : 0
  }

  public get improvedGiftOfTheWildArmorBonus(): number {
    return (this.buffs & Buff.ImprovedGiftOfTheWild) === Buff.ImprovedGiftOfTheWild ? 384 : 0
  }

  public get improvedGiftOfTheWildResistancesBonus(): number {
    return (this.buffs & Buff.ImprovedGiftOfTheWild) === Buff.ImprovedGiftOfTheWild ? 27 : 0
  }

  public get burningAdrenalineDamageBonus(): number {
    return (this.buffs & Buff.BurningAdrenaline) === Buff.BurningAdrenaline ? 2 : 1
  }

  public get burningAdrenalineCastTimeBonus(): number {
    return (this.buffs & Buff.BurningAdrenaline) === Buff.BurningAdrenaline ? 3.5 : 0
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
