import Database from './Database'
import ItemJSON from '../interface/ItemJSON'
import EnchantJSON from '../interface/EnchantJSON'
import MagicSchool from '../enum/MagicSchool'
import ItemQuality from '../enum/ItemQuality'
import ItemSlot from '../enum/ItemSlot'
import ItemClass from '../enum/ItemClass'
import SpellCritFromIntellectDivisor from '../enum/SpellCritFromIntellectDivisor'
import ArmorSubclass from '../enum/ArmorSubclass'
import WeaponSubclass from '../enum/WeaponSubclass'
import PlayableClass from '../enum/PlayableClass'

export default class Item {
  public itemJSON: ItemJSON
  public enchantJSON: EnchantJSON

  public constructor(name: string, enchant: string) {
    this.itemJSON = Database.testGearByName(name)
    this.enchantJSON = Database.enchant(enchant)
  }

  public static scoreItem(
    item: Item,
    magicSchool: MagicSchool,
    spellHitWeight: number,
    spellCritWeight: number
  ): number {
    return this.score(
      magicSchool,
      item.spellDamage,
      item.arcaneDamage,
      item.natureDamage,
      item.spellHit,
      item.spellCrit,
      item.intellect,
      spellHitWeight,
      spellCritWeight
    )
  }

  public static scoreEnchant(
    enchant: EnchantJSON,
    magicSchool: MagicSchool,
    spellHitWeight: number,
    spellCritWeight: number
  ): number {
    return this.score(
      magicSchool,
      enchant.spellDamage,
      enchant.arcaneDamage,
      enchant.natureDamage,
      enchant.spellHit,
      enchant.spellCrit,
      enchant.intellect,
      spellHitWeight,
      spellCritWeight
    )
  }

  public static score(
    magicSchool: MagicSchool,
    spellDamage: number,
    arcaneDamage: number,
    natureDamage: number,
    spellHit: number,
    spellCrit: number,
    intellect: number,
    spellHitWeight: number,
    spellCritWeight: number
  ): number {
    return (
      spellDamage +
      (magicSchool === MagicSchool.Arcane ? arcaneDamage : 0) +
      (magicSchool === MagicSchool.Nature ? natureDamage : 0) +
      spellHit * spellHitWeight +
      spellCrit * spellCritWeight +
      (intellect / SpellCritFromIntellectDivisor.Druid) * spellCritWeight
    )
  }

  public static sortScoreAsc(a: ItemJSON | EnchantJSON, b: ItemJSON | EnchantJSON) {
    if (a.score === undefined || b.score === undefined) {
      return 0
    }
    return a.score - b.score
  }

  public static sortScoreDes(a: ItemJSON | EnchantJSON, b: ItemJSON | EnchantJSON) {
    if (a.score === undefined || b.score === undefined) {
      return 0
    }
    return b.score - a.score
  }

  public get name(): string {
    return this.itemJSON.name
  }

  public get quality(): ItemQuality {
    return this.itemJSON.quality
  }

  public get durability(): number {
    return this.itemJSON.durability !== undefined ? this.itemJSON.durability : 0
  }

  public get qualityName(): string {
    return ItemQuality[this.quality]
  }

  public get icon(): string {
    return `${this.itemJSON.icon}.png`
  }

  public get iconFullPath(): string {
    return process.env.BASE_URL + 'wow-icons/' + this.icon
  }

  public get bindText(): string {
    return 'Binds ' + (this.itemJSON.bop ? 'when picked up' : 'when equipped')
  }

  public get spellDamage(): number {
    return this.itemJSON.spellDamage + this.enchantJSON.spellDamage
  }

  public get arcaneDamage(): number {
    return this.itemJSON.arcaneDamage + this.enchantJSON.arcaneDamage
  }

  public get natureDamage(): number {
    return this.itemJSON.natureDamage + this.enchantJSON.natureDamage
  }

  public get spellHit(): number {
    return this.itemJSON.spellHit + this.enchantJSON.spellHit
  }

  public get spellCrit(): number {
    return this.itemJSON.spellCrit + this.enchantJSON.spellCrit
  }

  public get intellect(): number {
    return this.itemJSON.intellect + this.enchantJSON.intellect
  }

  public get class(): ItemClass {
    return this.itemJSON.class
  }

  public get subclassName(): string {
    if (this.class === ItemClass.Armor) {
      switch (this.itemJSON.subclass) {
        default:
          return ArmorSubclass[this.itemJSON.subclass]
      }
    }

    switch (this.itemJSON.subclass) {
      case WeaponSubclass.OneHandedMace:
        return 'Mace'
      default:
        return WeaponSubclass[this.itemJSON.subclass]
    }
  }

  public get slotName(): string {
    switch (this.itemJSON.slot) {
      case ItemSlot.Trinket2:
        return ItemSlot[ItemSlot.Trinket]
      case ItemSlot.Finger2:
        return ItemSlot[ItemSlot.Finger]
      case ItemSlot.Mainhand:
        return 'Main Hand'
      case ItemSlot.Ammo:
      case ItemSlot.Head:
      case ItemSlot.Neck:
      case ItemSlot.Shoulder:
      case ItemSlot.Shirt:
      case ItemSlot.Chest:
      case ItemSlot.Waist:
      case ItemSlot.Legs:
      case ItemSlot.Feet:
      case ItemSlot.Wrist:
      case ItemSlot.Hands:
      case ItemSlot.Finger:
      case ItemSlot.Trinket:
      case ItemSlot.Onehand:
      case ItemSlot.Ranged:
      case ItemSlot.Back:
      case ItemSlot.Twohand:
      case ItemSlot.Tabard:
      case ItemSlot.Offhand:
      case ItemSlot.Projectile:
      case ItemSlot.Relic:
      default:
        return ItemSlot[this.itemJSON.slot]
    }
  }

  public get enchantText(): string {
    return this.enchantJSON.text
  }

  public get bonusesList(): string[] {
    let bonuses: string[] = []
    if (
      this.name.includes(`of Arcane Wrath`) ||
      this.name.includes(`of Nature's Wrath`) ||
      this.name.includes(`of Sorcery`) ||
      this.name.includes(`of Restoration`)
    ) {
      return bonuses
    }

    if (this.itemJSON.spellHit > 0) {
      bonuses.push(`Equip: Improves your chance to hit with spells by ${this.itemJSON.spellHit}%.`)
    }

    if (this.itemJSON.spellCrit > 0) {
      bonuses.push(`Equip: Improves your chance to get a critical strike with spells by ${this.itemJSON.spellCrit}%.`)
    }

    if (this.itemJSON.spellDamage > 0) {
      bonuses.push(
        `Equip: Increases damage and healing done by magical spells and effects by up to ${this.itemJSON.spellDamage}.`
      )
    }

    return bonuses
  }

  public get statsList(): Object[] {
    let stats: Object[] = []
    if (this.name.includes(`of Arcane Wrath`)) {
      stats.push({ stat: 'Arcane Damage', value: this.itemJSON.arcaneDamage, type: 'primary' })
    } else if (this.name.includes(`of Nature's Wrath`)) {
      stats.push({ stat: 'Nature Damage', value: this.itemJSON.natureDamage, type: 'primary' })
    } else if (this.name.includes(`of Sorcery`)) {
      stats.push({ stat: 'Intellect', value: this.itemJSON.intellect, type: 'primary' })
      stats.push({ stat: 'Stamina', value: this.itemJSON.stamina, type: 'primary' })
      stats.push({ stat: 'Damage and Healing Spells', value: this.itemJSON.spellDamage, type: 'primary' })
    } else if (this.name.includes(`of Restoration`)) {
      stats.push({ stat: 'Stamina', value: this.itemJSON.stamina, type: 'primary' })
      stats.push({ stat: 'Healing Spells', value: this.itemJSON.spellHealing, type: 'primary' })
      stats.push({ stat: 'mana every 5 sec', value: this.itemJSON.mp5, type: 'primary' })
    } else {
      if (this.itemJSON.intellect > 0) {
        stats.push({ stat: 'Intellect', value: this.itemJSON.intellect, type: 'primary' })
      }

      if (this.itemJSON.stamina > 0) {
        stats.push({ stat: 'Stamina', value: this.itemJSON.stamina, type: 'primary' })
      }

      if (this.itemJSON.spirit > 0) {
        stats.push({ stat: 'Spirit', value: this.itemJSON.spirit, type: 'primary' })
      }
    }

    return stats
  }

  public get chanceOnHitList(): string[] {
    let arr: string[] = []

    return arr
  }

  public get allowableClassesText(): string {
    let ac = this.itemJSON.allowableClasses ? this.itemJSON.allowableClasses : []
    let text = ''

    for (let _i = 0; _i < ac.length; _i++) {
      text += PlayableClass[ac[_i]]
      if (_i < ac.length - 1) {
        text += ', '
      }
    }
    return text
  }

  public get dmgText(): string {
    let minDmg = this.itemJSON.minDmg ? this.itemJSON.minDmg.toFixed(0) : 0
    let maxDmg = this.itemJSON.maxDmg ? this.itemJSON.maxDmg.toFixed(0) : 0
    return `${minDmg} - ${maxDmg}`
  }

  public get dpsText(): string {
    if (!this.itemJSON.dps) {
      return ''
    }
    return `${parseFloat(this.itemJSON.dps.toFixed(1)).toFixed(2)}`
  }

  public get speedText(): string {
    if (!this.itemJSON.speed) {
      return ''
    }
    return `${parseFloat(this.itemJSON.speed.toFixed(1)).toFixed(2)}`
  }

  public get fromWorldBoss(): boolean {
    switch (this.itemJSON.location.toUpperCase()) {
      case 'LORD KAZZAK':
      case 'AZUREGOS':
        return true
      default:
        return false
    }
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
