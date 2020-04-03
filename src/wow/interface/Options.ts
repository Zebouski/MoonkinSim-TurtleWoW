import OptionsCharacter from './OptionsCharacter'
import OptionsTarget from './OptionsTarget'
import ItemSlot from '../enum/ItemSlot'

export default interface Options {
  debug: boolean
  experimental: boolean
  phase: number
  raids: boolean
  tailoring: boolean
  worldBosses: boolean
  combatLength: number
  spellName: string
  itemSearchSlot: ItemSlot
  character: OptionsCharacter
  target: OptionsTarget
}
