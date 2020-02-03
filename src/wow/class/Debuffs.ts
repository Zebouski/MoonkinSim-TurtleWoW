import constants from '../constants'
/**
 * TODO: WIP. Debuffs currently applied to Target.
 */
export default class Debuffs {
  public curseOfShadow: boolean
  public stormStrike: boolean
  public spellVuln: boolean

  public constructor(
    curseOfShadow: boolean,
    stormStrike: boolean,
    spellVuln: boolean
  ) {
    this.curseOfShadow = curseOfShadow
    this.stormStrike = stormStrike
    this.spellVuln = spellVuln
  }

  public get spellVulnBonus(): number {
    return this.spellVuln ? constants.spellVulnBonus : 1.0
  }

  public curseOfShadowBonus(spellSchool: string): number {
    return this.curseOfShadow && spellSchool.toUpperCase() === 'ARCANE'
      ? constants.curseOfShadowBonus
      : 1.0
  }

  public stormStrikeBonus(spellSchool: string): number {
    return this.stormStrike && spellSchool.toUpperCase() === 'NATURE'
      ? constants.stormStrikeBonus
      : 1.0
  }

  public dmgMultipliers(spellSchool: string): number {
    return (
      this.spellVulnBonus *
      this.curseOfShadowBonus(spellSchool) *
      this.stormStrikeBonus(spellSchool)
    )
  }
}
