/**
 * Object format of spells stored in db/spells.
 * Spells are stored as YAML, but converted to
 * JSON at build time.
 */
export default interface SpellJSON {
  name: string // "{name} Rank {rank}"
  minDmg: number
  maxDmg: number
  dotDmg: number
  dotDuration: number
  dotTick: number
  school: string
  type: string
  castTime: number
  manaCost: number
  level: number
  range: number
  secondary: string
}
