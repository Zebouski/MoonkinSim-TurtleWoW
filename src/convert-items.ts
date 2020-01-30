let csvFilePath = 'vendor/Classic_Balance_Druidv1.3.csv'
if (process.env.TEST && process.env.TEST === '1') {
  csvFilePath = 'vendor/testItems.csv'
}

const csv = require('csvtojson')
const axios = require('axios').default
const xml2js = require('xml2js')
const util = require('util')

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

interface ItemNew {
  id: string
  name: string
  baseName: string
  type: string
  slot: string
  icon: string
  phase: number
  location: string
  boss: string
  stamina: number
  intellect: number
  spirit: number
  spellCrit: number
  spellHit: number
  spellPen: number
  spellDmg: number
  spellDmgArcane: number
  spellDmgNature: number
  mp5: number
  score: number
  alliance: boolean
  horde: boolean
}

class GearItem {
  itemOld: ItemOld
  private _wowHeadItem: any
  constructor(itemOld: ItemOld) {
    this.itemOld = itemOld
    this._wowHeadItem = null
  }

  public isEnchant() {
    return this.itemName.indexOf('Enchant ', 0) !== -1 ? true : false
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

  public get itemType(): string {
    return this.itemOld['Equipment Type']
  }

  public get itemId(): string {
    // console.warn(this._wowHeadItem)
    return this._wowHeadItem !== null ? this._wowHeadItem['$'].id : ''
  }

  public get itemSlot(): string {
    return this.itemOld.Slot
  }

  public get itemIconName(): string {
    return this._wowHeadItem === null || this.isEnchant()
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
    return this.itemOld.Intellect !== ''
      ? parseInt(this.itemOld.Intellect, 10)
      : 0
  }

  public get itemSpirit(): number {
    return this.itemOld.Spirit !== '' ? parseInt(this.itemOld.Spirit, 10) : 0
  }

  public get itemSpellCrit(): number {
    return this.itemOld['Spell Critical %'] !== ''
      ? parseInt(this.itemOld['Spell Critical %'], 10)
      : 0
  }

  public get itemSpellHit(): number {
    return this.itemOld['Spell Hit %'] !== ''
      ? parseInt(this.itemOld['Spell Hit %'], 10)
      : 0
  }

  public get itemSpellPen(): number {
    return this.itemOld['Spell Penetration'] !== ''
      ? parseInt(this.itemOld['Spell Penetration'], 10)
      : 0
  }

  public get itemSpellDmg(): number {
    if (
      this.itemOld['Spell Damage'] !== '' &&
      this.itemOld.Wrath === 'Yes' &&
      this.itemOld.Starfire === 'Yes'
    ) {
      return parseInt(this.itemOld['Spell Damage'], 10)
    }
    return 0
  }

  public get itemSpellDmgArcane(): number {
    if (
      this.itemOld['Spell Damage'] !== '' &&
      this.itemOld.Wrath === 'No' &&
      this.itemOld.Starfire === 'Yes'
    ) {
      return parseInt(this.itemOld['Spell Damage'], 10)
    }
    return 0
  }

  public get itemSpellDmgNature(): number {
    if (
      this.itemOld['Spell Damage'] !== '' &&
      this.itemOld.Wrath === 'Yes' &&
      this.itemOld.Starfire === 'No'
    ) {
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

  public get itemAlliance(): boolean {
    return this.itemOld.Alliance === 'Yes' ? true : false
  }

  public get itemHorde(): boolean {
    return this.itemOld.Horde === 'Yes' ? true : false
  }

  public get newItem(): ItemNew {
    return {
      id: this.itemId,
      name: this.itemName,
      baseName: this.itemBaseName,
      type: this.itemType,
      slot: this.itemSlot,
      icon: this.itemIconName,
      phase: this.itemPhase,
      location: this.itemLocation,
      boss: this.itemBoss,
      stamina: this.itemStamina,
      intellect: this.itemIntellect,
      spirit: this.itemSpirit,
      spellCrit: this.itemSpellCrit,
      spellHit: this.itemSpellHit,
      spellPen: this.itemSpellPen,
      spellDmg: this.itemSpellDmg,
      spellDmgArcane: this.itemSpellDmgArcane,
      spellDmgNature: this.itemSpellDmgNature,
      mp5: this.itemMp5,
      score: this.itemScore,
      alliance: this.itemAlliance,
      horde: this.itemHorde
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

    let gearItem = new GearItem(ogObj)
    if (!gearItem.isEnchant()) {
      let wowHeadItem = await gearItem.getWowHeadItem()
      if (wowHeadItem === null) {
        console.error('Item not found: ' + ogObj.Name)
      } else {
        gearItem.wowHeadItem = wowHeadItem
      }
    }
    myArray.push(gearItem.newItem)
  }
  //console.log(myArray)
  console.log(JSON.stringify(myArray, null, 1))
  console.warn('Complete.')
}

start()
