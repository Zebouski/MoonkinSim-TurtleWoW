import Options from '../interface/Options'
import ItemSearch from '../interface/ItemSearch'

import TargetType from '../enum/TargetType'
import ItemSlot from '../enum/ItemSlot'

import Spell from './Spell'
import Target from './Target'
import Cast from './Cast'
import Character from './Character'
import Equipment from './Equipment'
import Database from './Database'
import Item from './Item'

export default class Encounter {
  options: Options
  spellCast: Cast
  equipment: Equipment
  items: JSON

  constructor(options: Options) {
    this.options = options
    this.equipment = Equipment.optimalEquipment(this.options)
    this.items = Equipment.optimalItems(this.options)

    this.spellCast = new Cast(
      new Character(this.options.character, this.equipment),
      new Spell(this.options.spellName),
      new Target(this.options.target)
    )
  }
}
