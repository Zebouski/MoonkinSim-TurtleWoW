import RawGearJSON from '../interface/RawGearJSON'
import Database from './Database'

export default class RawGear {
  public phase: number
  public rawGearJSON: RawGearJSON

  public constructor(phase: number) {
    this.phase = phase
    this.rawGearJSON = Database.rawGear(phase)
  }

  public get stamina(): number {
    return this.rawGearJSON.stamina
  }

  public get intellect(): number {
    return this.rawGearJSON.intellect
  }

  public get spirit(): number {
    return this.rawGearJSON.spirit
  }

  public get mp5(): number {
    return this.rawGearJSON.mp5
  }

  public get spellPenetration(): number {
    return this.rawGearJSON.spellPenetration
  }

  public get spellHit(): number {
    return this.rawGearJSON.spellHit
  }

  public get spellCrit(): number {
    return this.rawGearJSON.spellCrit
  }

  public get spellDamage(): number {
    return this.rawGearJSON.spellDamage
  }

  public get arcaneDamage(): number {
    return this.rawGearJSON.arcaneDamage
  }

  public get natureDamage(): number {
    return this.rawGearJSON.natureDamage
  }
}
