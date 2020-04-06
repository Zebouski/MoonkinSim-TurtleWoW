import Options from '../interface/Options'
import pako from 'pako'
import { Base64 } from 'js-base64'
import wow from '..'

export default class PublicLink {
  options: Options

  constructor(options: Options) {
    this.options = options
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

  static paramFromURL(param: string) {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    return params.get(param)
  }

  /* Simple options passed on URL, no crazy compression stuff */
  static optionFromURL(option: string) {
    let param = PublicLink.paramFromURL(option)
    if (param === null) {
      return null
    }
    param = param.toLowerCase()
    switch (option.toLowerCase()) {
      case 'phase':
        return Number(param)
      case 'raids':
        return param === 'true' ? true : false
      case 'worldbosses':
        return param === 'true' ? true : false
      case 'spellname':
        return param
      case 'pvprank':
        return Number(param)
    }
  }

  get baseURI() {
    // return `${document.baseURI}`
    return `https://kmmiles.gitlab.io/moonkin-calc/`
  }

  get url() {
    return `${this.baseURI}?gear=${this.generateGearParam}`
  }

  get lockedItemsFromURL() {
    let param = PublicLink.paramFromURL('gear')
    if (!param) {
      return wow.constants.defaults.character.lockedItems
    }

    /* param -> URI decoded param */
    let decodedParam = PublicLink.DecodeURI(param)

    /* decoded param -> binary string */
    let binaryString = Base64.atob(decodedParam)

    /* binary string -> ascii string */
    let asciiString = pako.inflate(binaryString, { to: 'string' })

    /*  asciiString -> JSON string -> array */
    let arr = JSON.parse(JSON.parse(asciiString))

    /* array -> lockedItems{} */
    let lockedItems = {
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

    return lockedItems
  }

  get generateGearParam() {
    /* convert it a string array */
    let itemArr = []
    itemArr.push(this.options.character.lockedItems.head)
    itemArr.push(this.options.character.lockedItems.hands)
    itemArr.push(this.options.character.lockedItems.neck)
    itemArr.push(this.options.character.lockedItems.waist)
    itemArr.push(this.options.character.lockedItems.shoulder)
    itemArr.push(this.options.character.lockedItems.legs)
    itemArr.push(this.options.character.lockedItems.back)
    itemArr.push(this.options.character.lockedItems.feet)
    itemArr.push(this.options.character.lockedItems.chest)
    itemArr.push(this.options.character.lockedItems.wrist)
    itemArr.push(this.options.character.lockedItems.finger)
    itemArr.push(this.options.character.lockedItems.finger2)
    itemArr.push(this.options.character.lockedItems.mainhand)
    itemArr.push(this.options.character.lockedItems.offhand)
    itemArr.push(this.options.character.lockedItems.trinket)
    itemArr.push(this.options.character.lockedItems.trinket2)
    itemArr.push(this.options.character.lockedItems.idol)

    /* convert array to json string */
    let jsonString = JSON.stringify(itemArr)

    /* gzip compress jsonString */
    let binaryString = pako.deflate(JSON.stringify(jsonString), { to: 'string', level: 9 })

    /* base64 encode gzipped jsonString */
    let base64string = btoa(binaryString)

    /* encode base64 string for URL */
    let encoded = PublicLink.EncodeURI(base64string)

    return encoded
  }
}
