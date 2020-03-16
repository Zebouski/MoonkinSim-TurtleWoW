import constants from '../constants'
import Character from './Character'
import Spell from './Spell'
import Target from './Target'
import CastDmgValues from '../interface/CastDmgValues'
import CastDmgObject from '../interface/CastDmgObject'
import MagicSchool from '../enum/MagicSchool'
import Buff from '../enum/Buff'

/**
 * A Spell cast by Character at Target.
 */
export default class Cast {
  character: Character
  spell: Spell
  target: Target

  constructor(character: Character, spell: Spell, target: Target) {
    this.character = character
    this.spell = spell
    this.target = target
  }

  get normalDmg(): CastDmgObject {
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

  get critDmg(): CastDmgObject {
    let myObj = {} as CastDmgObject
    myObj.base = {} as CastDmgValues
    myObj.actual = {} as CastDmgValues
    myObj.effective = {} as CastDmgValues
    let normalObj = this.normalDmg

    let _critDmg = (dmg: number) => {
      return dmg * this.critMultiplier
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

  get periodicDmg(): CastDmgObject {
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

  get dps(): CastDmgObject {
    let myObj = {} as CastDmgObject
    myObj.base = {} as CastDmgValues
    myObj.actual = {} as CastDmgValues
    myObj.effective = {} as CastDmgValues

    let _dps = (normalDmg: number, critDmg: number) => {
      return (normalDmg * this.chanceToNormal + critDmg * this.chanceToCrit) / 100 / this.effectiveCastTime
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

  get periodicDPS(): CastDmgObject {
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

  get moonFuryBonus(): number {
    return this.spell.isMoonfire || this.spell.isStarfire || this.spell.isWrath
      ? this.character.talents.moonFuryBonus
      : 1.0
  }

  get improvedMoonfireBonus(): number {
    return this.spell.isMoonfire ? this.character.talents.improvedMoonfireBonus : 1.0
  }

  get improvedMoonfireSpellCritBonus(): number {
    return this.spell.isMoonfire ? (this.improvedMoonfireBonus - 1) * 100 : 0
  }

  get curseOfShadowDamageBonus(): number {
    return this.spell.isArcane ? this.target.curseOfShadowDamageBonus : 1.0
  }

  get curseOfShadowResistBonus(): number {
    return this.spell.isArcane ? this.target.curseOfShadowResistBonus : 0
  }

  /**
   * Effect #1	Apply Aura: Mod % Damage Taken (All)
   * Value: -76%
   * Effect #2	Apply Aura: Mod % Damage Taken (Vulnerable)
   * Value: 1099%
   */
  get shimmerBonus(): number {
    let modifier = this.target.shimmer ? 1 - 0.76 : 1
    return this.target.shimmer === this.spell.magicSchool ? modifier * 10.99 : modifier
  }

  get stormStrikeBonus(): number {
    return this.spell.isNature ? this.target.stormStrikeBonus : 1.0
  }

  get actualSpellDamage(): number {
    switch (this.spell.magicSchool) {
      case MagicSchool.Physical:
        return 0
      case MagicSchool.Arcane:
        return this.character.arcaneDamage
      case MagicSchool.Nature:
        return this.character.natureDamage
      case MagicSchool.Fire:
      case MagicSchool.Frost:
      case MagicSchool.Shadow:
      case MagicSchool.Holy:
      default:
        return this.character.spellDamage
    }
  }

  /* actual spell damage plus buffs */
  get effectiveSpellDamage(): number {
    return (
      this.actualSpellDamage +
      this.character.flaskOfSupremePowerBonus +
      this.character.greaterArcaneElixirBonus +
      this.character.ephemeralPowerBonus
    )
  }

  get effectiveSpellCrit(): number {
    return this.character.spellCrit + this.improvedMoonfireSpellCritBonus
  }

  /* https://dwarfpriest.wordpress.com/2008/01/07/spell-hit-spell-penetration-and-resistances/#more-176 */
  get partialResistPenalty(): number {
    let effectiveTargetResistance = () => {
      const resistance = Math.min(this.target.spellResistance, 5 * this.character.level - targetResistanceFromLevel())
      return resistance - Math.min(this.spellPenetration, resistance) + targetResistanceFromLevel()
    }

    let targetResistanceFromLevel = () => {
      const bonusPerLevel = parseFloat((0.1333 * this.character.level).toFixed(2))
      return this.spell.isBinary ? 0 : (this.target.level - this.character.level) * bonusPerLevel
    }

    return (0.75 * effectiveTargetResistance()) / (5 * this.character.level)
  }

  get baseDmgMultiplier(): number {
    return this.moonFuryBonus * this.improvedMoonfireBonus
  }

  get effectiveDmgMultiplier(): number {
    return (
      this.character.powerInfusionBonus *
      this.character.saygesDarkFortuneBonus *
      this.character.tracesOfSilithystBonus *
      this.target.spellVulnBonus *
      this.curseOfShadowDamageBonus *
      this.stormStrikeBonus *
      this.character.burningAdrenalineDamageBonus *
      this.shimmerBonus *
      (1 - this.partialResistPenalty)
    )
  }

  /**
   * Mitigates spell resist of SpellCast. Needs work.
   */
  get spellPenetration(): number {
    switch (this.spell.magicSchool) {
      case MagicSchool.Arcane:
      case MagicSchool.Shadow:
        return this.character.gear.spellPenetration + this.target.curseOfShadowResistBonus
      default:
        return 0
    }
  }

  /**
   * Spell cast time . Factors in talents that modify base spell cast time.
   * Doesn't account for procs like natures grace
   */
  get castTime(): number {
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
  get castTimeReductionOnCrit(): number {
    if (this.character.talents.naturesGraceBonus === 0) return 0
    return this.castTime - this.character.talents.naturesGraceBonus <= constants.globalCoolDown
      ? constants.globalCoolDown - this.castTime
      : this.character.talents.naturesGraceBonus
  }

  /**
   * Factors in cast speed, procs like natures grace, hit, crit and "human factor" (which might actually be latency?)
   */
  get effectiveCastTime(): number {
    if ((this.character.buffs & Buff.BurningAdrenaline) === Buff.BurningAdrenaline) {
      return constants.globalCoolDown + constants.castTimePenalty
    }

    return (
      Math.max(constants.globalCoolDown, this.castTime - this.castTimeReductionOnCrit * (this.chanceToCrit / 100)) +
      constants.castTimePenalty
    )
  }

  /**
   * Chance of hitting with a spell
   *
   */
  get chanceToHit(): number {
    return 83 + this.character.spellHit
  }

  /**
   * Chance of missing a spell
   *
   */
  get chanceToMiss(): number {
    return 100 - this.chanceToHit
  }

  /**
   * Chance of critting with a spell
   *
   */
  get chanceToCrit(): number {
    return this.effectiveSpellCrit * (this.chanceToHit / 100)
  }

  /**
   * Chance of landing a Normal hit i.e. not a miss and not a crit
   *
   */
  get chanceToNormal(): number {
    return this.chanceToHit - this.chanceToCrit
  }

  get critMultiplier(): number {
    switch (this.spell.baseName.toUpperCase()) {
      case 'WRATH':
      case 'STARFIRE':
      case 'MOONFIRE':
        return constants.baseSpellCritMultiplier + this.character.talents.vengeanceBonus
      default:
        return constants.baseSpellCritMultiplier
    }
  }
  /**
   * The bonus multiplier of a crit, not counting the base
   */
  get critBonusMultiplier(): number {
    return this.critMultiplier - 1
  }

  /**
   * spell crit weight i.e. the amount of spell power 1 point of crit is worth.
   */
  get spellCritWeight(): number {
    return this.effectiveSpellCrit < constants.spellCritCap ? this.spellCritToSpellDamage : 0
  }

  /**
   * spell hit weight i.e. the amount of spell power 1 point of hit is worth.
   */
  get spellHitWeight(): number {
    return this.character.spellHit < constants.spellHitCap ? this.spellHitToSpellDamage : 0
  }

  /**
   * int weight i.e. the amount of spell power 1 point of int is worth
   */
  get intWeight(): number {
    return this.spellCritWeight > 0 ? this.spellCritWeight / 60 : 0
  }

  /**
   *
   * dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
   */

  get spellDamageToDamage(): number {
    return (
      (this.effectiveDmgMultiplier *
        this.spell.coefficient.direct *
        (this.chanceToHit / 100) *
        (1 + (this.critBonusMultiplier * this.effectiveSpellCrit) / 100)) /
      this.effectiveCastTime
    )
  }

  /**
   *
   * d(83+H)(mB+cP) * (xT+t(0.83+H/100)) / (100T-t(0.83+H/100)R)^2
   */
  get spellCritToDamage(): number {
    return (
      (this.normalDmg.effective.avg *
        this.chanceToHit *
        (this.critBonusMultiplier * this.castTime + this.castTimeReductionOnCrit * (this.chanceToHit / 100))) /
      (100 * this.effectiveCastTime) ** 2
    )
  }

  /**
   *
   * v1 d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
   */
  get spellHitToDamage(): number {
    return (
      (this.normalDmg.effective.avg *
        (100 + this.critBonusMultiplier * this.effectiveSpellCrit) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.effectiveCastTime) ** 2
    )
  }

  // v3 Crit:Spellpower = x(mB/c + P)/(100+xR)   *   (T + (0.83+H/100)t/x)/(T-(0.83+H/100)tR/100)
  get spellCritToSpellDamage(): number {
    return (
      (((this.critBonusMultiplier * this.normalDmg.actual.avg) /
        (100 + this.critBonusMultiplier * this.effectiveSpellCrit)) *
        (this.castTime + ((this.chanceToHit / 100) * this.castTimeReductionOnCrit) / this.critBonusMultiplier)) /
      this.effectiveCastTime
    )
  }
  /*
  // v1 Hit:Spellpower = (B/c + P)/(83 + H)
  // v2 Hit:SpellDamage = (mB/c+P)/(83+H) * (100^2 T)/(100^2 T - t(83+H)R)
  */
  get spellHitToSpellDamage(): number {
    return (
      ((this.normalDmg.actual.avg / this.chanceToHit) * (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.effectiveCastTime)
    )
  }

  /**
   *
   * DPS keeping faerie fire up and spamming Spell. .
   *
   */
  get ffDPS(): number {
    const ffDuration = 40
    return (ffDuration * this.dps.effective.avg) / (ffDuration + (constants.globalCoolDown * 100) / this.chanceToHit)
  }
  get ffDPSLoss(): number {
    return this.dps.effective.avg - this.ffDPS
  }

  get mfDPS(): number {
    const mfDuration = 12
    return (mfDuration * this.dps.effective.avg) / (mfDuration + (constants.globalCoolDown * 100) / this.chanceToHit)
  }
  get mfDPSLoss(): number {
    return this.dps.effective.avg - this.mfDPS
  }

  get testRotationDPS(): number {
    // (starfireDPS - mfDPSLoss) + (moonfireDirectDPS / moonfireDotDuration) + moonfireDotDPS
    return 488 - 62 + 289 / 12 + 71
  }
  /************************************************/
  get kefDPS(): number {
    // =(($H$9*$H$13*$I$9+$H$9*$H$16)/100) / $I$18*$D$22*$D$23*$D$24*$D$25*$D$26*$D$27*(1-$H$20)
    return (
      ((this.normalDmg.actual.avg * this.chanceToNormal + this.critDmg.actual.avg * this.chanceToCrit) /
        100 /
        this.effectiveCastTime) *
      this.effectiveDmgMultiplier
    )
  }
  get OGspellDamageToDamage(): number {
    const x =
      this.effectiveDmgMultiplier *
      this.spell.coefficient.direct *
      (0.83 + this.character.spellHit / 100) *
      (1 + (this.critBonusMultiplier * this.effectiveSpellCrit) / 100)
    const y =
      this.castTime -
      this.castTimeReductionOnCrit * (0.83 + this.character.spellHit / 100) * (this.effectiveSpellCrit / 100)

    return x / y
  }

  get OGspellCritToDamage(): number {
    return (
      (this.effectiveDmgMultiplier *
        (83 + this.character.spellHit) *
        (this.moonFuryBonus * this.spell.avgDmg + this.spell.coefficient.direct * this.effectiveSpellDamage) *
        (this.critBonusMultiplier * this.castTime +
          this.castTimeReductionOnCrit * (0.83 + this.character.spellHit / 100))) /
      (100 * this.castTime -
        this.castTimeReductionOnCrit * (0.83 + this.character.spellHit / 100) * this.effectiveSpellCrit) **
        2
    )
  }

  get OGspellHitToDamage(): number {
    return (
      (this.effectiveDmgMultiplier *
        (this.moonFuryBonus * this.spell.avgDmg + this.spell.coefficient.direct * this.effectiveSpellDamage) *
        (100 + this.critBonusMultiplier * this.effectiveSpellCrit) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.castTime -
        this.castTimeReductionOnCrit * (83 + this.character.spellHit) * this.effectiveSpellCrit) **
        2
    )
  }

  get OGspellCritToSpellDamage(): number {
    return (
      (((this.critBonusMultiplier *
        ((this.moonFuryBonus * this.spell.avgDmg) / this.spell.coefficient.direct + this.effectiveSpellDamage)) /
        (100 + this.critBonusMultiplier * this.effectiveSpellCrit)) *
        (this.castTime +
          ((0.83 + this.character.spellHit / 100) * this.castTimeReductionOnCrit) / this.critBonusMultiplier)) /
      (this.castTime -
        ((0.83 + this.character.spellHit / 100) * this.castTimeReductionOnCrit * this.effectiveSpellCrit) / 100)
    )
  }

  get OGspellHitToSpellDamage(): number {
    return (
      ((((this.moonFuryBonus * this.spell.avgDmg) / this.spell.coefficient.direct + this.effectiveSpellDamage) /
        (83 + this.character.spellHit)) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.castTime -
        this.castTimeReductionOnCrit * (83 + this.character.spellHit) * this.effectiveSpellCrit)
    )
  }

  get OGDPS(): number {
    return (
      (this.effectiveDmgMultiplier *
        (0.83 + this.character.spellHit / 100) *
        (this.moonFuryBonus * this.spell.avgDmg + this.spell.coefficient.direct * this.effectiveSpellDamage) *
        (1 + (this.critBonusMultiplier * this.effectiveSpellCrit) / 100)) /
      (this.castTime -
        this.castTimeReductionOnCrit * (0.83 + this.character.spellHit / 100) * (this.effectiveSpellCrit / 100))
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
