/**
 * TODO: WIP. Stores gear selections, getters return attribute bonuses
 */
export default class Gear {
  stamina: number
  intellect: number
  spirit: number
  mp5: number
  spellPenetration: number
  spellHit: number
  spellCrit: number
  spellDamage: number
  arcaneDamage: number
  natureDamage: number

  constructor(
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
