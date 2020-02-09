/**
 * TODO: WIP. Buffs currently applied to Character.
 */
export default class Buffs {
  public moonkinAura: boolean
  public flaskOfSupremePower: boolean
  public greaterArcaneElixir: boolean
  public cerebralCortexCompound: boolean
  public runnTumTuberSurprise: boolean
  public powerInfusion: boolean
  public ephemeralPower: boolean
  public rallyingCryOfTheDragonSlayer: boolean
  public slipkiksSavvy: boolean
  public songflowerSerenade: boolean
  public saygesDarkFortune: boolean
  public tracesOfSilithyst: boolean
  public arcaneBrilliance: boolean
  public blessingOfKings: boolean
  public improvedGiftOfTheWild: boolean

  public constructor(
    moonkinAura: boolean,
    powerInfusion: boolean,
    ephemeralPower: boolean,
    flaskOfSupremePower: boolean,
    greaterArcaneElixir: boolean,
    cerebralCortexCompound: boolean,
    runnTumTuberSurprise: boolean,
    arcaneBrilliance: boolean,
    blessingOfKings: boolean,
    improvedGiftOfTheWild: boolean,
    rallyingCryOfTheDragonSlayer: boolean,
    slipkiksSavvy: boolean,
    songflowerSerenade: boolean,
    saygesDarkFortune: boolean,
    tracesOfSilithyst: boolean
  ) {
    this.moonkinAura = moonkinAura
    this.powerInfusion = powerInfusion
    this.ephemeralPower = ephemeralPower
    this.flaskOfSupremePower = flaskOfSupremePower
    this.greaterArcaneElixir = greaterArcaneElixir
    this.cerebralCortexCompound = cerebralCortexCompound
    this.runnTumTuberSurprise = runnTumTuberSurprise
    this.arcaneBrilliance = arcaneBrilliance
    this.blessingOfKings = blessingOfKings
    this.improvedGiftOfTheWild = improvedGiftOfTheWild
    this.rallyingCryOfTheDragonSlayer = rallyingCryOfTheDragonSlayer
    this.slipkiksSavvy = slipkiksSavvy
    this.songflowerSerenade = songflowerSerenade
    this.saygesDarkFortune = saygesDarkFortune
    this.tracesOfSilithyst = tracesOfSilithyst
  }

  public get moonkinAuraBonus(): number {
    return this.moonkinAura ? 3 : 0
  }

  /* CONSUMABLE BUFFS */

  public get flaskOfSupremePowerBonus(): number {
    return this.flaskOfSupremePower ? 150 : 0
  }

  public get greaterArcaneElixirBonus(): number {
    return this.greaterArcaneElixir ? 35 : 0
  }

  public get cerebralCortexCompoundBonus(): number {
    return this.cerebralCortexCompound ? 25 : 0
  }

  public get runnTumTuberSurpriseBonus(): number {
    return this.runnTumTuberSurprise ? 10 : 0
  }

  /* PROC BUFFS */

  public get powerInfusionBonus(): number {
    return this.powerInfusion ? 1.2 : 1.0
  }

  public get ephemeralPowerBonus(): number {
    return this.ephemeralPower ? 175 : 0
  }

  /* WORLD BUFFS */

  public get rallyingCryOfTheDragonSlayerSpellCritBonus(): number {
    return this.rallyingCryOfTheDragonSlayer ? 10 : 1
  }

  public get slipkiksSavvyBonus(): number {
    return this.slipkiksSavvy ? 3 : 1
  }

  public get songflowerSerenadeSpellCritBonus(): number {
    return this.songflowerSerenade ? 5 : 1
  }

  public get songflowerSerenadeAttributeBonus(): number {
    return this.songflowerSerenade ? 15 : 0
  }

  public get saygesDarkFortuneBonus(): number {
    return this.saygesDarkFortune ? 1.1 : 1.0
  }

  public get tracesOfSilithystBonus(): number {
    return this.tracesOfSilithyst ? 1.05 : 1.0
  }

  /* RAID BUFFS */

  public get arcaneBrillianceBonus(): number {
    return this.arcaneBrilliance ? 31 : 0
  }

  public get blessingOfKingsBonus(): number {
    return this.blessingOfKings ? 1.1 : 1
  }

  public get improvedGiftOfTheWildAttributeBonus(): number {
    return this.improvedGiftOfTheWild ? 16 : 0
  }

  public get improvedGiftOfTheWildArmorBonus(): number {
    return this.improvedGiftOfTheWild ? 384 : 0
  }

  public get improvedGiftOfTheWildResistancesBonus(): number {
    return this.improvedGiftOfTheWild ? 27 : 0
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
