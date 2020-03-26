import constants from '../constants'
import Equipment from './Equipment'

import PlayableRace from '../enum/PlayableRace'
import Faction from '../enum/Faction'
import Buffs from '../enum/Buffs'

import OptionsCharacter from '../interface/OptionsCharacter'

declare type BuffFlagType = keyof typeof Buffs

/**
 * Stores character attributes, Talents, Gear, and Buffs
 */
export default class Character {
  options: OptionsCharacter
  equipment: Equipment
  buffFlags: Buffs

  constructor(options: OptionsCharacter, equipment: Equipment) {
    this.options = options
    this.equipment = equipment
    this.buffFlags = Character.buffListToFlags(options.buffs)
  }

  static buffListToFlags(buffList: string[]): Buffs {
    let buffs: Buffs = Buffs.None

    for (let buffName of buffList) {
      buffs |= Buffs[buffName as BuffFlagType]
    }
    return buffs
  }

  static factionFromRace(race: PlayableRace): Faction {
    switch (race) {
      case PlayableRace.Tauren:
      case PlayableRace.Orc:
      case PlayableRace.Undead:
      case PlayableRace.Troll:
        return Faction.Horde
      default:
        return Faction.Alliance
    }
  }

  get level(): number {
    return this.options.level
  }

  get faction(): Faction {
    return Character.factionFromRace(this.options.race)
  }

  get isHorde(): boolean {
    return (this.faction & Faction.Horde) === Faction.Horde
  }

  get isAlliance(): boolean {
    return (this.faction & Faction.Alliance) === Faction.Alliance
  }

  get isTauren(): boolean {
    return this.options.race === PlayableRace.Tauren
  }

  get isNightElf(): boolean {
    return this.options.race === PlayableRace.NightElf
  }

  /**
   * TODO: https://classicwow.live/guides/46/basic-stats-sheet
   */

  get baseIntellect(): number {
    return (this.isNightElf ? 100 : 95) + this.equipment.intellect
  }

  get intellect(): number {
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

  get baseSpirit(): number {
    return (this.isNightElf ? 100 : 95) + this.equipment.spirit
  }

  get enduranceRacialBonus(): number {
    return this.isTauren ? 1.05 : 1
  }

  get baseStamina(): number {
    switch (this.options.race) {
      case PlayableRace.Tauren:
        return 72
      case PlayableRace.NightElf:
        return 69
      default:
        return 0
    }
  }

  get nativeHealth(): number {
    return 1483
  }

  get baseHealth(): number {
    switch (this.options.race) {
      case PlayableRace.Tauren:
        return this.nativeHealth + 10 * this.baseStamina
      case PlayableRace.NightElf:
        return this.nativeHealth + 10 * this.baseStamina
      default:
        return 0
    }
  }

  get nativeMana(): number {
    return 1244
  }

  get spellDamage(): number {
    return this.equipment.spellDamage
  }

  get arcaneDamage(): number {
    return this.equipment.arcaneDamage + this.equipment.spellDamage
  }

  get natureDamage(): number {
    return this.equipment.natureDamage + this.equipment.spellDamage
  }

  get spellCritFromIntellect(): number {
    return this.intellect / 60
  }

  get actualSpellCrit(): number {
    return constants.baseSpellCrit + this.spellCritFromIntellect + this.equipment.spellCrit
  }

  /**
   * TODO: Return total spell crit rating (base + gear + (int / 60) + talents + buffs)
   */
  get spellCrit(): number {
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
   * TODO: Return total spell hit rating (equipment + talents + buffs)
   */
  get spellHit(): number {
    return Math.min(this.equipment.spellHit, constants.spellHitCap)
  }

  get moonkinAuraBonus(): number {
    return (this.buffFlags & Buffs.MoonkinAura) === Buffs.MoonkinAura ? 3 : 0
  }

  /* CONSUMABLE BUFFS */

  get flaskOfSupremePowerBonus(): number {
    return (this.buffFlags & Buffs.FlaskOfSupremePower) === Buffs.FlaskOfSupremePower ? 150 : 0
  }

  get greaterArcaneElixirBonus(): number {
    return (this.buffFlags & Buffs.GreaterArcaneElixir) === Buffs.GreaterArcaneElixir ? 35 : 0
  }

  get cerebralCortexCompoundBonus(): number {
    return (this.buffFlags & Buffs.CerebralCortexCompound) === Buffs.CerebralCortexCompound ? 25 : 0
  }

  get runnTumTuberSurpriseBonus(): number {
    return (this.buffFlags & Buffs.RunnTumTuberSurprise) === Buffs.RunnTumTuberSurprise ? 10 : 0
  }

  /* PROC BUFFS */

  get powerInfusionBonus(): number {
    return (this.buffFlags & Buffs.PowerInfusion) === Buffs.PowerInfusion ? 1.2 : 1.0
  }

  get ephemeralPowerBonus(): number {
    return (this.buffFlags & Buffs.EphemeralPower) === Buffs.EphemeralPower ? 175 : 0
  }

  /* WORLD BUFFS */

  get rallyingCryOfTheDragonSlayerSpellCritBonus(): number {
    return (this.buffFlags & Buffs.RallyingCryOfTheDragonSlayer) === Buffs.RallyingCryOfTheDragonSlayer ? 10 : 0
  }

  get slipkiksSavvyBonus(): number {
    return (this.buffFlags & Buffs.SlipkiksSavvy) === Buffs.SlipkiksSavvy ? 3 : 0
  }

  get songflowerSerenadeSpellCritBonus(): number {
    return (this.buffFlags & Buffs.SongflowerSerenade) === Buffs.SongflowerSerenade ? 5 : 0
  }

  get songflowerSerenadeAttributeBonus(): number {
    return (this.buffFlags & Buffs.SongflowerSerenade) === Buffs.SongflowerSerenade ? 15 : 0
  }

  get saygesDarkFortuneBonus(): number {
    return (this.buffFlags & Buffs.SaygesDarkFortune) === Buffs.SaygesDarkFortune ? 1.1 : 1.0
  }

  get tracesOfSilithystBonus(): number {
    return (this.buffFlags & Buffs.TracesOfSilithyst) === Buffs.TracesOfSilithyst ? 1.05 : 1.0
  }

  /* RAID BUFFS */

  get arcaneBrillianceBonus(): number {
    return (this.buffFlags & Buffs.ArcaneBrilliance) === Buffs.ArcaneBrilliance ? 31 : 0
  }

  get blessingOfKingsBonus(): number {
    return (this.buffFlags & Buffs.BlessingOfKings) === Buffs.BlessingOfKings ? 1.1 : 1
  }

  get improvedGiftOfTheWildAttributeBonus(): number {
    return (this.buffFlags & Buffs.ImprovedGiftOfTheWild) === Buffs.ImprovedGiftOfTheWild ? 16 : 0
  }

  get improvedGiftOfTheWildArmorBonus(): number {
    return (this.buffFlags & Buffs.ImprovedGiftOfTheWild) === Buffs.ImprovedGiftOfTheWild ? 384 : 0
  }

  get improvedGiftOfTheWildResistancesBonus(): number {
    return (this.buffFlags & Buffs.ImprovedGiftOfTheWild) === Buffs.ImprovedGiftOfTheWild ? 27 : 0
  }

  get burningAdrenalineDamageBonus(): number {
    return (this.buffFlags & Buffs.BurningAdrenaline) === Buffs.BurningAdrenaline ? 2 : 1
  }

  get burningAdrenalineCastTimeBonus(): number {
    return (this.buffFlags & Buffs.BurningAdrenaline) === Buffs.BurningAdrenaline ? 3.5 : 0
  }

  /* TALENTS */
  get improvedMoonfireBonus(): number {
    switch (this.options.talents.improvedMoonfireRank) {
      case 1:
        return 1.02 // rank 1: 2% bonus
      case 2:
        return 1.04 // rank 2: 4% bonus
      case 3:
        return 1.06 // rank 3: 6% bonus
      case 4:
        return 1.08 // rank 4: 8% bonus
      case 5:
        return 1.1 // rank 5: 10% bonus
      default:
        return 1.0 // rank 0: 0% bonus
    }
  }

  /**
   * Increases the damage done by Starfire, Moonfire, and Wrath by 2/4/6/8/10%
   */
  get moonFuryBonus(): number {
    switch (this.options.talents.moonFuryRank) {
      case 1:
        return 1.02 // rank 1: 2% bonus
      case 2:
        return 1.04 // rank 2: 4% bonus
      case 3:
        return 1.06 // rank 3: 6% bonus
      case 4:
        return 1.08 // rank 4: 8% bonus
      case 5:
        return 1.1 // rank 5: 10% bonus
      default:
        return 1.0 // rank 0: 0% bonus
    }
  }

  /**
   * Reduces the cast of your Wrath spell by 0.1/0.2/0.3/0.4/0.5 sec
   */
  get improvedWrathBonus(): number {
    switch (this.options.talents.improvedWrathRank) {
      case 1:
        return 0.1 // Reduces the cast time of your Wrath spell by 0.1 sec.
      case 2:
        return 0.2 // Reduces the cast time of your Wrath spell by 0.2 sec.
      case 3:
        return 0.3 // Reduces the cast time of your Wrath spell by 0.3 sec.
      case 4:
        return 0.4 // Reduces the cast time of your Wrath spell by 0.4 sec.
      case 5:
        return 0.5 // Reduces the cast time of your Wrath spell by 0.5 sec.
      default:
        return 0
    }
  }

  /**
   * Reduces the cast of your Starfire spell by 0.1/0.2/0.3/0.4/0.5 sec
   */
  get improvedStarfireBonus(): number {
    switch (this.options.talents.improvedStarfireRank) {
      case 1:
        return 0.1 // Reduces the cast time of your Starfire spell by 0.1 sec.
      case 2:
        return 0.2 // Reduces the cast time of your Starfire spell by 0.2 sec.
      case 3:
        return 0.3 // Reduces the cast time of your Starfire spell by 0.3 sec.
      case 4:
        return 0.4 // Reduces the cast time of your Starfire spell by 0.4 sec.
      case 5:
        return 0.5 // Reduces the cast time of your Starfire spell by 0.5 sec.
      default:
        return 0
    }
  }

  /**
   * Increases the critical strike damage bonus of your Starfire, Moonfire, and Wrath spells by x%.
   */
  get vengeanceBonus(): number {
    switch (this.options.talents.vengeanceRank) {
      case 1:
        return 0.1 // rank 1: Increases the critical strike damage bonus by 20%
      case 2:
        return 0.2 // rank 2: Increases the critical strike damage bonus by 40%
      case 3:
        return 0.3 // rank 3: Increases the critical strike damage bonus by 60%
      case 4:
        return 0.4 // rank 4: Increases the critical strike damage bonus by 80%
      case 5:
        return 0.5 // rank 5: Increases the critical strike damage bonus by 100%
      default:
        return 0.0
    }
  }

  /**
   * Returns natures grace reduction, if the talent is learned
   */
  get naturesGraceBonus(): number {
    return this.options.talents.naturesGraceRank === 1 ? 0.5 : 0
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
