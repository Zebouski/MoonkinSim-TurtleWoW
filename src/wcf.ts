/**
 *   X Add moonfire
 *      - Formulas need to support hybrid spells
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
 *  X Header/footer
 *    X Make them seperate components
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
const spellBaseCritMultiplier = 1.5
const naturesGraceReduction = 0.5
const curseOfShadowBonus = 1.1
const powerInfusionBonus = 1.2
const saygesDarkFortuneBonus = 1.1
const tracesOfSilithystBonus = 1.05
const spellVulnBonus = 1.15
const stormStrikeBonus = 1

/**
 * Object format of targets stored in db/targets.
 * Targets are stored as YAML, but converted to
 * JSON at build time.
 */
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

/**
 * Object format of spells stored in db/spells.
 * Spells are stored as YAML, but converted to
 * JSON at build time.
 */
interface SpellJSON {
  name: string // "{name} Rank {rank}"
  minDmg: number
  maxDmg: number
  school: string
  type: string
  castTime: number
  duration: number
  manaCost: number
  level: number
  range: number
}

/**
 * Stores coefficient values
 */
interface CoefficientValues {
  direct: number
  dot: number
}

/**
 * Base spell attributes. Fields are calculated only if they don't require outside
 * information, like character or target.
 */
class Spell {
  public name: string
  public spellJSON: SpellJSON

  public constructor(name: string) {
    this.name = name
    this.spellJSON = jsonQuery(`[name=${name}]`, { data: druidSpells }).value
  }

  /**
   * Return array of spell names.
   */
  public static getSpellNames(): JSON {
    return jsonQuery('.name', { data: druidSpells }).value
  }

  /**
   * Return spell base damage (minDmg + maxDmg) / 2.
   */
  public get baseDmg(): number {
    return (this.minDmg + this.maxDmg) / 2
  }

  /**
   * Return spell coefficients. There are three types of spells, each with their
   * own coefficient formulas: direct, dot, and hybrid.
   *
   * Source: https://classicwow.live/guides/670/ozgar-s-downranking-guide-tool
   */
  public get coefficient(): CoefficientValues {
    const baseDirectCoefficient = this.castTime / 3.5
    const baseDotCoefficient = this.duration / 15
    const baseHybridCoefficient = baseDotCoefficient / (baseDirectCoefficient + baseDotCoefficient)
    const spellLevelPenalty = this.level < 20 ? 1 - (20 - this.level) * 0.0375 : 0

    switch (this.type) {
      case 'direct':
        return {
          direct: baseDirectCoefficient * (1 - spellLevelPenalty),
          dot: 0
        }
      case 'dot':
        return {
          direct: 0,
          dot: baseDotCoefficient * (1 - spellLevelPenalty)
        }
      case 'hybrid':
        return {
          direct: baseDirectCoefficient * (1 - baseHybridCoefficient) * (1 - spellLevelPenalty),
          dot: baseDotCoefficient * baseHybridCoefficient * (1 - spellLevelPenalty)
        }
      default:
        return {
          direct: 0,
          dot: 0
        }
    }
  }

  /**
   * Return base (short) name, parsed from name.
   */
  public get baseName(): string {
    return this.spellJSON.name.split(' ')[0]
  }

  /**
   * Return spell type (direct, dot or hybrid)
   */
  public get type(): string {
    return this.spellJSON.type.toLowerCase()
  }

  /**
   * Return spell rank, parsed from name.
   */
  public get rank(): string {
    return this.spellJSON.name.split(' ')[2]
  }

  /**
   * Return spell minimum damage, unmodified.
   */
  public get minDmg(): number {
    return this.spellJSON.minDmg
  }

  /**
   * Return spell max damage, unmodified.
   */
  public get maxDmg(): number {
    return this.spellJSON.maxDmg
  }

  /**
   * Return spell school, unmodified.
   */
  public get school(): string {
    return this.spellJSON.school
  }

  /**
   * Return cast time, limited to globalCoolDown
   */
  public get castTime(): number {
    return this.spellJSON.castTime <= globalCoolDown ? globalCoolDown : this.spellJSON.castTime
  }

  /**
   * Return duration, unmodified.
   */
  public get duration(): number {
    return this.spellJSON.duration
  }

  /**
   * Return mana cost, unmodified.
   */
  public get manaCost(): number {
    return this.spellJSON.manaCost
  }

  /**
   * Return spell level, unmodified.
   */
  public get level(): number {
    return this.spellJSON.level
  }

  /**
   * Return spell range, unmodified.
   */
  public get range(): number {
    return this.spellJSON.range
  }
}

/**
 * Stores character attributes, Talents, Gear, and Buffs
 */
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

  /**
   * TODO: Return faction name based on race
   */
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

  /**
   * TODO: Return total spell power (gear + talents + buffs)
   * In the future each spell school should also have a function
   */
  public get spellPower(): number {
    return this.gear.spellPower
  }

  /**
   * TODO: Return total spell crit rating (gear + (int / 60) + talents + buffs)
   */
  public get spellCrit(): number {
    return this.gear.spellCrit
  }

  /**
   * TODO: Return total spell hit rating (gear + talents + buffs)
   */
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

  /**
   * Return array of target names.
   */
  public static getTargetNames(): JSON {
    return jsonQuery('.name', { data: bosses }).value
  }

  /**
   * TODO: WIP. Returning static 75 like all spreadsheets do.
   * It should be based on Target attributes.
   */
  // eslint-disable-next-line class-methods-use-this
  public get spellResistance(): number {
    return 75
  }
}

/**
 * TODO: WIP. Debuffs currently applied to Target.
 */
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

/**
 * TODO: WIP. Buffs currently applied to Character.
 */
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

/**
 * TODO: WIP. Stores talent selections. Talent bonus calculations will
 * probably move here.
 */
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

/**
 * TODO: WIP. Stores gear selections, getters return attribute bonuses
 */
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

/**
 * A Spell cast by Character at Target.
 */
class SpellCast {
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
   * Increases the damage done by Starfire, Moonfire, and Wrath by 2/4/6/8/10%
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

  /**
   * Reduces the cast of your Wrath spell by 0.1/0.2/0.3/0.4/0.5 sec
   */
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

  /**
   * Reduces the cast of your Starfire spell by 0.1/0.2/0.3/0.4/0.5 sec
   */
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

  /**
   * Increases the critical strike damage bonus of your Starfire, Moonfire, and Wrath spells by x%.
   */
  public get vengeanceBonus(): number {
    switch (this.character.talents.vengeanceRank) {
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
   * Returns the time that will be reduced from cast time when natures grace procs
   * Time is limited by the global cooldown.
   */
  public get naturesGraceBonus(): number {
    if (this.character.talents.naturesGraceRank === 0) return 0
    return this.castTime - naturesGraceReduction <= globalCoolDown
      ? globalCoolDown - this.castTime
      : naturesGraceReduction
  }

  /**
   * Additional damage added by a crit
   */
  public get spellCritMultiplier(): number {
    switch (this.spell.baseName) {
      case 'Wrath':
        return spellBaseCritMultiplier + this.vengeanceBonus
      case 'Starfire':
        return spellBaseCritMultiplier + this.vengeanceBonus
      case 'Moonfire':
        return spellBaseCritMultiplier + this.vengeanceBonus
      default:
        return spellBaseCritMultiplier
    }
  }

  /**
   * Chance of missing a spell
   *
   */
  public get spellChanceToMiss(): number {
    return 100 - (83 + Math.min(this.character.spellHit, hitCap - 1))
  }

  /**
   * Chance of critting with a spell
   *
   */
  public get spellChanceToCrit(): number {
    return (1.8 + this.character.spellCrit) * ((100 - this.spellChanceToMiss) / 100)
  }

  /**
   * Chance of landing a regular hit i.e. not a miss and not a crit
   *
   */
  public get spellChanceToRegularHit(): number {
    return 100 - this.spellChanceToMiss - this.spellChanceToCrit
  }

  /**
   * Average damage of a non-crit spell
   *
   */
  public get spellAverageDmgNonCrit(): number {
    return this.spell.baseDmg * this.moonFuryBonus + this.character.spellPower * this.spell.coefficient.direct
  }

  /**
   * Average loss to spell resists
   *
   */
  public get spellPartialResistLossAverage(): number {
    const br1 = Math.min(this.target.spellResistance, 276)
    const br2 = Math.min(this.spellPenetration, br1)
    return ((br1 - br2 + 24) / 300) * 0.75
  }

  /**
   * All multiplicative bonuses combined, including spell resists
   *
   */
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
   * Used for calculating both spell crit and hit weight
   *
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
   * Used for calculating spell crit weight
   *
   * v2 d(83+H)(mB+cP) * (xT+t(0.83+H/100)) / (100T-t(0.83+H/100)R)^2
   */
  public get spellCritToDamage(): number {
    return (
      (this.spellMultiplicativeBonuses *
        (83 + this.character.spellHit) *
        this.spellAverageDmgNonCrit *
        ((this.spellCritMultiplier - 1) * this.castTime +
          this.naturesGraceBonus * (0.83 + this.character.spellHit / 100))) /
      (100 * this.castTime -
        this.naturesGraceBonus * (0.83 + this.character.spellHit / 100) * this.character.spellCrit) **
        2
    )
  }

  /**
   * Used for calculating spell hit weight
   *
   * d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
   *
   */
  public get spellHitToDamage(): number {
    return (
      (this.spellMultiplicativeBonuses *
        this.spellAverageDmgNonCrit *
        (100 + (this.spellCritMultiplier - 1) * this.character.spellCrit) *
        (100 ** 2 * this.castTime)) /
      (100 ** 2 * this.castTime - this.naturesGraceBonus * (83 + this.character.spellHit) * this.character.spellCrit) **
        2
    )
  }

  /**
   * DPS of spamming Spell. Currently only supports direct damage spells.
   */
  public get DPS(): number {
    // =(($H$9*$H$13*$I$9+$H$9*$H$16)/100) / $I$18*$D$22*$D$23*$D$24*$D$25*$D$26*$D$27*(1-$H$20)
    return (
      ((this.spellAverageDmgNonCrit * this.spellChanceToCrit * this.spellCritMultiplier +
        this.spellAverageDmgNonCrit * this.spellChanceToRegularHit) /
        100 /
        this.spellEffectiveCastTime) *
      this.spellMultiplicativeBonuses
    )
  }

  /**
   * spell crit weight i.e. the amount of spell power 1 point of crit worth.
   */
  public get spellCritWeight(): number {
    return this.spellCritToDamage / this.spellPowerToDamage
  }

  /**
   * spell hit weight i.e. the amount of spell power 1 point of crit worth.
   */
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
