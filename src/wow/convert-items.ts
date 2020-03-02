/*
{
  '$': { id: '10261' },
  name: [ "Adventurer's Bandana" ],
  level: [ '63' ],
  quality: [ { _: 'Uncommon', '$': [Object] } ],
  class: [ { _: 'Armor', '$': [Object] } ],
  subclass: [ { _: 'Leather Armor', '$': [Object] } ],
  icon: [ { _: 'inv_misc_bandana_03', '$': [Object] } ],
  inventorySlot: [ { _: 'Head', '$': [Object] } ],
  htmlTooltip: [
    `<table><tr><td><!--nstart--><b class="q2">Adventurer's Bandana</b><!--nend--><!--ndstart--><!--ndend--><span class="q"><br>Item Level <!--ilvl-->63</span><br /><!--bo-->Binds when equipped<table width="100%"><tr><td>Head</td><th><!--scstart4:2--><span class="q1">Leather</span><!--scend--></th></tr></table><span><!--amr-->130 Armor</span><br><!--re--><span class="q2">&lt;Random enchantment&gt;</span><!--ebstats--><!--egstats--><!--eistats--><!--e--><!--ps--><br>Durability 50 / 50</td></tr></table><table><tr><td>Requires Level <!--rlvl-->58<!--itemEffects:1--><div class="whtt-sellprice">Sell Price: <span class="moneygold">1</span> <span class="moneysilver">79</span> <span class="moneycopper">85</span></div></td></tr></table>`
  ],
  json: [
    `"armor":130,"classs":4,"displayid":29051,"flags2":8192,"id":10261,"level":63,"name":"Adventurer's Bandana","quality":2,"reqlevel":58,"slot":1,"slotbak":1,"source":[2],"subclass":2`
  ],
  jsonEquip: [
    '"armor":130,"avgbuyout":40000,"displayid":29051,"dmgrange":1.00,"dura":50,"reqlevel":58,"sellprice":17985,"slotbak":1'
  ],
  link: [ 'https://classic.wowhead.com/item=10261' ]
}
*/
import ItemJSON from './interface/ItemJSON'
import Faction from './enum/Faction'
import ItemQuality from './enum/ItemQuality'
import ItemClass from './enum/ItemClass'
import ArmorSubclass from './enum/ArmorSubclass'
import WeaponSubclass from './enum/WeaponSubclass'
import ItemSlot from './enum/ItemSlot'
import PvPRank from './enum/PvPRank'
import PlayableClass from './enum/PlayableClass'

let csvFilePath = 'vendor/Classic_Balance_Druidv1.3.csv'
if (process.env.TEST && process.env.TEST === '1') {
  csvFilePath = 'vendor/testItems.csv'
}

const csv = require('csvtojson')
const axios = require('axios').default
const xml2js = require('xml2js')

interface WowHeadResult {
  $: Object
  name: Array<string>
  level: Array<string>
  quality: Array<Object>
  class: Array<Object>
  subclass: Array<Object>
  icon: Array<any>
  inventorySlot: Array<Object>
  htmlTooltip: Array<String>
  json: Array<String>
  jsonEquip: Array<String>
  link: Array<String>
}

interface ItemOld {
  'Equipment Type': string
  Slot: string
  Name: string
  Phase: string
  Location: string
  Boss: string
  Stamina: string
  Intellect: string
  Spirit: string
  'Spell Damage': string
  'Spell Critical %': string
  'Spell Hit %': string
  MP5: string
  'Spell Penetration': string
  Score: string
  field16: string
  Alliance: string
  Horde: string
  Starfire: string
  Wrath: string
}

class Item {
  itemOld: ItemOld
  private _wowHeadItem: any
  constructor(itemOld: ItemOld) {
    this.itemOld = itemOld
    this._wowHeadItem = null
  }

  public set wowHeadItem(wowHeadItem: any) {
    this._wowHeadItem = wowHeadItem
  }

  public get oldItem(): ItemOld {
    return this.itemOld
  }

  public get wowHeadURL(): string {
    // console.log('itemBaseName: \"' + this.itemBaseName + '\"')
    let encodedName = encodeURIComponent(this.itemBaseName)
    return `https://classic.wowhead.com/item=${encodedName}&xml`
  }

  public async getWowHeadItem(): Promise<any> {
    try {
      const response = await axios.get(this.wowHeadURL)
      const result = await xml2js.parseStringPromise(response.data)
      // console.warn(result.wowhead.item[0])
      return result.wowhead.error ? null : result.wowhead.item[0]
    } catch (error) {
      console.error(error)
      return null
    }
  }

  public get itemId(): number {
    return this._wowHeadItem !== null ? parseInt(this._wowHeadItem['$'].id, 10) : 0
  }

  public get itemName(): string {
    return this.itemOld.Name
  }

  /**
   * wowhead doesn't actually have the random suffix items. instead they're
   * listed inside the base item.
   */
  public get itemBaseName(): string {
    const of = this.itemName.indexOf(' of ')
    if (of >= 0) {
      const right = this.itemName.slice(of + 4)

      switch (right) {
        case `Arcane Wrath`:
        case `Nature's Wrath`:
        case `Sorcery`:
        case `Restoration`:
          return this.itemName.slice(0, of)
      }
    }
    return this.itemName
  }

  public get isEnchant(): boolean {
    switch (this.itemOld['Equipment Type']) {
      case 'Back Enchant':
      case 'Chest Enchant':
      case 'Feet Enchant':
      case 'Hands Enchant':
      case 'Head Enchant':
      case 'Legs Enchant':
      case 'Shoulder Enchant':
      case 'Weapon Enchant':
      case 'Wrist Enchant':
        return true
      default:
        return false
    }
  }

  public get itemSlot(): ItemSlot {
    return parseInt(this._wowHeadItem['inventorySlot'][0].$.id, 10)
  }

  public get itemClass(): ItemClass {
    return parseInt(this._wowHeadItem['class'][0].$.id, 10)
  }

  public get itemSubclass(): ArmorSubclass | WeaponSubclass {
    return parseInt(this._wowHeadItem['subclass'][0].$.id, 10)
  }

  public get itemIconName(): string {
    return this._wowHeadItem === null || this.isEnchant
      ? 'spell_holy_greaterheal'
      : this._wowHeadItem.icon[0]._.toLowerCase()
  }

  public get itemPhase(): number {
    return parseFloat(this.itemOld.Phase)
  }

  public get itemLocation(): string {
    return this.itemOld.Location
  }

  public get itemBoss(): string {
    return this.itemOld.Boss
  }

  public get itemStamina(): number {
    return this.itemOld.Stamina !== '' ? parseInt(this.itemOld.Stamina, 10) : 0
  }

  public get itemIntellect(): number {
    return this.itemOld.Intellect !== '' ? parseInt(this.itemOld.Intellect, 10) : 0
  }

  public get itemSpirit(): number {
    return this.itemOld.Spirit !== '' ? parseInt(this.itemOld.Spirit, 10) : 0
  }

  public get itemSpellCrit(): number {
    return this.itemOld['Spell Critical %'] !== '' ? parseInt(this.itemOld['Spell Critical %'], 10) : 0
  }

  public get itemSpellHit(): number {
    return this.itemOld['Spell Hit %'] !== '' ? parseInt(this.itemOld['Spell Hit %'], 10) : 0
  }

  public get itemSpellPen(): number {
    return this.itemOld['Spell Penetration'] !== '' ? parseInt(this.itemOld['Spell Penetration'], 10) : 0
  }

  public get itemSpellDamage(): number {
    if (this.itemOld['Spell Damage'] !== '' && this.itemOld.Wrath === 'Yes' && this.itemOld.Starfire === 'Yes') {
      return parseInt(this.itemOld['Spell Damage'], 10)
    }
    return 0
  }

  /* TODO */
  public get itemSpellHealing(): number {
    return 0
  }

  public get itemArcaneDamage(): number {
    if (this.itemOld['Spell Damage'] !== '' && this.itemOld.Wrath === 'No' && this.itemOld.Starfire === 'Yes') {
      return parseInt(this.itemOld['Spell Damage'], 10)
    }
    return 0
  }

  public get itemNatureDamage(): number {
    if (this.itemOld['Spell Damage'] !== '' && this.itemOld.Wrath === 'Yes' && this.itemOld.Starfire === 'No') {
      return parseInt(this.itemOld['Spell Damage'], 10)
    }
    return 0
  }

  public get itemMp5(): number {
    return this.itemOld.MP5 !== '' ? parseInt(this.itemOld.MP5, 10) : 0
  }

  public get itemScore(): number {
    return this.itemOld.Score !== '' ? parseFloat(this.itemOld.Score) : 0
  }

  public get itemRank(): PvPRank {
    switch (this.itemLocation) {
      case 'Requires Blood Guard':
        return PvPRank.BloodGuard
      case 'Requires Champion':
        return PvPRank.Champion
      case 'Requires Field Marshal':
        return PvPRank.FieldMarshal
      case 'Requires General':
        return PvPRank.General
      case 'Requires Grand Marshal':
        return PvPRank.GrandMarshal
      case 'Requires High Warlord':
        return PvPRank.HighWarlord
      case 'Requires Knight-Captain':
        return PvPRank.KnightCaptain
      case 'Requires Knight-Lieutenant':
        return PvPRank.KnightLieutenant
      case 'Requires Legionnaire':
        return PvPRank.Legionnaire
      case 'Requires Lieutenant Commander':
        return PvPRank.LieutenantCommander
      case 'Requires Marshal':
        return PvPRank.Marshal
      case 'Requires Warlord':
        return PvPRank.Warlord
      default:
        return 0
    }
  }

  public get itemFaction(): Faction {
    if (this.itemAlliance && this.itemHorde) {
      return Faction.Alliance | Faction.Horde
    } else if (this.itemHorde) {
      return Faction.Horde
    }

    return Faction.Alliance
  }

  public get itemAlliance(): boolean {
    return this.itemOld.Alliance === 'Yes' ? true : false
  }

  public get itemHorde(): boolean {
    return this.itemOld.Horde === 'Yes' ? true : false
  }

  public get itemQuality(): ItemQuality {
    if (this._wowHeadItem === null) {
      return ItemQuality.Common
    }

    switch (this._wowHeadItem['quality'][0]._.toUpperCase()) {
      case 'POOR':
        return ItemQuality.Poor
      case 'COMMON':
        return ItemQuality.Common
      case 'UNCOMMON':
        return ItemQuality.Uncommon
      case 'RARE':
        return ItemQuality.Rare
      case 'EPIC':
        return ItemQuality.Epic
      case 'LEGENDARY':
        return ItemQuality.Legendary
      default:
        return ItemQuality.Common
    }
  }

  public get itemLevel(): number {
    return parseInt(this._wowHeadItem['level'][0], 10)
  }

  public get itemReqLevel(): number {
    return JSON.parse(`{ ${this._wowHeadItem['json'][0]} }`).reqlevel
  }

  public get itemArmor(): number {
    return JSON.parse(`{ ${this._wowHeadItem['json'][0]} }`).armor
  }

  public get itemDurability(): number {
    return JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).dura
  }

  public get itemMinDmg(): number {
    return JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).mledmgmin
  }

  public get itemMaxDmg(): number {
    return JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).mledmgmax
  }

  public get itemSpeed(): number {
    return JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).mlespeed
  }

  public get itemDps(): number {
    return JSON.parse(`{ ${this._wowHeadItem['jsonEquip'][0]} }`).mledps
  }

  public get itemBop(): boolean {
    return this._wowHeadItem['htmlTooltip'][0].includes('Binds when picked up')
  }

  public get itemUnique(): boolean {
    return this._wowHeadItem['htmlTooltip'][0].includes('Unique')
  }

  public get allowableClasses(): any {
    const htt = this._wowHeadItem['htmlTooltip'][0]
    let classes = []

    if (!htt.includes('Classes: ')) {
      return undefined
    }

    if (htt.includes('Warrior')) {
      classes.push(PlayableClass.Warrior)
    }
    if (htt.includes('Paladin')) {
      classes.push(PlayableClass.Paladin)
    }
    if (htt.includes('Hunter')) {
      classes.push(PlayableClass.Hunter)
    }
    if (htt.includes('Rogue')) {
      classes.push(PlayableClass.Rogue)
    }
    if (htt.includes('Priest')) {
      classes.push(PlayableClass.Priest)
    }
    if (htt.includes('Shaman')) {
      classes.push(PlayableClass.Shaman)
    }
    if (htt.includes('Mage')) {
      classes.push(PlayableClass.Mage)
    }
    if (htt.includes('Warlock')) {
      classes.push(PlayableClass.Warlock)
    }
    if (htt.includes('Druid')) {
      classes.push(PlayableClass.Druid)
    }
    return classes
  }

  public get newItem(): ItemJSON {
    return {
      id: this.itemId,
      name: this.itemName,
      class: this.itemClass,
      subclass: this.itemSubclass,
      slot: this.itemSlot,
      quality: this.itemQuality,
      level: this.itemLevel,
      reqLevel: this.itemReqLevel,
      bop: this.itemBop,
      unique: this.itemUnique,
      allowableClasses: this.allowableClasses,
      phase: this.itemPhase,
      pvpRank: this.itemRank,
      icon: this.itemIconName,
      location: this.itemLocation,
      boss: this.itemBoss,
      faction: this.itemFaction,
      spellDamage: this.itemSpellDamage,
      spellHealing: this.itemSpellHealing,
      arcaneDamage: this.itemArcaneDamage,
      natureDamage: this.itemNatureDamage,
      spellHit: this.itemSpellHit,
      spellCrit: this.itemSpellCrit,
      spellPenetration: this.itemSpellPen,
      stamina: this.itemStamina,
      intellect: this.itemIntellect,
      spirit: this.itemSpirit,
      mp5: this.itemMp5,
      armor: this.itemArmor,
      durability: this.itemDurability,
      minDmg: this.itemMinDmg,
      maxDmg: this.itemMaxDmg,
      speed: this.itemSpeed,
      dps: this.itemDps
    }
  }
}

const start = async function() {
  console.warn('Parsing CSV: ' + csvFilePath)
  const jsonArray = await csv().fromFile(csvFilePath)
  let myArray = []

  for (let ogObj of jsonArray) {
    if (ogObj.Name === '') {
      continue
    }
    let gearItem = new Item(ogObj)
    // enchants stored elsewhere
    if (gearItem.isEnchant) {
      continue
    }
    let wowHeadItem = await gearItem.getWowHeadItem()
    if (wowHeadItem === null) {
      console.error('Item not found: ' + ogObj.Name)
    } else {
      gearItem.wowHeadItem = wowHeadItem
      myArray.push(gearItem.newItem)
    }
    // return parseInt(this._wowHeadItem['level'][0].$.id, 10)
    // console.warn(wowHeadItem['class'][0].$.id)
    // console.warn('subclass: ' + wowHeadItem['subclass'][0]._)
  }
  console.log(JSON.stringify(myArray, null, 1))
  console.warn('Complete.')
}

void start()
