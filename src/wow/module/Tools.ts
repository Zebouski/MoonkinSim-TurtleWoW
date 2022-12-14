import LockedItems from '../interface/LockedItems'
import LockedEnchants from '../interface/LockedEnchants'
import Equipment from '../class/Equipment'
import pako from 'pako'
import { Base64 } from 'js-base64'
import clonedeep from 'lodash/cloneDeep'
// import math from 'mathjs'
const math = require('mathjs')
const stats = require('statsjs')

interface ParaminOptions {
  version?: number
}

export default class Tools {
  static cumulativeChance(trials: number, chance: number, x: number): number {
    return 1 - stats.binomcdf(trials, chance, x)
  }

  static consecutiveChance(trials: number, chance: number, x: number): number {
    let sStart = math.zeros([x + 1, x + 1])
    sStart[0][0] = 1

    let T = math.zeros([x + 1, x + 1])
    for (let i = 0; i < x; i++) {
      T[0][i] = 1 - chance
      T[i + 1][i] = chance
    }

    T[x][x] = 1
    let sEnd = math.multiply(math.pow(T, trials), sStart)
    return sEnd.slice(-1)[0][0]
  }

  static triangularNumber(n: number) {
    return (n * (n + 1)) / 2
  }

  static RoundedString(num: number, decimals: number): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  static isMobile() {
    let mql = window.matchMedia('(max-width: 768px)')
    if (!mql.matches) {
      return true
    }

    return false
  }

  static CloneObject(o: any) {
    return clonedeep(o)
  }

  static isLetter(char: string) {
    return char.length === 1 && char.match(/[a-z]/i) ? true : false
  }

  static capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  static baseURL() {
    return `https://kmmiles.gitlab.io/moonkin-calc/`
  }

  static EncodeURI(str: string) {
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  static DecodeURI(str: string) {
    str = (str + '===').slice(0, str.length + (str.length % 4))
    return str.replace(/-/g, '+').replace(/_/g, '/')
  }

  /* Gzip and encode string for use as a URI parameter */
  static StringToParamin(str: string, opts?: ParaminOptions): string {
    let binaryString
    if (opts && opts.version === 1) {
      binaryString = pako.deflate(str, { to: 'string', level: 9 })
    } else {
      binaryString = pako.deflateRaw(str, { to: 'string', level: 9 })
    }

    /* base64 encode gzipped jsonString */
    let base64string = btoa(binaryString)

    /* encode base64 string for URL */
    let encoded = Tools.EncodeURI(base64string)

    return encoded
  }

  static ParaminToString(paramin: string, opts?: ParaminOptions): string {
    let asciiString

    /* param -> URI decoded param */
    let decodedParam = Tools.DecodeURI(paramin)

    /* decoded param -> binary string */
    let binaryString = Base64.atob(decodedParam)

    /* binary string -> ascii string */
    if (opts && opts.version === 1) {
      asciiString = pako.inflate(binaryString, { to: 'string' })
      asciiString = JSON.parse(asciiString)
    } else {
      asciiString = pako.inflateRaw(binaryString, { to: 'string' })
    }

    return asciiString
  }

  static lockedFromGearParam(param: string, opts?: ParaminOptions): Object {
    let myString = Tools.ParaminToString(param, opts)
    let arr = JSON.parse(myString)
    let lockedItems: LockedItems
    let lockedEnchants: LockedEnchants | undefined = undefined

    lockedItems = {
      head: arr[0],
      hands: arr[1],
      neck: arr[2],
      waist: arr[3],
      shoulder: arr[4],
      legs: arr[5],
      back: arr[6],
      feet: arr[7],
      chest: arr[8],
      wrist: arr[9],
      finger: arr[10],
      finger2: arr[11],
      mainhand: arr[12],
      offhand: arr[13],
      trinket: arr[14],
      trinket2: arr[15],
      idol: arr[16]
    }

    /* if v2, add enchants here */
    if (opts && opts.version === 2) {
      lockedEnchants = {
        head: arr[17],
        hands: arr[18],
        shoulder: arr[19],
        legs: arr[20],
        back: arr[21],
        feet: arr[22],
        chest: arr[23],
        wrist: arr[24],
        mainhand: arr[25]
      }
    }

    return {
      items: lockedItems,
      enchants: lockedEnchants
    }
  }

  static gearParamFromLocked(lockedItems: LockedItems, lockedEnchants: LockedEnchants | null, opts?: ParaminOptions) {
    let lockedArr = []
    lockedArr.push(lockedItems.head)
    lockedArr.push(lockedItems.hands)
    lockedArr.push(lockedItems.neck)
    lockedArr.push(lockedItems.waist)
    lockedArr.push(lockedItems.shoulder)
    lockedArr.push(lockedItems.legs)
    lockedArr.push(lockedItems.back)
    lockedArr.push(lockedItems.feet)
    lockedArr.push(lockedItems.chest)
    lockedArr.push(lockedItems.wrist)
    lockedArr.push(lockedItems.finger)
    lockedArr.push(lockedItems.finger2)
    lockedArr.push(lockedItems.mainhand)
    lockedArr.push(lockedItems.offhand)
    lockedArr.push(lockedItems.trinket)
    lockedArr.push(lockedItems.trinket2)
    lockedArr.push(lockedItems.idol)

    /* if v2, do enchants here */
    if (opts && opts.version === 2 && lockedEnchants !== null) {
      lockedArr.push(lockedEnchants.head)
      lockedArr.push(lockedEnchants.hands)
      lockedArr.push(lockedEnchants.shoulder)
      lockedArr.push(lockedEnchants.legs)
      lockedArr.push(lockedEnchants.back)
      lockedArr.push(lockedEnchants.feet)
      lockedArr.push(lockedEnchants.chest)
      lockedArr.push(lockedEnchants.wrist)
      lockedArr.push(lockedEnchants.mainhand)
    }

    return Tools.StringToParamin(JSON.stringify(lockedArr), opts)
  }

  static publicUrl(equipment: Equipment) {
    let lockedItems: LockedItems = {
      head: equipment.head.customId,
      hands: equipment.hands.customId,
      neck: equipment.neck.customId,
      waist: equipment.waist.customId,
      shoulder: equipment.shoulder.customId,
      legs: equipment.legs.customId,
      back: equipment.back.customId,
      feet: equipment.feet.customId,
      chest: equipment.chest.customId,
      wrist: equipment.wrist.customId,
      finger: equipment.finger.customId,
      finger2: equipment.finger2.customId,
      mainhand: equipment.mainhand.customId,
      offhand: equipment.offhand.customId,
      trinket: equipment.trinket.customId,
      trinket2: equipment.trinket2.customId,
      idol: equipment.idol.customId
    }

    let lockedEnchants: LockedEnchants = {
      head: equipment.head.enchantCustomId,
      hands: equipment.hands.enchantCustomId,
      shoulder: equipment.shoulder.enchantCustomId,
      legs: equipment.legs.enchantCustomId,
      back: equipment.back.enchantCustomId,
      feet: equipment.feet.enchantCustomId,
      chest: equipment.chest.enchantCustomId,
      wrist: equipment.wrist.enchantCustomId,
      mainhand: equipment.mainhand.enchantCustomId
    }

    return Tools.gearUrl(lockedItems, lockedEnchants, { version: 2 })
  }

  static gearUrl(lockedItems: LockedItems, lockedEnchants: LockedEnchants, opts?: ParaminOptions) {
    if (opts && opts.version === 2) {
      return `${Tools.baseURL()}?gearv2=${Tools.gearParamFromLocked(lockedItems, lockedEnchants, opts)}`
    }
    return `${Tools.baseURL()}?gear=${Tools.gearParamFromLocked(lockedItems, null, opts)}`
  }

  static optionFromURL(name: string): any {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    let value = params.get(name.toLowerCase())

    if (value === null) {
      return null
    }

    switch (name.toLowerCase()) {
      case 'phase':
      case 'pvprank':
        return Number(value)
      case 'randomenchants':
      case 'worldbosses':
      case 'raids':
        return value === 'true' ? true : false
      case 'gear':
        return value ? Tools.lockedFromGearParam(value, { version: 1 }) : null
      case 'gearv2':
        return value ? Tools.lockedFromGearParam(value, { version: 2 }) : null
      default:
        return value
    }
  }
}
