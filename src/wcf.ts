/**
 *   - Add moonfire
 *   - Iron out target spell resist/pen.
 *     - Isn't spell pen/resist based on damage school?
 *     - Why does it default to 75 resist? Data on ragnaros says he has 15 nature/wrath.
 *     - Make sure immunities work
 *   - Character attributes.
 *     - int, spirit, crit, hit, etc should all be in character class.
 *     - they should calculate a base value, then add in from gear, then talents, then buffs
 *     - +spell power should be seperate from +spellPower to school. The total derived spell power
 *       must take into account the school of the spell being cast.
 *     - account for racial bonuses like tauren stamina
 *   - Buffs.
 *     - Add mark of the wild, flask of supreme power, world buffs, etc.
 *     - Add them to a JSON file like spells.
 *   - Gear.
 *     - Add rudimentary gear selection
 *  - UI
 *    - Need reasonable way to fit character, talents, gear, buffs, target, etc on
 *      one page. Maybe make the input side a tabbed box.
 *  - Header/footer
 *    - Make them seperate components
 *  - Refactoring
 *    - Can drop "spell" prefix on children of spell* classes
 *    - Calculate values like "naturesGraceBonus" in constructor and save them,
 *      instead of recalculating every time.
 */
import jsonQuery from 'json-query'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const druidSpells = require('./db/spells/druid.yaml')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bosses = require('./db/targets/bosses.yaml')

/* constants */
const useBadBaseDmg = false
const globalCoolDown = 1.5
const hitCap = 17
const spellCastTimeHumanFactor = 0.05
const naturesGraceReduction = 0.5
const curseOfShadowBonus = 1.1
const powerInfusionBonus = 1.2
const saygesDarkFortuneBonus = 1.1
const tracesOfSilithystBonus = 1.05
const spellVulnBonus = 1.15
const stormStrikeBonus = 1

interface TargetJSON {
  name: string
  level: number
  class: string
  faction: string
  health: number
  minDmg: number
  maxDmg: number
  attackSpeed: number
  armor: number
  fireResist: number
  natureResist: number
  frostResist: number
  shadowResist: number
  arcaneResist: number
}

interface SpellJSON {
  name: string // "{name} Rank {rank}"
  minDmg: number
  maxDmg: number
  badBaseDmg: number
  school: string
  type: string
  castTime: number
  duration: number
  manaCost: number
  level: number
  range: number
}

interface CoefficientValues {
  direct: number
  dot: number
}

class Spell {
  public name: string
  public spellJSON: SpellJSON

  public constructor(name: string) {
    this.name = name
    this.spellJSON = jsonQuery(`[name=${name}]`, { data: druidSpells }).value
  }

  public static getSpellNames(): JSON {
    return jsonQuery('.name', { data: druidSpells }).value
  }

  public get baseDmg(): number {
    if (useBadBaseDmg) {
      return this.spellJSON.badBaseDmg
    }
    return (this.minDmg + this.maxDmg) / 2
  }

  public get coefficient(): CoefficientValues {
    let myCoefficient = { direct: 0, dot: 0 }
    const subLevelPenalty = 1 - (20 - this.level) * 0.0375

    if (this.spellJSON.type === 'hybrid') {
      let dotPart = this.duration / 15 / (this.duration / 15 + this.castTime / 3.5)
      let directPart = 1 - dotPart
      let baseDotCoefficient = (this.duration / 15) * dotPart
      let baseDirectCoefficient = (this.castTime / 3.5) * directPart

      if (this.level < 20) {
        myCoefficient.dot = baseDotCoefficient * (1 - subLevelPenalty)
        myCoefficient.direct = baseDirectCoefficient * (1 - subLevelPenalty)
      } else {
        myCoefficient.dot = baseDotCoefficient
        myCoefficient.direct = baseDirectCoefficient
      }
    } else {
      const baseCoefficient = this.castTime / 3.5
      if (this.level < 20) {
        myCoefficient.direct = baseCoefficient * (1 - subLevelPenalty)
      } else {
        myCoefficient.direct = baseCoefficient
      }
    }
    return myCoefficient
  }

  public get baseName(): string {
    return this.spellJSON.name.split(' ')[0]
  }

  public get rank(): string {
    return this.spellJSON.name.split(' ')[2]
  }

  public get minDmg(): number {
    return this.spellJSON.minDmg
  }

  public get maxDmg(): number {
    return this.spellJSON.maxDmg
  }

  public get badBaseDmg(): number {
    return this.spellJSON.badBaseDmg
  }

  public get school(): string {
    return this.spellJSON.school
  }

  /**
   * Return cast time, limited to globalCoolDown
   */
  public get castTime(): number {
    return this.spellJSON.castTime <= globalCoolDown ? globalCoolDown : this.spellJSON.castTime
  }

  public get duration(): number {
    return this.spellJSON.duration
  }

  public get manaCost(): number {
    return this.spellJSON.manaCost
  }

  public get level(): number {
    return this.spellJSON.level
  }

  public get range(): number {
    return this.spellJSON.range
  }
}

class Character {
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

  public get faction(): string {
    switch (this.race) {
      case 'TAUREN':
      case 'ORC':
      case 'UNDEAD':
      case 'TROLL':
        return 'Horde'
      default:
        return 'Alliance'
    }
  }

  // fixme: gear + buffs
  public get spellPower(): number {
    return this.gear.spellPower
  }

  // fixme: gear + intellect + buffs
  public get spellCrit(): number {
    return this.gear.spellCrit
  }

  // fixme: gear + buffs
  public get spellHit(): number {
    return this.gear.spellHit
  }
}

class Target {
  public name: string
  public targetJSON: TargetJSON
  public debuffs: Debuffs

  public constructor(name: string, debuffs: Debuffs) {
    this.name = name
    this.debuffs = debuffs
    this.targetJSON = jsonQuery(`[name=${name}]`, { data: bosses }).value
  }

  public static getTargetNames(): JSON {
    return jsonQuery('.name', { data: bosses }).value
  }

  /* TODO: hardcoding for now to match spreadsheet. */
  // eslint-disable-next-line class-methods-use-this
  public get spellResistance(): number {
    return 75
  }
}

/* TODO: WIP. Just a stub for now to move things along */
class Debuffs {
  public curseOfShadow: boolean
  public stormStrike: boolean
  public spellVuln: boolean

  public constructor(curseOfShadow: boolean, stormStrike: boolean, spellVuln: boolean) {
    this.curseOfShadow = curseOfShadow
    this.stormStrike = stormStrike
    this.spellVuln = spellVuln
  }
}

/* TODO: WIP. Just a stub for now to move things along */
class Buffs {
  public powerInfusion: boolean
  public saygesDarkFortune: boolean
  public tracesOfSilithyst: boolean

  public constructor(powerInfusion: boolean, saygesDarkFortune: boolean, tracesOfSilithyst: boolean) {
    this.powerInfusion = powerInfusion
    this.saygesDarkFortune = saygesDarkFortune
    this.tracesOfSilithyst = tracesOfSilithyst
  }
}

/* TODO: WIP. Just a stub for now to move things along */
class Talents {
  public naturesGraceRank: number
  public moonFuryRank: number
  public vengeanceRank: number
  public improvedWrathRank: number
  public improvedStarfireRank: number

  public constructor(
    naturesGraceRank: number,
    moonFuryRank: number,
    vengeanceRank: number,
    improvedWrathRank: number,
    improvedStarfireRank: number
  ) {
    this.naturesGraceRank = naturesGraceRank
    this.moonFuryRank = moonFuryRank
    this.vengeanceRank = vengeanceRank
    this.improvedWrathRank = improvedWrathRank
    this.improvedStarfireRank = improvedStarfireRank
  }
}

/* TODO: WIP. Just a stub for now to move things along */
class Gear {
  public spellHit: number
  public spellCrit: number
  public spellPower: number

  public constructor(spellHit: number, spellCrit: number, spellPower: number) {
    this.spellHit = spellHit
    this.spellCrit = spellCrit
    this.spellPower = spellPower
  }
}

class SpellCast {
  public character: Character
  public spell: Spell
  public target: Target

  public constructor(character: Character, spell: Spell, target: Target) {
    this.character = character
    this.spell = spell
    this.target = target
  }

  public get spellPenetration(): number {
    switch (this.spell.school) {
      case 'arcane':
      case 'shadow':
        return this.target.debuffs.curseOfShadow ? 75 : 0
      default:
        return 0
    }
  }

  /**
   * Factors in talents that modify base spell cast time.
   * Doesn't count for procs like natures grace
   */
  public get castTime(): number {
    switch (this.spell.baseName) {
      case 'Wrath':
        return this.spell.castTime - this.improvedWrathBonus
      case 'Starfire':
        return this.spell.castTime - this.improvedStarfireBonus
      default:
        return this.spell.castTime <= globalCoolDown ? globalCoolDown : this.spell.castTime
    }
  }

  /**
   * Factors in cast speed procs natures grace and "human factor"
   */
  public get spellEffectiveCastTime(): number {
    const x = this.castTime - this.naturesGraceBonus * (this.spellChanceToCrit / 100) + spellCastTimeHumanFactor

    return Math.max(x, globalCoolDown)
  }

  /**
   * Increases the damage done by Starfire, Moonfire, and Wrath
   */
  public get moonFuryBonus(): number {
    switch (this.character.talents.moonFuryRank) {
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

  public get improvedWrathBonus(): number {
    switch (this.character.talents.improvedWrathRank) {
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

  public get improvedStarfireBonus(): number {
    switch (this.character.talents.improvedStarfireRank) {
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

  public get vengeanceBonus(): number {
    switch (this.character.talents.vengeanceRank) {
      case 1:
        return 1.6 // rank 1: Increases the critical strike damage bonus by 20%
      case 2:
        return 1.7 // rank 2: Increases the critical strike damage bonus by 40%
      case 3:
        return 1.8 // rank 3: Increases the critical strike damage bonus by 60%
      case 4:
        return 1.9 // rank 4: Increases the critical strike damage bonus by 80%
      case 5:
        return 2 // rank 5: Increases the critical strike damage bonus by 100%
      default:
        return 1.5
    }
  }

  /**
   * Returns the time that will be reduced from cast time when natures grace procs
   * Time is limited by the global cooldown.
   */
  public get naturesGraceBonus(): number {
    if (this.character.talents.naturesGraceRank > 0) {
      let x = this.castTime - naturesGraceReduction
      if (x <= globalCoolDown) {
        return globalCoolDown - (x + naturesGraceReduction)
      }
      return naturesGraceReduction
    }
    return 0
  }

  public get spellChanceToMiss(): number {
    return 100 - (83 + Math.min(this.character.spellHit, hitCap - 1))
  }

  public get spellChanceToCrit(): number {
    return (1.8 + this.character.spellCrit) * ((100 - this.spellChanceToMiss) / 100)
  }

  public get spellChanceToRegularHit(): number {
    return 100 - this.spellChanceToMiss - this.spellChanceToCrit
  }

  public get spellAverageNonCrit(): number {
    return this.spell.baseDmg * this.moonFuryBonus + this.character.spellPower * this.spell.coefficient.direct
  }

  public get spellPartialResistLossAverage(): number {
    const br1 = Math.min(this.target.spellResistance, 276)
    const br2 = Math.min(this.spellPenetration, br1)
    return ((br1 - br2 + 24) / 300) * 0.75
  }

  public get spellMultiplicativeBonuses(): number {
    return (
      (this.target.debuffs.curseOfShadow && this.spell.school.toUpperCase() === 'ARCANE' ? curseOfShadowBonus : 1.0) *
      (this.character.buffs.powerInfusion ? powerInfusionBonus : 1.0) *
      (this.character.buffs.saygesDarkFortune ? saygesDarkFortuneBonus : 1.0) *
      (this.character.buffs.tracesOfSilithyst ? tracesOfSilithystBonus : 1.0) *
      (this.target.debuffs.spellVuln ? spellVulnBonus : 1.0) *
      (this.target.debuffs.stormStrike ? stormStrikeBonus : 1.0) *
      (1 - this.spellPartialResistLossAverage)
    )
  }

  /**
   * c(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
   */
  public get spellPowerToDamage(): number {
    const x =
      this.spell.coefficient.direct * (0.83 + this.character.spellHit / 100) * (1 + this.character.spellCrit / 100)
    const y =
      this.castTime - this.naturesGraceBonus * (0.83 + this.character.spellHit / 100) * (this.character.spellCrit / 100)
    return x / y
  }

  /**
   * v2 d(83+H)(mB+cP) * (xT+t(0.83+H/100)) / (100T-t(0.83+H/100)R)^2
   */
  public get spellCritToDamage(): number {
    return (
      (this.spellMultiplicativeBonuses *
        (83 + this.character.spellHit) *
        (this.moonFuryBonus * this.spell.baseDmg + this.spell.coefficient.direct * this.character.spellPower) *
        ((this.vengeanceBonus - 1) * this.castTime + this.naturesGraceBonus * (0.83 + this.character.spellHit / 100))) /
      (100 * this.castTime -
        this.naturesGraceBonus * (0.83 + this.character.spellHit / 100) * this.character.spellCrit) **
        2
    )
  }

  /** d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
   */
  public get spellHitToDamage(): number {
    return (
      (this.spellMultiplicativeBonuses *
        (this.moonFuryBonus * this.spell.baseDmg + this.spell.coefficient.direct * this.character.spellPower) *
        (100 + (this.vengeanceBonus - 1) * this.character.spellCrit) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.castTime - this.naturesGraceBonus * (83 + this.character.spellHit) * this.character.spellCrit) **
        2
    )
  }

  public get DPS(): number {
    // =(($H$9*$H$13*$I$9+$H$9*$H$16)/100) / $I$18*$D$22*$D$23*$D$24*$D$25*$D$26*$D$27*(1-$H$20)
    const x =
      ((this.spellAverageNonCrit * this.spellChanceToCrit * this.vengeanceBonus +
        this.spellAverageNonCrit * this.spellChanceToRegularHit) /
        100 /
        this.spellEffectiveCastTime) *
      this.spellMultiplicativeBonuses

    return x
  }

  public get spellCritWeight(): number {
    return this.spellCritToDamage / this.spellPowerToDamage
  }

  public get spellHitWeight(): number {
    return this.spellHitToDamage / this.spellPowerToDamage
  }
}

export default {
  Talents,
  Character,
  Buffs,
  Gear,
  Target,
  Debuffs,
  Spell,
  SpellCast
}
