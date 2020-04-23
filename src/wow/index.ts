/**
 *   - Theorycrafting unknowns
 *      - What are the resistance values of bosses? This could be determined
 *        by scraping data from WCL and running it through resistances formulas
 *      - Do spell casters have a spell crit suppression like melee, if so, how does it work?
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

import Query from './class/Query'
import Character from './class/Character'
import Item from './class/Item'
import Locked from './class/Locked'
import Equipment from './class/Equipment'
import Target from './class/Target'
import Spell from './class/Spell'
import Cast from './class/Cast'
import Encounter from './class/Encounter'
import Tools from './class/Tools'

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
  Query,
  Character,
  Item,
  Locked,
  Equipment,
  Target,
  Spell,
  Cast,
  Encounter,
  Tools
}
