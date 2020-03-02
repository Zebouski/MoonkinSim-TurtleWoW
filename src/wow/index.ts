/**
 *   - Theorycrafting unknowns
 *      - What are the resistance values of bosses? This could be determined
 *        by scraping data from WCL and running it through resistances formulas
 *      - Do spell casters have a spell crit suppression like melee, if so, how does it work?
 *      - Do spell casters have a base spell crit chance? What is it, and how can be confirmed?
 *   - Iron out target spell resist/pen.
 *     - Isn't spell pen/resist based on damage magicSchool?
 *     - Why does it default to 75 resist? Data on ragnaros says he has 15 nature/wrath.
 *     - Make sure immunities work
 *   - Character attributes.
 *     - more work need for all attributes
 *   - Gear.
 *     - Add rudimentary gear selection
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
import Buff from './enum/Buff'
import TargetType from './enum/TargetType'

import Database from './class/Database'
import Talents from './class/Talents'
import Character from './class/Character'
import Gear from './class/Gear'
import Item from './class/Item'
import Equipment from './class/Equipment'
import RawGear from './class/RawGear'
import Target from './class/Target'
import Spell from './class/Spell'
import Cast from './class/Cast'

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
  Buff,
  TargetType,
  Database,
  Talents,
  Character,
  Gear,
  Item,
  RawGear,
  Equipment,
  Target,
  Spell,
  Cast
}
