import OptionsCharacter from './OptionsCharacter'
import OptionsTarget from './OptionsTarget'

export default interface Options {
  debug: boolean
  phase: number
  raids: boolean
  tailoring: boolean
  worldBosses: boolean
  combatLength: number
  spellName: string
  character: OptionsCharacter
  target: OptionsTarget
}
