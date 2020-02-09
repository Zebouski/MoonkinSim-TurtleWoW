/**
 * TODO: WIP. Stores talent selections. Talent bonus calculations will
 * probably move here.
 */
export default class Talents {
  public naturesGraceRank: number
  public moonFuryRank: number
  public vengeanceRank: number
  public improvedWrathRank: number
  public improvedStarfireRank: number
  public improvedMoonfireRank: number

  public constructor(
    naturesGraceRank: number,
    moonFuryRank: number,
    vengeanceRank: number,
    improvedWrathRank: number,
    improvedStarfireRank: number,
    improvedMoonfireRank: number
  ) {
    this.naturesGraceRank = naturesGraceRank
    this.moonFuryRank = moonFuryRank
    this.vengeanceRank = vengeanceRank
    this.improvedWrathRank = improvedWrathRank
    this.improvedStarfireRank = improvedStarfireRank
    this.improvedMoonfireRank = improvedMoonfireRank
  }

  public get improvedMoonfireBonus(): number {
    switch (this.improvedMoonfireRank) {
      case 1:
        return 1.02 // rank 1: 2% bonus
      case 2:
        return 1.04 // rank 2: 4% bonus
      case 3:
        return 1.06 // rank 3: 6% bonus
      case 4:
        return 1.08 // rank 4: 8% bonus
      case 5:
        return 1.1 // rank 5: 10% bonus
      default:
        return 1.0 // rank 0: 0% bonus
    }
  }

  /**
   * Increases the damage done by Starfire, Moonfire, and Wrath by 2/4/6/8/10%
   */
  public get moonFuryBonus(): number {
    switch (this.moonFuryRank) {
      case 1:
        return 1.02 // rank 1: 2% bonus
      case 2:
        return 1.04 // rank 2: 4% bonus
      case 3:
        return 1.06 // rank 3: 6% bonus
      case 4:
        return 1.08 // rank 4: 8% bonus
      case 5:
        return 1.1 // rank 5: 10% bonus
      default:
        return 1.0 // rank 0: 0% bonus
    }
  }

  /**
   * Reduces the cast of your Wrath spell by 0.1/0.2/0.3/0.4/0.5 sec
   */
  public get improvedWrathBonus(): number {
    switch (this.improvedWrathRank) {
      case 1:
        return 0.1 // Reduces the cast time of your Wrath spell by 0.1 sec.
      case 2:
        return 0.2 // Reduces the cast time of your Wrath spell by 0.2 sec.
      case 3:
        return 0.3 // Reduces the cast time of your Wrath spell by 0.3 sec.
      case 4:
        return 0.4 // Reduces the cast time of your Wrath spell by 0.4 sec.
      case 5:
        return 0.5 // Reduces the cast time of your Wrath spell by 0.5 sec.
      default:
        return 0
    }
  }

  /**
   * Reduces the cast of your Starfire spell by 0.1/0.2/0.3/0.4/0.5 sec
   */
  public get improvedStarfireBonus(): number {
    switch (this.improvedStarfireRank) {
      case 1:
        return 0.1 // Reduces the cast time of your Starfire spell by 0.1 sec.
      case 2:
        return 0.2 // Reduces the cast time of your Starfire spell by 0.2 sec.
      case 3:
        return 0.3 // Reduces the cast time of your Starfire spell by 0.3 sec.
      case 4:
        return 0.4 // Reduces the cast time of your Starfire spell by 0.4 sec.
      case 5:
        return 0.5 // Reduces the cast time of your Starfire spell by 0.5 sec.
      default:
        return 0
    }
  }

  /**
   * Increases the critical strike damage bonus of your Starfire, Moonfire, and Wrath spells by x%.
   */
  public get vengeanceBonus(): number {
    switch (this.vengeanceRank) {
      case 1:
        return 0.1 // rank 1: Increases the critical strike damage bonus by 20%
      case 2:
        return 0.2 // rank 2: Increases the critical strike damage bonus by 40%
      case 3:
        return 0.3 // rank 3: Increases the critical strike damage bonus by 60%
      case 4:
        return 0.4 // rank 4: Increases the critical strike damage bonus by 80%
      case 5:
        return 0.5 // rank 5: Increases the critical strike damage bonus by 100%
      default:
        return 0.0
    }
  }

  /**
   * Returns natures grace reduction, if the talent is learned
   */
  public get naturesGraceBonus(): number {
    return this.naturesGraceRank === 1 ? 0.5 : 0
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
