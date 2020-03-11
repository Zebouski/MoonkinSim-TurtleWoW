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
import PvPRank from '../enum/PvPRank'
import Faction from '../enum/Faction'
import TargetType from '../enum/TargetType'

export default class Item {
  public _slot: ItemSlot
  public itemJSON: ItemJSON | undefined
  public enchantJSON: EnchantJSON | undefined

  public constructor(slot: ItemSlot, itemJSON?: ItemJSON, enchantJSON?: EnchantJSON) {
    this._slot = slot
    this.itemJSON = itemJSON ? itemJSON : undefined
    this.enchantJSON = enchantJSON ? enchantJSON : undefined
  }

  public static calcTargetDamage(targetType: number, targetTypes: number, spellDamage: number): number {
    if (targetTypes === TargetType.All) {
      return spellDamage
    }

    let mySpellDamage = 0

    if ((targetTypes & TargetType.Undead) === TargetType.Undead) {
      if ((targetType === TargetType.Undead)) {
        mySpellDamage = spellDamage
      }
    }

    if ((targetTypes & TargetType.Demon) === TargetType.Demon) {
      if ((targetType === TargetType.Demon)) {
        mySpellDamage = spellDamage
      }
    }

    return mySpellDamage
  }

  public static scoreItem(
    item: ItemJSON,
    magicSchool: MagicSchool,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number
  ): number {
    return this.score(
      magicSchool,
      this.calcTargetDamage(
        targetType,
        item.targetTypes ? item.targetTypes : TargetType.All,
        item.spellDamage ? item.spellDamage : 0
      ),
      //  item.spellDamage
      //  ? ((item.targetTypes ? item.targetTypes : TargetType.All) & targetType) !== targetType
      //    ? 0
      //    : item.spellDamage
      //  : 0,
      item.arcaneDamage ? item.arcaneDamage : 0,
      item.natureDamage ? item.natureDamage : 0,
      item.spellHit ? item.spellHit : 0,
      item.spellCrit ? item.spellCrit : 0,
      item.intellect ? item.intellect : 0,
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
      (magicSchool && magicSchool === MagicSchool.Arcane ? arcaneDamage : 0) +
      (magicSchool && magicSchool === MagicSchool.Nature ? natureDamage : 0) +
      spellHit * spellHitWeight +
      spellCrit * spellCritWeight +
      (intellect / SpellCritFromIntellectDivisor.Druid) * spellCritWeight
    )
  }

  public get id(): number {
    return this.itemJSON && this.itemJSON.id ? this.itemJSON.id : 0
  }

  public get name(): string {
    return this.itemJSON && this.itemJSON.name ? this.itemJSON.name : ''
  }

  public get class(): ItemClass {
    if (this.itemJSON && this.itemJSON.class) {
      return this.itemJSON.class
    }

    switch (this.slot) {
      case ItemSlot.Twohand:
      case ItemSlot.Mainhand:
      case ItemSlot.Onehand:
        return ItemClass.Weapon
      default:
        return ItemClass.Armor
    }
  }

  public get isWeapon(): boolean {
    return this.class === ItemClass.Weapon
  }

  public get isArmor(): boolean {
    return this.class === ItemClass.Armor
  }

  public get subclass(): WeaponSubclass | ArmorSubclass {
    if (this.itemJSON && this.itemJSON.subclass) {
      return this.itemJSON.subclass
    }

    if (this.class === ItemClass.Weapon) {
      return WeaponSubclass.Empty
    }

    return ArmorSubclass.Empty
  }

  public get subclassName(): string {
    if (this.class === ItemClass.Armor) {
      switch (this.subclass) {
        default:
          return ArmorSubclass[this.subclass]
      }
    }

    switch (this.subclass) {
      case WeaponSubclass.OneHandedMace:
        return 'Mace'
      default:
        return WeaponSubclass[this.subclass]
    }
  }

  public get slot(): ItemSlot {
    return this.itemJSON ? this.itemJSON.slot : this._slot
  }

  public get slotName(): string {
    switch (this.slot) {
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
        return ItemSlot[this.slot]
    }
  }

  public isEmpty(): boolean {
    return this.itemJSON ? false : true
  }

  public get quality(): ItemQuality {
    return this.itemJSON && this.itemJSON.quality ? this.itemJSON.quality : ItemQuality.Poor
  }

  public get qualityName(): string {
    return ItemQuality[this.quality]
  }

  public get level(): number {
    return this.itemJSON && this.itemJSON.level ? this.itemJSON.level : 0
  }

  public get reqLevel(): number {
    return this.itemJSON && this.itemJSON.reqLevel ? this.itemJSON.reqLevel : 0
  }

  public get isBop(): boolean {
    return this.itemJSON && this.itemJSON.bop ? true : false
  }

  public get isUnique(): boolean {
    return this.itemJSON && this.itemJSON.unique ? this.itemJSON.unique : false
  }

  public get allowableClasses(): PlayableClass[] {
    return this.itemJSON && this.itemJSON.allowableClasses ? this.itemJSON.allowableClasses : []
  }

  public get allowableClassesText(): string {
    let ac = this.allowableClasses
    let text = ''

    for (let _i = 0; _i < ac.length; _i++) {
      text += PlayableClass[ac[_i]]
      if (_i < ac.length - 1) {
        text += ', '
      }
    }
    return text
  }

  public get targetTypes(): TargetType {
    return this.itemJSON && this.itemJSON.targetTypes ? this.itemJSON.targetTypes : TargetType.All
  }

  public get phase(): number {
    return this.itemJSON && this.itemJSON.phase ? this.itemJSON.phase : 1
  }

  public get pvpRank(): PvPRank {
    return this.itemJSON && this.itemJSON.pvpRank ? this.itemJSON.pvpRank : PvPRank.Grunt
  }

  public get icon(): string {
    let emptySlot = `${this.slotName.split(' ').join('')}`
    if (emptySlot === 'Offhand') {
      emptySlot = 'OffHand'
    }
    return this.itemJSON ? `${this.itemJSON.icon}.jpg` : `${emptySlot}.jpg`
  }

  public get iconFullPath(): string {
    return process.env.BASE_URL + 'wow-icons/' + this.icon
  }

  public get location(): string {
    return this.itemJSON && this.itemJSON.location ? this.itemJSON.location : ''
  }

  public get boss(): string {
    return this.itemJSON && this.itemJSON.boss ? this.itemJSON.boss : ''
  }

  public get worldBoss(): boolean {
    return this.itemJSON && this.itemJSON.worldBoss === true ? true : false
  }

  public get faction(): Faction {
    return this.itemJSON && this.itemJSON.faction ? this.itemJSON.faction : Faction.Horde
  }

  public get score(): number {
    return this.itemJSON && this.itemJSON.score ? this.itemJSON.score : 0
  }

  public get bindText(): string {
    return 'Binds ' + (this.isBop ? 'when picked up' : 'when equipped')
  }

  public get _stamina(): number {
    return this.itemJSON && this.itemJSON.stamina ? this.itemJSON.stamina : 0
  }

  public get stamina(): number {
    return this._stamina + (this.enchantJSON ? this.enchantJSON.stamina : 0)
  }

  public get _spirit(): number {
    return this.itemJSON && this.itemJSON.spirit ? this.itemJSON.spirit : 0
  }

  public get spirit(): number {
    return this._spirit + (this.enchantJSON ? this.enchantJSON.spirit : 0)
  }

  public get _spellHealing(): number {
    return this.itemJSON && this.itemJSON.spellHealing ? this.itemJSON.spellHealing : 0
  }

  public get spellHealing(): number {
    return this._spellHealing + (this.enchantJSON && this.enchantJSON.spellHealing ? this.enchantJSON.spellHealing : 0)
  }

  public get _spellDamage(): number {
    return this.itemJSON && this.itemJSON.spellDamage ? this.itemJSON.spellDamage : 0
  }

  public get spellDamage(): number {
    return this._spellDamage + (this.enchantJSON ? this.enchantJSON.spellDamage : 0)
  }

  public get _arcaneDamage(): number {
    return this.itemJSON && this.itemJSON.arcaneDamage ? this.itemJSON.arcaneDamage : 0
  }

  public get arcaneDamage(): number {
    return this._arcaneDamage + (this.enchantJSON ? this.enchantJSON.arcaneDamage : 0)
  }

  public get _natureDamage(): number {
    return this.itemJSON && this.itemJSON.natureDamage ? this.itemJSON.natureDamage : 0
  }

  public get natureDamage(): number {
    return this._natureDamage + (this.enchantJSON ? this.enchantJSON.natureDamage : 0)
  }

  public get _spellHit(): number {
    return this.itemJSON && this.itemJSON.spellHit ? this.itemJSON.spellHit : 0
  }

  public get spellHit(): number {
    return this._spellHit + (this.enchantJSON ? this.enchantJSON.spellHit : 0)
  }

  public get _spellCrit(): number {
    return this.itemJSON && this.itemJSON.spellCrit ? this.itemJSON.spellCrit : 0
  }

  public get spellCrit(): number {
    return this._spellCrit + (this.enchantJSON ? this.enchantJSON.spellCrit : 0)
  }

  public get _intellect(): number {
    return this.itemJSON && this.itemJSON.intellect ? this.itemJSON.intellect : 0
  }

  public get intellect(): number {
    return this._intellect + (this.enchantJSON ? this.enchantJSON.intellect : 0)
  }

  public get _mp5(): number {
    return this.itemJSON && this.itemJSON.mp5 ? this.itemJSON.mp5 : 0
  }

  public get mp5(): number {
    return this._mp5 + (this.enchantJSON ? this.enchantJSON.mp5 : 0)
  }

  public get _armor(): number {
    return this.itemJSON && this.itemJSON.armor ? this.itemJSON.armor : 0
  }

  public get armor(): number {
    return this._armor + (this.enchantJSON && this.enchantJSON.armor ? this.enchantJSON.armor : 0)
  }

  public get durability(): number {
    return this.itemJSON && this.itemJSON.durability ? this.itemJSON.durability : 0
  }

  public get minDmg(): number {
    return this.itemJSON && this.itemJSON.minDmg ? this.itemJSON.minDmg : 0
  }

  public get maxDmg(): number {
    return this.itemJSON && this.itemJSON.maxDmg ? this.itemJSON.maxDmg : 0
  }

  public get dmgText(): string {
    let minDmg = this.itemJSON && this.itemJSON.minDmg ? this.itemJSON.minDmg.toFixed(0) : 0
    let maxDmg = this.itemJSON && this.itemJSON.maxDmg ? this.itemJSON.maxDmg.toFixed(0) : 0
    return `${minDmg} - ${maxDmg}`
  }

  public get speed(): number {
    return this.itemJSON && this.itemJSON.speed ? this.itemJSON.speed : 0
  }

  public get speedText(): string {
    if (!this.itemJSON || !this.itemJSON.speed) {
      return ''
    }
    return `${parseFloat(this.itemJSON.speed.toFixed(1)).toFixed(2)}`
  }

  public get dps(): number {
    return this.itemJSON && this.itemJSON.dps ? this.itemJSON.dps : 0
  }

  public get dpsText(): string {
    if (!this.itemJSON || !this.itemJSON.dps) {
      return ''
    }
    return `${parseFloat(this.itemJSON.dps.toFixed(1)).toFixed(2)}`
  }

  public get enchantText(): string {
    return this.enchantJSON ? this.enchantJSON.text : 'No Enchant'
  }

  public get enchantClass(): string {
    return this.enchantJSON ? 'uncommon' : 'poor'
  }

  public get bonusesList(): string[] {
    let bonuses: string[] = []
    if (
      this.name.includes(`of Arcane Wrath`) ||
      this.name.includes(`of Nature's Wrath`) ||
      this.name.includes(`of Sorcery`) ||
      this.name.includes(`of Restoration`)
    ) {
      if (this._spellHit > 0) {
        bonuses.push(`Equip: Improves your chance to hit with spells by ${this._spellHit}%.`)
      }
      if (this._spellCrit > 0) {
        bonuses.push(`Equip: Improves your chance to get a critical strike with spells by ${this._spellCrit}%.`)
      }
      return bonuses
    }

    if (this._spellHit > 0) {
      bonuses.push(`Equip: Improves your chance to hit with spells by ${this._spellHit}%.`)
    }

    if (this._spellCrit > 0) {
      bonuses.push(`Equip: Improves your chance to get a critical strike with spells by ${this._spellCrit}%.`)
    }

    if (this._spellDamage > 0) {
      if (
        (this.targetTypes & TargetType.Undead) === TargetType.Undead &&
        (this.targetTypes & TargetType.Demon) === TargetType.Demon
      ) {
        bonuses.push(
          `Equip: Increases damage done to Undead and Demons by magical spells and effects by up to ${this._spellDamage}.`
        )
      } else if ((this.targetTypes & TargetType.Undead) === TargetType.Undead) {
        bonuses.push(
          `Equip: Increases damage done to Undead by magical spells and effects by up to ${this._spellDamage}.`
        )
      } else {
        bonuses.push(
          `Equip: Increases damage and healing done by magical spells and effects by up to ${this._spellDamage}.`
        )
      }
    }

    if (this._arcaneDamage > 0) {
      bonuses.push(`Equip: Increases damage done by Arcane spells and effects by up to ${this._arcaneDamage}.`)
    }

    if (this._natureDamage > 0) {
      bonuses.push(`Equip: Increases damage done by Nature spells and effects by up to ${this._natureDamage}.`)
    }

    if (this._mp5 > 0) {
      bonuses.push(`Equip: Restores ${this._mp5} mana per 5 sec.`)
    }

    return bonuses
  }

  public get statsList(): Object[] {
    let stats: Object[] = []
    if (this.name.includes(`of Arcane Wrath`)) {
      stats.push({ stat: 'Arcane Damage', value: this._arcaneDamage, type: 'primary' })
    } else if (this.name.includes(`of Nature's Wrath`)) {
      stats.push({ stat: 'Nature Damage', value: this._natureDamage, type: 'primary' })
    } else if (this.name.includes(`of Sorcery`)) {
      stats.push({ stat: 'Intellect', value: this._intellect, type: 'primary' })
      stats.push({ stat: 'Stamina', value: this._stamina, type: 'primary' })
      stats.push({ stat: 'Damage and Healing Spells', value: this._spellDamage, type: 'primary' })
    } else if (this.name.includes(`of Restoration`)) {
      stats.push({ stat: 'Stamina', value: this._stamina, type: 'primary' })
      stats.push({ stat: 'Healing Spells', value: this._spellHealing, type: 'primary' })
      stats.push({ stat: 'mana every 5 sec', value: this._mp5, type: 'primary' })
    } else {
      if (this._intellect > 0) {
        stats.push({ stat: 'Intellect', value: this._intellect, type: 'primary' })
      }

      if (this._stamina > 0) {
        stats.push({ stat: 'Stamina', value: this._stamina, type: 'primary' })
      }

      if (this._spirit > 0) {
        stats.push({ stat: 'Spirit', value: this._spirit, type: 'primary' })
      }
    }

    return stats
  }

  public get chanceOnHitList(): string[] {
    let arr: string[] = []

    return arr
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
