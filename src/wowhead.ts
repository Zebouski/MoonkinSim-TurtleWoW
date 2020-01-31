/*

import axios from 'axios'
import xml2js from 'xml2js'

export class WowHead {
  public async fetchItemByName(): Promise<any> {
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
}
  */
