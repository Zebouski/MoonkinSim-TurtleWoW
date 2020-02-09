/**
 * TODO: WIP. Debuffs currently applied to Target.
 */
export default class Debuffs {
  public curseOfShadow: boolean
  public stormStrike: boolean
  public spellVuln: boolean

  public constructor(curseOfShadow: boolean, stormStrike: boolean, spellVuln: boolean) {
    this.curseOfShadow = curseOfShadow
    this.stormStrike = stormStrike
    this.spellVuln = spellVuln
  }

  public get spellVulnBonus(): number {
    return this.spellVuln ? 1.15 : 1.0
  }

  /**
   * ...reducing Shadow and Arcane resistances by 75...
   */
  public get curseOfShadowResistBonus(): number {
    return this.curseOfShadow ? 75 : 0
  }

  /**
   * ...and increasing Shadow and Arcane damage taken by 10%...
   */
  public get curseOfShadowDamageBonus(): number {
    return this.curseOfShadow ? 1.1 : 1.0
  }

  /**
   * ..the next 2 sources of Nature damage dealt to the target are increased by 20%
   */
  public get stormStrikeBonus(): number {
    return this.stormStrike ? 1.2 : 1.0
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this)
    const jsonObj: any = Object.assign({}, this)

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key]
            jsonObj[key] = val
          } catch (error) {
            console.error(`Error calling getter ${key}`, error)
          }
        }
      })

    return jsonObj
  }
}
