/**
 *   - Theorycrafting unknowns
 *      - What are the resistance values of bosses? This could be determined
 *        by scraping data from WCL and running it through resistances formulas
 *      - Do spell casters have a spell crit suppression like melee, if so, how does it work?
 *      x Do spell casters have a base spell crit chance? What is it, and how can be confirmed?
 *   - Iron out target spell resist/pen.
 *     - Isn't spell pen/resist based on damage magicSchool?
 *     - Why does it default to 75 resist? Data on ragnaros says he has 15 nature/wrath.
 *     - Make sure immunities work
 *   - Character attributes.
 *     - more work need for all attributes
 *   - Gear.
 *     - Add rudimentary gear selection
 *
 *
 * "a spell miss due to level difference is the same combatlog event as a full resist
 * for a mob to full resist a non binary spell via resistances I think its 120+ resistance they need
 * to have a chance to roll the full resist
 * and resistance based full resists arent related to hit related full resists in any way"
 *
 * "What he said big true
 * For frost as a binary spell it basically never comes into play
 * Because fire gets partials it starts to effect stuff but I think we largely ignore it because the math is poorly understood and difficult to test in classic"
 */

import constants from './constants'

import Faction from './enum/Faction'
import ItemSlot from './enum/ItemSlot'
import ItemQuality from './enum/ItemQuality'
import ItemClass from './enum/ItemClass'
import MagicSchool from './enum/MagicSchool'
import PlayableRace from './enum/PlayableRace'
import PlayableClass from './enum/PlayableClass'
import Gender from './enum/Gender'
import SortOrder from './enum/SortOrder'
import PvPRank from './enum/PvPRank'
import Buffs from './enum/Buffs'
import TargetType from './enum/TargetType'

import Database from './class/Database'
import Character from './class/Character'
import Item from './class/Item'
import Equipment from './class/Equipment'
import Target from './class/Target'
import Spell from './class/Spell'
import Cast from './class/Cast'
import Encounter from './class/Encounter'

export default {
  constants,
  Faction,
  ItemSlot,
  ItemQuality,
  ItemClass,
  MagicSchool,
  PlayableRace,
  PlayableClass,
  Gender,
  SortOrder,
  PvPRank,
  Buffs,
  TargetType,
  Database,
  Character,
  Item,
  Equipment,
  Target,
  Spell,
  Cast,
  Encounter
}
