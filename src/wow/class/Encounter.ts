import Options from '../interface/Options'
import Cast from './Cast'
import Equipment from './Equipment'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'

/* Encounter is the big top level object for all wow calculations. We want it run exactly once
   whenever a value in Options is changed.

   - Creates the Cast() object where most work is done
   - Generates the item and enchant list when clicking an item/enchant
   - Does the expensive gear optimization
*/
export default class Encounter {
  options: Options
  spellCast: Cast
  items: ItemJSON[] | undefined
  enchants: EnchantJSON[] | undefined

  constructor(options: Options) {
    console.log('Encounter() called')
    this.options = options
    this.items = Equipment.optimalItemsForSlot(this.options)
    this.enchants = Equipment.optimalEnchantsForSlot(this.options)

    let equipment = Equipment.optimalEquipment(this.options)
    this.spellCast = new Cast(options, { equipment: equipment })
  }
}
