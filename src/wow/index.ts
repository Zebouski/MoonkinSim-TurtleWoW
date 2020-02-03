/**
 *   - Theorycrafting unknowns
 *      - What are the resistance values of bosses? This could be determined
 *        by scraping data from WCL and running it through resistances formulas
 *      - Do spell casters have a spell crit suppression like melee, if so, how does it work?
 *      - Do spell casters have a base spell crit chance? What is it, and how can be confirmed?
 *   X Add moonfire
 *      - Formulas need to support hybrid spells
 *   - Iron out target spell resist/pen.
 *     - Isn't spell pen/resist based on damage school?
 *     - Why does it default to 75 resist? Data on ragnaros says he has 15 nature/wrath.
 *     - Make sure immunities work
 *   - Character attributes.
 *     - int, spirit, crit, hit, etc should all be in character class.
 *     - they should calculate a base value, then add in from gear, then talents, then buffs
 *     - +spell power should be seperate from +spellPower to school. The total derived spell power
 *       must take into account the school of the spell being cast.
 *     - account for racial bonuses like tauren stamina
 *   - Buffs.
 *     - Add mark of the wild, flask of supreme power, world buffs, etc.
 *     - Add them to a JSON file like spells.
 *   - Gear.
 *     - Add rudimentary gear selection
 *  - UI
 *    - Need reasonable way to fit character, talents, gear, buffs, target, etc on
 *      one page. Maybe make the input side a tabbed box.
 *  X Header/footer
 *    X Make them seperate components
 *  - Refactoring
 *    - Can drop "spell" prefix on children of spell* classes
 *    - Calculate values like "naturesGraceBonus" in constructor and save them,
 *      instead of recalculating every time.
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
