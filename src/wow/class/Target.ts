import jsonQuery from 'json-query'
import Debuffs from './Debuffs'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bosses = require('../db/targets/bosses.yaml')

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

export default class Target {
  public name: string
  public targetJSON: TargetJSON
  public debuffs: Debuffs
  public spellResistance: number

  public constructor(name: string, spellResistance: number, debuffs: Debuffs) {
    this.name = name
    this.debuffs = debuffs
    this.spellResistance = spellResistance
    this.targetJSON = jsonQuery(`[name=${name}]`, { data: bosses }).value
  }

  /**
   * Return array of target names.
   */
  public static getTargetNames(): JSON {
    return jsonQuery('.name', { data: bosses }).value
  }
}
