import constants from '../constants'
import Character from './Character'
import Spell from './Spell'
import Target from './Target'

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

  /**
   * Mitigates spell resist of SpellCast. Needs work.
   */
  public get spellPenetration(): number {
    switch (this.spell.school.toUpperCase()) {
      case 'ARCANE':
      case 'SHADOW':
        return this.target.debuffs.curseOfShadow ? 75 : 0
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
        return (
          this.spell.castTime - this.character.talents.improvedStarfireBonus
        )
      default:
        return this.spell.castTime <= constants.globalCoolDown
          ? constants.globalCoolDown
          : this.spell.castTime
    }
  }

  /**
   * The amount of cast time reduced when a crit procs a bonus to it i.e. natures grace
   * This factors in the spells existing cast time, ensuring the returned reduction amount
   * would not reduce the cast time below the GCD
   */
  public get castTimeReductionOnCrit(): number {
    if (this.character.talents.naturesGraceBonus === 0) return 0
    return this.castTime - this.character.talents.naturesGraceBonus <=
      constants.globalCoolDown
      ? constants.globalCoolDown - this.castTime
      : constants.naturesGraceReduction
  }

  /**
   * Factors in cast speed, procs like natures grace, hit, crit and "human factor" (which might actually be latency?)
   */
  public get effectiveCastTime(): number {
    return Math.max(
      constants.globalCoolDown,
      this.castTime -
        this.castTimeReductionOnCrit *
          (this.character.spellChanceToCrit / 100) +
        constants.spellCastTimeHumanFactor
    )
  }

  /**
   * Damage of a crit is damage * critMultiplier
   */
  public get critMultiplier(): number {
    switch (this.spell.baseName.toUpperCase()) {
      case 'WRATH':
        return (
          constants.spellBaseCritMultiplier +
          this.character.talents.vengeanceBonus
        )
      case 'STARFIRE':
        return (
          constants.spellBaseCritMultiplier +
          this.character.talents.vengeanceBonus
        )
      case 'MOONFIRE':
        return (
          constants.spellBaseCritMultiplier +
          this.character.talents.vengeanceBonus
        )
      default:
        return constants.spellBaseCritMultiplier
    }
  }
  /**
   * The bonus multiplier of a crit, not counting the base
   */
  public get critBonusMultiplier(): number {
    return this.critMultiplier - 1
  }

  /**
   * Dmg loss to spell partial resists
   *
   */
  public get partialResistPenalty(): number {
    const br1 = Math.min(this.target.spellResistance, 276)
    const br2 = Math.min(this.spellPenetration, br1)
    return ((br1 - br2 + 24) / 300) * 0.75
  }

  /**
   * All multiplicative bonuses and penalties combined
   *
   */
  public get dmgMultipliers(): number {
    return (
      this.character.buffs.dmgMultipliers *
      this.target.debuffs.dmgMultipliers(this.spell.school) *
      (1 - this.partialResistPenalty)
    )
  }

  /**
   * the baseDmg of Spell multiplied by any talents, plus your total
   * spellPower multiplied by the Spell coefficient
   *
   */
  public get baseDmg(): number {
    return (
      this.spell.baseDmg * this.character.talents.moonFuryBonus +
      this.character.spellPower * this.spell.coefficient.direct
    )
  }

  /**
   * base damage of spell, if it crits
   *
   */
  public get baseDmgCrit(): number {
    return this.baseDmg * this.critMultiplier
  }

  /**
   * damage of Spell, if it doesn't crit
   *
   */
  public get dmg(): number {
    return this.baseDmg * this.dmgMultipliers
  }

  /**
   * damage of spell, if it crits
   *
   */
  public get dmgCrit(): number {
    return this.baseDmgCrit * this.dmgMultipliers
  }

  public get baseDotDmg(): number {
    return (
      this.spell.baseDotDmg * this.character.talents.moonFuryBonus +
      this.character.spellPower * this.spell.coefficient.dot
    )
  }

  public get baseDotDmgPerTick(): number {
    return (this.baseDotDmg / this.spell.dotDuration) * this.spell.dotTick
  }

  /**
   * damage of dot
   *
   */
  public get dotDmg(): number {
    return this.spell.type === 'direct'
      ? 0
      : this.baseDotDmg * this.dmgMultipliers
  }

  /**
   * damage of dot (per tick)
   *
   */
  public get dotDmgPerTick(): number {
    return this.spell.type === 'direct'
      ? 0
      : this.baseDotDmgPerTick * this.dmgMultipliers
  }

  /**
   * spell crit weight i.e. the amount of spell power 1 point of crit is worth.
   */
  public get spellCritWeight(): number {
    return this.character.spellCrit < constants.spellCritCap
      ? this.spellCritToSpellPower
      : 0
  }

  /**
   * spell hit weight i.e. the amount of spell power 1 point of hit is worth.
   */
  public get spellHitWeight(): number {
    return this.character.spellHit < constants.spellHitCap
      ? this.spellHitToSpellPower
      : 0
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

  public get spellPowerToDamage(): number {
    return (
      (this.dmgMultipliers *
        this.spell.coefficient.direct *
        (this.character.spellChanceToHit / 100) *
        (1 + (this.critBonusMultiplier * this.character.spellCrit) / 100)) /
      this.effectiveCastTime
    )
  }

  /**
   *
   * d(83+H)(mB+cP) * (xT+t(0.83+H/100)) / (100T-t(0.83+H/100)R)^2
   */
  public get spellCritToDamage(): number {
    return (
      (this.dmg *
        this.character.spellChanceToHit *
        (this.critBonusMultiplier * this.castTime +
          this.castTimeReductionOnCrit *
            (this.character.spellChanceToHit / 100))) /
      (100 * this.effectiveCastTime) ** 2
    )
  }

  /**
   *
   * v1 d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
   */
  public get spellHitToDamage(): number {
    return (
      (this.dmg *
        (100 + this.critBonusMultiplier * this.character.spellCrit) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.effectiveCastTime) ** 2
    )
  }

  // v3 Crit:Spellpower = x(mB/c + P)/(100+xR)   *   (T + (0.83+H/100)t/x)/(T-(0.83+H/100)tR/100)
  public get spellCritToSpellPower(): number {
    return (
      (((this.critBonusMultiplier * this.baseDmg) /
        (100 + this.critBonusMultiplier * this.character.spellCrit)) *
        (this.castTime +
          ((this.character.spellChanceToHit / 100) *
            this.castTimeReductionOnCrit) /
            this.critBonusMultiplier)) /
      this.effectiveCastTime
    )
  }
  /*
  // v1 Hit:Spellpower = (B/c + P)/(83 + H)
  // v2 Hit:SpellPower = (mB/c+P)/(83+H) * (100^2 T)/(100^2 T - t(83+H)R)
  */
  public get spellHitToSpellPower(): number {
    return (
      ((this.baseDmg / this.character.spellChanceToHit) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.effectiveCastTime)
    )
  }

  /**
   *
   * DPS of spamming Spell. Currently only supports direct damage spells.
   *
   * d(0.83 + H/100)(mB +cP)(1 + xR/100) / (T - t(0.83+H/100)(R/100))
   *
   */
  public get DPS(): number {
    return (
      (this.dmg * this.character.spellChanceToNormal +
        this.dmgCrit * this.character.spellChanceToCrit) /
      100 /
      this.effectiveCastTime
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
      (ffDuration * this.DPS) /
      (ffDuration +
        (constants.globalCoolDown * 100) / this.character.spellChanceToHit)
    )
  }
  public get ffDPSLoss(): number {
    return this.DPS - this.ffDPS
  }
  /************************************************/
  public get kefDPS(): number {
    // =(($H$9*$H$13*$I$9+$H$9*$H$16)/100) / $I$18*$D$22*$D$23*$D$24*$D$25*$D$26*$D$27*(1-$H$20)
    return (
      ((this.baseDmgCrit * this.character.spellChanceToCrit +
        this.baseDmg * this.character.spellChanceToNormal) /
        100 /
        this.effectiveCastTime) *
      this.dmgMultipliers
    )
  }
  public get OGspellPowerToDamage(): number {
    const x =
      this.dmgMultipliers *
      this.spell.coefficient.direct *
      (0.83 + this.character.spellHit / 100) *
      (1 + ((this.critMultiplier - 1) * this.character.spellCrit) / 100)
    const y =
      this.castTime -
      this.castTimeReductionOnCrit *
        (0.83 + this.character.spellHit / 100) *
        (this.character.spellCrit / 100)

    return x / y
  }

  public get OGspellCritToDamage(): number {
    return (
      (this.dmgMultipliers *
        (83 + this.character.spellHit) *
        (this.character.talents.moonFuryBonus * this.spell.baseDmg +
          this.spell.coefficient.direct * this.character.spellPower) *
        ((this.critMultiplier - 1) * this.castTime +
          this.castTimeReductionOnCrit *
            (0.83 + this.character.spellHit / 100))) /
      (100 * this.castTime -
        this.castTimeReductionOnCrit *
          (0.83 + this.character.spellHit / 100) *
          this.character.spellCrit) **
        2
    )
  }

  public get OGspellHitToDamage(): number {
    return (
      (this.dmgMultipliers *
        (this.character.talents.moonFuryBonus * this.spell.baseDmg +
          this.spell.coefficient.direct * this.character.spellPower) *
        (100 + (this.critMultiplier - 1) * this.character.spellCrit) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.castTime -
        this.castTimeReductionOnCrit *
          (83 + this.character.spellHit) *
          this.character.spellCrit) **
        2
    )
  }

  public get OGspellCritToSpellPower(): number {
    return (
      ((((this.critMultiplier - 1) *
        ((this.character.talents.moonFuryBonus * this.spell.baseDmg) /
          this.spell.coefficient.direct +
          this.character.spellPower)) /
        (100 + (this.critMultiplier - 1) * this.character.spellCrit)) *
        (this.castTime +
          ((0.83 + this.character.spellHit / 100) *
            this.castTimeReductionOnCrit) /
            (this.critMultiplier - 1))) /
      (this.castTime -
        ((0.83 + this.character.spellHit / 100) *
          this.castTimeReductionOnCrit *
          this.character.spellCrit) /
          100)
    )
  }

  public get OGspellHitToSpellPower(): number {
    return (
      ((((this.character.talents.moonFuryBonus * this.spell.baseDmg) /
        this.spell.coefficient.direct +
        this.character.spellPower) /
        (83 + this.character.spellHit)) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.castTime -
        this.castTimeReductionOnCrit *
          (83 + this.character.spellHit) *
          this.character.spellCrit)
    )
  }

  public get OGDPS(): number {
    return (
      (this.dmgMultipliers *
        (0.83 + this.character.spellHit / 100) *
        (this.character.talents.moonFuryBonus * this.spell.baseDmg +
          this.spell.coefficient.direct * this.character.spellPower) *
        (1 + ((this.critMultiplier - 1) * this.character.spellCrit) / 100)) /
      (this.castTime -
        this.castTimeReductionOnCrit *
          (0.83 + this.character.spellHit / 100) *
          (this.character.spellCrit / 100))
    )
  }
}
