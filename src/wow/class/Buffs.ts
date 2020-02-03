import constants from '../constants'

/**
 * TODO: WIP. Buffs currently applied to Character.
 */
export default class Buffs {
  public powerInfusion: boolean
  public saygesDarkFortune: boolean
  public tracesOfSilithyst: boolean

  public constructor(
    powerInfusion: boolean,
    saygesDarkFortune: boolean,
    tracesOfSilithyst: boolean
  ) {
    this.powerInfusion = powerInfusion
    this.saygesDarkFortune = saygesDarkFortune
    this.tracesOfSilithyst = tracesOfSilithyst
  }

  public get powerInfusionBonus(): number {
    return this.powerInfusion ? constants.powerInfusionBonus : 1.0
  }

  public get saygesDarkFortuneBonus(): number {
    return this.saygesDarkFortune ? constants.saygesDarkFortuneBonus : 1.0
  }

  public get tracesOfSilithystBonus(): number {
    return this.tracesOfSilithyst ? constants.tracesOfSilithystBonus : 1.0
  }

  public get dmgMultipliers(): number {
    return (
      this.powerInfusionBonus *
      this.saygesDarkFortuneBonus *
      this.tracesOfSilithystBonus
    )
  }
}
