/**
 * TODO: WIP. Stores gear selections, getters return attribute bonuses
 */
export default class Gear {
  public stamina: number
  public intellect: number
  public spirit: number
  public mp5: number
  public spellPenetration: number
  public spellHit: number
  public spellCrit: number
  public spellDamage: number
  public arcaneDamage: number
  public natureDamage: number

  public constructor(
    stamina: number,
    intellect: number,
    spirit: number,
    mp5: number,
    spellPenetration: number,
    spellHit: number,
    spellCrit: number,
    spellDamage: number,
    arcaneDamage: number,
    natureDamage: number
  ) {
    this.stamina = stamina
    this.intellect = intellect
    this.spirit = spirit
    this.mp5 = mp5
    this.spellPenetration = spellPenetration
    this.spellHit = spellHit
    this.spellCrit = spellCrit
    this.spellDamage = spellDamage
    this.arcaneDamage = arcaneDamage
    this.natureDamage = natureDamage
  }
}
