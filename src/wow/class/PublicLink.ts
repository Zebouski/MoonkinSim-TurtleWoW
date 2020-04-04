import Options from '../interface/Options'
import pako from 'pako'
import wow from '..'

export default class PublicLink {
  options: Options

  constructor(options: Options) {
    this.options = options
  }
  static Base64EncodeUrl(str: string) {
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  static Base64DecodeUrl(str: string) {
    str = (str + '===').slice(0, str.length + (str.length % 4))
    return str.replace(/-/g, '+').replace(/_/g, '/')
  }

  get baseURI() {
    // return `${document.baseURI}`
    return `https://kmmiles.gitlab.io/moonkin-calc/`
  }

  get url() {
    return `${this.baseURI}?gear=${this.paramFromGear}`
  }

  get lockedItemsFromURL() {
    // return this.paramFromURL ? this.paramFromURL : ''
    let param = this.paramFromURL
    if (!param) {
      return wow.constants.defaults.character.lockedItems
    }

    /* URI decode the string */
    let decodedParam = PublicLink.Base64DecodeUrl(param)

    /* convert base64 to binary string*/
    let binaryString = atob(decodedParam)

    /* decompress binary string to json */
    let jsonString = pako.inflate(binaryString, { to: 'string' })

    /* convert string to JSON */
    let arr = JSON.parse(JSON.parse(jsonString))

    /* convert array to lockedItems object */
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

  get paramFromURL() {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    return params.get('gear')
  }

  get paramFromGear() {
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
    let encoded = PublicLink.Base64EncodeUrl(base64string)

    return encoded
  }
}
