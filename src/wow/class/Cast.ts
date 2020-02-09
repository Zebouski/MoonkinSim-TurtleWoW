import constants from '../constants'
import Character from './Character'
import Spell from './Spell'
import Target from './Target'
import CastDmgValues from '../interface/CastDmgValues'
import CastDmgObject from '../interface/CastDmgObject'

/**
 * A Spell cast by Character at Target.
 */
export default class Cast {
  public character: Character
  public spell: Spell
  public target: Target

  public constructor(character: Character, spell: Spell, target: Target) {
    this.character = character
    this.spell = spell
    this.target = target
  }

  public get normalDmg(): CastDmgObject {
    let myObj = {} as CastDmgObject
    myObj.base = {} as CastDmgValues
    myObj.actual = {} as CastDmgValues
    myObj.effective = {} as CastDmgValues

    let _baseDmg = (dmg: number) => {
      return dmg * this.baseDmgMultiplier
    }

    let _actualDmg = (dmg: number) => {
      return dmg + this.spell.coefficient.direct * this.effectiveSpellDamage
    }

    let _effectiveDmg = (dmg: number) => {
      return dmg * this.effectiveDmgMultiplier
    }

    myObj.base.min = _baseDmg(this.spell.minDmg)
    myObj.base.max = _baseDmg(this.spell.maxDmg)
    myObj.base.avg = _baseDmg(this.spell.avgDmg)
    myObj.base.text = `${myObj.base.avg.toFixed(0)} (${myObj.base.min.toFixed(0)} - ${myObj.base.max.toFixed(0)})`

    myObj.actual.min = _actualDmg(myObj.base.min)
    myObj.actual.max = _actualDmg(myObj.base.max)
    myObj.actual.avg = _actualDmg(myObj.base.avg)
    myObj.actual.text = `${myObj.actual.avg.toFixed(0)} (${myObj.actual.min.toFixed(0)} - ${myObj.actual.max.toFixed(
      0
    )})`

    myObj.effective.min = _effectiveDmg(myObj.actual.min)
    myObj.effective.max = _effectiveDmg(myObj.actual.max)
    myObj.effective.avg = _effectiveDmg(myObj.actual.avg)
    myObj.effective.text = `${myObj.effective.avg.toFixed(0)} (${myObj.effective.min.toFixed(
      0
    )} - ${myObj.effective.max.toFixed(0)})`

    return myObj
  }

  public get critDmg(): CastDmgObject {
    let myObj = {} as CastDmgObject
    myObj.base = {} as CastDmgValues
    myObj.actual = {} as CastDmgValues
    myObj.effective = {} as CastDmgValues
    let normalObj = this.normalDmg

    let _critDmg = (dmg: number) => {
      return dmg * this.spellCritMultiplier
    }

    myObj.base.min = _critDmg(normalObj.base.min)
    myObj.base.max = _critDmg(normalObj.base.max)
    myObj.base.avg = _critDmg(normalObj.base.avg)
    myObj.base.text = `${myObj.base.avg.toFixed(0)} (${myObj.base.min.toFixed(0)} - ${myObj.base.max.toFixed(0)})`

    myObj.actual.min = _critDmg(normalObj.actual.min)
    myObj.actual.max = _critDmg(normalObj.actual.max)
    myObj.actual.avg = _critDmg(normalObj.actual.avg)
    myObj.actual.text = `${myObj.actual.avg.toFixed(0)} (${myObj.actual.min.toFixed(0)} - ${myObj.actual.max.toFixed(
      0
    )})`

    myObj.effective.min = _critDmg(normalObj.effective.min)
    myObj.effective.max = _critDmg(normalObj.effective.max)
    myObj.effective.avg = _critDmg(normalObj.effective.avg)
    myObj.effective.text = `${myObj.effective.avg.toFixed(0)} (${myObj.effective.min.toFixed(
      0
    )} - ${myObj.effective.max.toFixed(0)})`

    return myObj
  }

  public get periodicDmg(): CastDmgObject {
    let myObj = {} as CastDmgObject
    myObj.base = {} as CastDmgValues
    myObj.actual = {} as CastDmgValues
    myObj.effective = {} as CastDmgValues

    myObj.base.tick = this.spell.tickDmg > 0 ? this.spell.tickDmg * this.baseDmgMultiplier : 0
    myObj.base.total = this.spell.tickDmg > 0 ? myObj.base.tick * (this.spell.duration / this.spell.tickRate) : 0
    myObj.base.tickText = `${myObj.base.tick.toFixed(0)} every ${this.spell.tickRate} sec`
    myObj.base.totalText = `${myObj.base.total.toFixed(0)} over ${this.spell.duration} sec`

    myObj.actual.tick =
      this.spell.tickDmg > 0
        ? myObj.base.tick + (this.spell.coefficient.periodic / this.spell.ticks) * this.effectiveSpellDamage
        : 0
    myObj.actual.total = this.spell.tickDmg > 0 ? myObj.actual.tick * (this.spell.duration / this.spell.tickRate) : 0
    myObj.actual.tickText = `${myObj.actual.tick.toFixed(0)} every ${this.spell.tickRate} sec`
    myObj.actual.totalText = `${myObj.actual.total.toFixed(0)} over ${this.spell.duration} sec`

    myObj.effective.tick = this.spell.tickDmg > 0 ? myObj.actual.tick * this.effectiveDmgMultiplier : 0
    myObj.effective.total =
      this.spell.tickDmg > 0 ? myObj.effective.tick * (this.spell.duration / this.spell.tickRate) : 0
    myObj.effective.tickText = `${myObj.effective.tick.toFixed(0)} every ${this.spell.tickRate} sec`
    myObj.effective.totalText = `${myObj.effective.total.toFixed(0)} over ${this.spell.duration} sec`

    return myObj
  }

  public get dps(): CastDmgObject {
    let myObj = {} as CastDmgObject
    myObj.base = {} as CastDmgValues
    myObj.actual = {} as CastDmgValues
    myObj.effective = {} as CastDmgValues

    let _dps = (normalDmg: number, critDmg: number) => {
      return (normalDmg * this.spellChanceToNormal + critDmg * this.spellChanceToCrit) / 100 / this.effectiveCastTime
    }

    myObj.base.min = _dps(this.normalDmg.base.min, this.critDmg.base.min)
    myObj.base.max = _dps(this.normalDmg.base.max, this.critDmg.base.max)
    myObj.base.avg = _dps(this.normalDmg.base.avg, this.critDmg.base.avg)
    myObj.base.text = `${myObj.base.avg.toFixed(0)} (${myObj.base.min.toFixed(0)} - ${myObj.base.max.toFixed(0)})`

    myObj.actual.min = _dps(this.normalDmg.actual.min, this.critDmg.actual.min)
    myObj.actual.max = _dps(this.normalDmg.actual.max, this.critDmg.actual.max)
    myObj.actual.avg = _dps(this.normalDmg.actual.avg, this.critDmg.actual.avg)
    myObj.actual.text = `${myObj.actual.avg.toFixed(0)} (${myObj.actual.min.toFixed(0)} - ${myObj.actual.max.toFixed(
      0
    )})`

    myObj.effective.min = _dps(this.normalDmg.effective.min, this.critDmg.effective.min)
    myObj.effective.max = _dps(this.normalDmg.effective.max, this.critDmg.effective.max)
    myObj.effective.avg = _dps(this.normalDmg.effective.avg, this.critDmg.effective.avg)
    myObj.effective.text = `${myObj.effective.avg.toFixed(0)} (${myObj.effective.min.toFixed(
      0
    )} - ${myObj.effective.max.toFixed(0)})`

    return myObj
  }

  public get periodicDPS(): CastDmgObject {
    let myObj = {} as CastDmgObject
    myObj.base = {} as CastDmgValues
    myObj.actual = {} as CastDmgValues
    myObj.effective = {} as CastDmgValues

    myObj.base.dps = this.periodicDmg.base.total > 0 ? this.periodicDmg.base.total / this.spell.duration : 0
    myObj.actual.dps = this.periodicDmg.actual.total > 0 ? this.periodicDmg.actual.total / this.spell.duration : 0
    myObj.effective.dps =
      this.periodicDmg.effective.total > 0 ? this.periodicDmg.effective.total / this.spell.duration : 0

    myObj.base.text = `${myObj.base.dps.toFixed(0)}`
    myObj.actual.text = `${myObj.actual.dps.toFixed(0)}`
    myObj.effective.text = `${myObj.effective.dps.toFixed(0)}`

    return myObj
  }

  public get moonFuryBonus(): number {
    return this.spell.isMoonfire || this.spell.isStarfire || this.spell.isWrath
      ? this.character.talents.moonFuryBonus
      : 1.0
  }

  public get improvedMoonfireBonus(): number {
    return this.spell.isMoonfire ? this.character.talents.improvedMoonfireBonus : 1.0
  }

  public get improvedMoonfireSpellCritBonus(): number {
    return (this.improvedMoonfireBonus - 1) * 100
  }

  public get curseOfShadowDamageBonus(): number {
    return this.spell.isArcane ? this.target.debuffs.curseOfShadowDamageBonus : 1.0
  }

  public get curseOfShadowResistBonus(): number {
    return this.spell.isArcane ? this.target.debuffs.curseOfShadowResistBonus : 0
  }

  public get stormStrikeBonus(): number {
    return this.spell.isNature ? this.target.debuffs.stormStrikeBonus : 1.0
  }

  public get actualSpellDamage(): number {
    switch (this.spell.school.toUpperCase()) {
      case 'PHYSICAL':
        return 0
      case 'ARCANE':
        return this.character.arcaneDamage
      case 'NATURE':
        return this.character.natureDamage
      case 'FIRE':
      case 'FROST':
      case 'SHADOW':
      case 'HOLY':
      default:
        return this.character.spellDamage
    }
  }

  /* actual spell damage plus buffs */
  public get effectiveSpellDamage(): number {
    return (
      this.actualSpellDamage +
      this.character.buffs.flaskOfSupremePowerBonus +
      this.character.buffs.greaterArcaneElixirBonus +
      this.character.buffs.ephemeralPowerBonus
    )
  }

  public get partialResistPenalty(): number {
    const br1 = Math.min(this.target.spellResistance, 276)
    const br2 = Math.min(this.spellPenetration, br1)
    return ((br1 - br2 + 24) / 300) * 0.75
  }

  public get baseDmgMultiplier(): number {
    return this.moonFuryBonus * this.improvedMoonfireBonus
  }

  public get effectiveDmgMultiplier(): number {
    return (
      this.character.buffs.powerInfusionBonus *
      this.character.buffs.saygesDarkFortuneBonus *
      this.character.buffs.tracesOfSilithystBonus *
      this.target.debuffs.spellVulnBonus *
      this.curseOfShadowDamageBonus *
      this.stormStrikeBonus *
      (1 - this.partialResistPenalty)
    )
  }

  /**
   * Mitigates spell resist of SpellCast. Needs work.
   */
  public get spellPenetration(): number {
    switch (this.spell.school.toUpperCase()) {
      case 'ARCANE':
      case 'SHADOW':
        return this.character.gear.spellPenetration + this.target.debuffs.curseOfShadowResistBonus
      default:
        return 0
    }
  }

  /**
   * Spell cast time . Factors in talents that modify base spell cast time.
   * Doesn't account for procs like natures grace
   */
  public get castTime(): number {
    switch (this.spell.baseName.toUpperCase()) {
      case 'WRATH':
        return this.spell.castTime - this.character.talents.improvedWrathBonus
      case 'STARFIRE':
        return this.spell.castTime - this.character.talents.improvedStarfireBonus
      default:
        return this.spell.castTime <= constants.globalCoolDown ? constants.globalCoolDown : this.spell.castTime
    }
  }

  /**
   * The amount of cast time reduced when a crit procs a bonus to it i.e. natures grace
   * This factors in the spells existing cast time, ensuring the returned reduction amount
   * would not reduce the cast time below the GCD
   */
  public get castTimeReductionOnCrit(): number {
    if (this.character.talents.naturesGraceBonus === 0) return 0
    return this.castTime - this.character.talents.naturesGraceBonus <= constants.globalCoolDown
      ? constants.globalCoolDown - this.castTime
      : this.character.talents.naturesGraceBonus
  }

  /**
   * Factors in cast speed, procs like natures grace, hit, crit and "human factor" (which might actually be latency?)
   */
  public get effectiveCastTime(): number {
    return Math.max(
      constants.globalCoolDown,
      this.castTime - this.castTimeReductionOnCrit * (this.spellChanceToCrit / 100) + constants.castTimePenalty
    )
  }

  /**
   * Chance of hitting with a spell
   *
   */
  public get spellChanceToHit(): number {
    return 83 + this.character.spellHit
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
    return (this.character.spellCrit + this.improvedMoonfireSpellCritBonus) * (this.spellChanceToHit / 100)
  }

  /**
   * Chance of landing a Normal hit i.e. not a miss and not a crit
   *
   */
  public get spellChanceToNormal(): number {
    return this.spellChanceToHit - this.spellChanceToCrit
  }

  public get spellCritMultiplier(): number {
    switch (this.spell.baseName.toUpperCase()) {
      case 'WRATH':
        return constants.baseSpellCritMultiplier + this.character.talents.vengeanceBonus
      case 'STARFIRE':
        return constants.baseSpellCritMultiplier + this.character.talents.vengeanceBonus
      case 'MOONFIRE':
        return constants.baseSpellCritMultiplier + this.character.talents.vengeanceBonus
      default:
        return constants.baseSpellCritMultiplier
    }
  }
  /**
   * The bonus multiplier of a crit, not counting the base
   */
  public get spellCritBonusMultiplier(): number {
    return this.spellCritMultiplier - 1
  }

  /**
   * spell crit weight i.e. the amount of spell power 1 point of crit is worth.
   */
  public get spellCritWeight(): number {
    return this.character.spellCrit < constants.spellCritCap ? this.spellCritToSpellDamage : 0
  }

  /**
   * spell hit weight i.e. the amount of spell power 1 point of hit is worth.
   */
  public get spellHitWeight(): number {
    return this.character.spellHit < constants.spellHitCap ? this.spellHitToSpellDamage : 0
  }

  /**
   * int weight i.e. the amount of spell power 1 point of int is worth
   */
  public get intWeight(): number {
    return this.spellCritWeight > 0 ? this.spellCritWeight / 60 : 0
  }

  /**
   *
   * dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
   */

  public get spellDamageToDamage(): number {
    return (
      (this.effectiveDmgMultiplier *
        this.spell.coefficient.direct *
        (this.spellChanceToHit / 100) *
        (1 + (this.spellCritBonusMultiplier * this.character.spellCrit) / 100)) /
      this.effectiveCastTime
    )
  }

  /**
   *
   * d(83+H)(mB+cP) * (xT+t(0.83+H/100)) / (100T-t(0.83+H/100)R)^2
   */
  public get spellCritToDamage(): number {
    return (
      (this.normalDmg.effective.avg *
        this.spellChanceToHit *
        (this.spellCritBonusMultiplier * this.castTime +
          this.castTimeReductionOnCrit * (this.spellChanceToHit / 100))) /
      (100 * this.effectiveCastTime) ** 2
    )
  }

  /**
   *
   * v1 d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
   */
  public get spellHitToDamage(): number {
    return (
      (this.normalDmg.effective.avg *
        (100 + this.spellCritBonusMultiplier * this.character.spellCrit) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.effectiveCastTime) ** 2
    )
  }

  // v3 Crit:Spellpower = x(mB/c + P)/(100+xR)   *   (T + (0.83+H/100)t/x)/(T-(0.83+H/100)tR/100)
  public get spellCritToSpellDamage(): number {
    return (
      (((this.spellCritBonusMultiplier * this.normalDmg.actual.avg) /
        (100 + this.spellCritBonusMultiplier * this.character.spellCrit)) *
        (this.castTime +
          ((this.spellChanceToHit / 100) * this.castTimeReductionOnCrit) / this.spellCritBonusMultiplier)) /
      this.effectiveCastTime
    )
  }
  /*
  // v1 Hit:Spellpower = (B/c + P)/(83 + H)
  // v2 Hit:SpellDamage = (mB/c+P)/(83+H) * (100^2 T)/(100^2 T - t(83+H)R)
  */
  public get spellHitToSpellDamage(): number {
    return (
      ((this.normalDmg.actual.avg / this.spellChanceToHit) * (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.effectiveCastTime)
    )
  }

  /**
   *
   * DPS keeping faerie fire up and spamming Spell. .
   *
   */
  public get ffDPS(): number {
    const ffDuration = 40
    return (
      (ffDuration * this.dps.effective.avg) / (ffDuration + (constants.globalCoolDown * 100) / this.spellChanceToHit)
    )
  }
  public get ffDPSLoss(): number {
    return this.dps.effective.avg - this.ffDPS
  }

  public get mfDPS(): number {
    const mfDuration = 12
    return (
      (mfDuration * this.dps.effective.avg) / (mfDuration + (constants.globalCoolDown * 100) / this.spellChanceToHit)
    )
  }
  public get mfDPSLoss(): number {
    return this.dps.effective.avg - this.mfDPS
  }

  public get testRotationDPS(): number {
    // (starfireDPS - mfDPSLoss) + (moonfireDirectDPS / moonfireDotDuration) + moonfireDotDPS
    return 488 - 62 + 289 / 12 + 71
  }
  /************************************************/
  public get kefDPS(): number {
    // =(($H$9*$H$13*$I$9+$H$9*$H$16)/100) / $I$18*$D$22*$D$23*$D$24*$D$25*$D$26*$D$27*(1-$H$20)
    return (
      ((this.normalDmg.actual.avg * this.spellChanceToNormal + this.critDmg.actual.avg * this.spellChanceToCrit) /
        100 /
        this.effectiveCastTime) *
      this.effectiveDmgMultiplier
    )
  }
  public get OGspellDamageToDamage(): number {
    const x =
      this.effectiveDmgMultiplier *
      this.spell.coefficient.direct *
      (0.83 + this.character.spellHit / 100) *
      (1 + (this.spellCritBonusMultiplier * this.character.spellCrit) / 100)
    const y =
      this.castTime -
      this.castTimeReductionOnCrit * (0.83 + this.character.spellHit / 100) * (this.character.spellCrit / 100)

    return x / y
  }

  public get OGspellCritToDamage(): number {
    return (
      (this.effectiveDmgMultiplier *
        (83 + this.character.spellHit) *
        (this.moonFuryBonus * this.spell.avgDmg + this.spell.coefficient.direct * this.effectiveSpellDamage) *
        (this.spellCritBonusMultiplier * this.castTime +
          this.castTimeReductionOnCrit * (0.83 + this.character.spellHit / 100))) /
      (100 * this.castTime -
        this.castTimeReductionOnCrit * (0.83 + this.character.spellHit / 100) * this.character.spellCrit) **
        2
    )
  }

  public get OGspellHitToDamage(): number {
    return (
      (this.effectiveDmgMultiplier *
        (this.moonFuryBonus * this.spell.avgDmg + this.spell.coefficient.direct * this.effectiveSpellDamage) *
        (100 + this.spellCritBonusMultiplier * this.character.spellCrit) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.castTime -
        this.castTimeReductionOnCrit * (83 + this.character.spellHit) * this.character.spellCrit) **
        2
    )
  }

  public get OGspellCritToSpellDamage(): number {
    return (
      (((this.spellCritBonusMultiplier *
        ((this.moonFuryBonus * this.spell.avgDmg) / this.spell.coefficient.direct + this.effectiveSpellDamage)) /
        (100 + this.spellCritBonusMultiplier * this.character.spellCrit)) *
        (this.castTime +
          ((0.83 + this.character.spellHit / 100) * this.castTimeReductionOnCrit) / this.spellCritBonusMultiplier)) /
      (this.castTime -
        ((0.83 + this.character.spellHit / 100) * this.castTimeReductionOnCrit * this.character.spellCrit) / 100)
    )
  }

  public get OGspellHitToSpellDamage(): number {
    return (
      ((((this.moonFuryBonus * this.spell.avgDmg) / this.spell.coefficient.direct + this.effectiveSpellDamage) /
        (83 + this.character.spellHit)) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.castTime -
        this.castTimeReductionOnCrit * (83 + this.character.spellHit) * this.character.spellCrit)
    )
  }

  public get OGDPS(): number {
    return (
      (this.effectiveDmgMultiplier *
        (0.83 + this.character.spellHit / 100) *
        (this.moonFuryBonus * this.spell.avgDmg + this.spell.coefficient.direct * this.effectiveSpellDamage) *
        (1 + (this.spellCritBonusMultiplier * this.character.spellCrit) / 100)) /
      (this.castTime -
        this.castTimeReductionOnCrit * (0.83 + this.character.spellHit / 100) * (this.character.spellCrit / 100))
    )
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
