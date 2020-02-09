/**
 *   - Theorycrafting unknowns
 *      - What are the resistance values of bosses? This could be determined
 *        by scraping data from WCL and running it through resistances formulas
 *      - Do spell casters have a spell crit suppression like melee, if so, how does it work?
 *      - Do spell casters have a base spell crit chance? What is it, and how can be confirmed?
 *   - Iron out target spell resist/pen.
 *     - Isn't spell pen/resist based on damage school?
 *     - Why does it default to 75 resist? Data on ragnaros says he has 15 nature/wrath.
 *     - Make sure immunities work
 *   - Character attributes.
 *     - more work need for all attributes
 *   - Gear.
 *     - Add rudimentary gear selection
 */

import constants from './constants'
import Talents from './class/Talents'
import Character from './class/Character'
import Buffs from './class/Buffs'
import Gear from './class/Gear'
import Target from './class/Target'
import Debuffs from './class/Debuffs'
import Spell from './class/Spell'
import Cast from './class/Cast'

export default {
  constants,
  Talents,
  Character,
  Buffs,
  Gear,
  Target,
  Debuffs,
  Spell,
  Cast
}
