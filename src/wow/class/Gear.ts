/**
 * TODO: WIP. Stores gear selections, getters return attribute bonuses
 */
export default class Gear {
  public spellHit: number
  public spellCrit: number
  public spellPower: number

  public constructor(spellHit: number, spellCrit: number, spellPower: number) {
    this.spellHit = spellHit
    this.spellCrit = spellCrit
    this.spellPower = spellPower
  }
}
