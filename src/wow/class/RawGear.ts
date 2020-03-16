import RawGearJSON from '../interface/RawGearJSON'
import Database from './Database'

export default class RawGear {
  phase: number
  rawGearJSON: RawGearJSON

  constructor(phase: number) {
    this.phase = phase
    this.rawGearJSON = Database.rawGear(phase)
  }

  get stamina(): number {
    return this.rawGearJSON.stamina
  }

  get intellect(): number {
    return this.rawGearJSON.intellect
  }

  get spirit(): number {
    return this.rawGearJSON.spirit
  }

  get mp5(): number {
    return this.rawGearJSON.mp5
  }

  get spellPenetration(): number {
    return this.rawGearJSON.spellPenetration
  }

  get spellHit(): number {
    return this.rawGearJSON.spellHit
  }

  get spellCrit(): number {
    return this.rawGearJSON.spellCrit
  }

  get spellDamage(): number {
    return this.rawGearJSON.spellDamage
  }

  get arcaneDamage(): number {
    return this.rawGearJSON.arcaneDamage
  }

  get natureDamage(): number {
    return this.rawGearJSON.natureDamage
  }
}
