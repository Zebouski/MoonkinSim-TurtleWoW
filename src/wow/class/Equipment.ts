import Item from './Item'
import ItemSlot from '../enum/ItemSlot'

import ItemSearch from '../interface/ItemSearch'

/* head, gloves, neck, waist, shoulders, legs, back, feet, chest, finger1
wrists, finger 2, mainhand, trinket1, offhand, trinket2 */
export default class Equipment {
  itemSearch: ItemSearch
  head: Item
  hands: Item
  neck: Item
  waist: Item
  shoulders: Item
  legs: Item
  back: Item
  feet: Item
  chest: Item
  finger1: Item
  wrists: Item
  finger2: Item
  mainhand: Item
  trinket1: Item
  offhand: Item
  trinket2: Item
  idol: Item

  constructor(
    itemSearch: ItemSearch,
    head?: Item | undefined,
    hands?: Item | undefined,
    neck?: Item | undefined,
    waist?: Item | undefined,
    shoulders?: Item | undefined,
    legs?: Item | undefined,
    back?: Item | undefined,
    feet?: Item | undefined,
    chest?: Item | undefined,
    finger1?: Item | undefined,
    wrists?: Item | undefined,
    finger2?: Item | undefined,
    mainhand?: Item | undefined,
    trinket1?: Item | undefined,
    offhand?: Item | undefined,
    trinket2?: Item | undefined,
    idol?: Item | undefined
  ) {
    this.itemSearch = itemSearch
    this.head = head ? head : new Item(ItemSlot.Head)
    this.hands = hands ? hands : new Item(ItemSlot.Hands)
    this.neck = neck ? neck : new Item(ItemSlot.Neck)
    this.waist = waist ? waist : new Item(ItemSlot.Waist)
    this.shoulders = shoulders ? shoulders : new Item(ItemSlot.Shoulder)
    this.legs = legs ? legs : new Item(ItemSlot.Legs)
    this.back = back ? back : new Item(ItemSlot.Back)
    this.feet = feet ? feet : new Item(ItemSlot.Feet)
    this.chest = chest ? chest : new Item(ItemSlot.Chest)
    this.finger1 = finger1 ? finger1 : new Item(ItemSlot.Finger)
    this.wrists = wrists ? wrists : new Item(ItemSlot.Wrist)
    this.finger2 = finger2 ? finger2 : new Item(ItemSlot.Finger2)
    this.mainhand = mainhand ? mainhand : new Item(ItemSlot.Mainhand)
    this.trinket1 = trinket1 ? trinket1 : new Item(ItemSlot.Trinket)
    this.offhand = offhand ? offhand : new Item(ItemSlot.Offhand)
    this.trinket2 = trinket2 ? trinket2 : new Item(ItemSlot.Trinket2)
    this.idol = idol ? idol : new Item(ItemSlot.Relic)
  }

  static printItemNames(equipment: Equipment) {
    console.log(`
      ${equipment.head.name}, ${equipment.hands.name}, ${equipment.neck.name},
      ${equipment.waist.name}, ${equipment.shoulders.name}, ${equipment.legs.name},
      ${equipment.back.name}, ${equipment.feet.name}, ${equipment.chest.name},
      ${equipment.finger1.name}, ${equipment.wrists.name}, ${equipment.finger2.name},
      ${equipment.mainhand.name}, ${equipment.trinket1.name}, ${equipment.offhand.name},
      ${equipment.trinket2.name}, ${equipment.idol.spellDamage}`)
  }

  get hasBloodvine() {
    if (
      this.itemSearch.tailoring &&
      this.chest.name === `Bloodvine Vest` &&
      this.legs.name === `Bloodvine Leggings` &&
      this.feet.name === `Bloodvine Boots`
    ) {
      return true
    }
    return false
  }

  get hasZanzils() {
    if (
      (this.finger1.name === `Zanzil's Band` || this.finger1.name === `Zanzil's Seal`) &&
      (this.finger1.name === `Zanzil's Seal` || this.finger1.name === `Zanzil's Band`)
    ) {
      return true
    }
    return false
  }

  get spellDamage(): number {
    return (
      (this.hasZanzils ? 6 : 0) +
      this.head.spellDamage +
      this.hands.spellDamage +
      this.neck.spellDamage +
      this.waist.spellDamage +
      this.shoulders.spellDamage +
      this.legs.spellDamage +
      this.back.spellDamage +
      this.feet.spellDamage +
      this.chest.spellDamage +
      this.finger1.spellDamage +
      this.wrists.spellDamage +
      this.finger2.spellDamage +
      this.mainhand.spellDamage +
      this.trinket1.spellDamage +
      this.offhand.spellDamage +
      this.trinket2.spellDamage +
      this.idol.spellDamage
    )
  }

  get arcaneDamage(): number {
    return (
      this.head.arcaneDamage +
      this.hands.arcaneDamage +
      this.neck.arcaneDamage +
      this.waist.arcaneDamage +
      this.shoulders.arcaneDamage +
      this.legs.arcaneDamage +
      this.back.arcaneDamage +
      this.feet.arcaneDamage +
      this.chest.arcaneDamage +
      this.finger1.arcaneDamage +
      this.wrists.arcaneDamage +
      this.finger2.arcaneDamage +
      this.mainhand.arcaneDamage +
      this.trinket1.arcaneDamage +
      this.offhand.arcaneDamage +
      this.trinket2.arcaneDamage +
      this.idol.arcaneDamage
    )
  }

  get natureDamage(): number {
    return (
      this.head.natureDamage +
      this.hands.natureDamage +
      this.neck.natureDamage +
      this.waist.natureDamage +
      this.shoulders.natureDamage +
      this.legs.natureDamage +
      this.back.natureDamage +
      this.feet.natureDamage +
      this.chest.natureDamage +
      this.finger1.natureDamage +
      this.wrists.natureDamage +
      this.finger2.natureDamage +
      this.mainhand.natureDamage +
      this.trinket1.natureDamage +
      this.offhand.natureDamage +
      this.trinket2.natureDamage +
      this.idol.natureDamage
    )
  }

  get spellHit(): number {
    return (
      (this.hasZanzils ? 1 : 0) +
      this.head.spellHit +
      this.hands.spellHit +
      this.neck.spellHit +
      this.waist.spellHit +
      this.shoulders.spellHit +
      this.legs.spellHit +
      this.back.spellHit +
      this.feet.spellHit +
      this.chest.spellHit +
      this.finger1.spellHit +
      this.wrists.spellHit +
      this.finger2.spellHit +
      this.mainhand.spellHit +
      this.trinket1.spellHit +
      this.offhand.spellHit +
      this.trinket2.spellHit +
      this.idol.spellHit
    )
  }

  get spellCrit(): number {
    return (
      (this.hasBloodvine ? 2 : 0) +
      this.head.spellCrit +
      this.hands.spellCrit +
      this.neck.spellCrit +
      this.waist.spellCrit +
      this.shoulders.spellCrit +
      this.legs.spellCrit +
      this.back.spellCrit +
      this.feet.spellCrit +
      this.chest.spellCrit +
      this.finger1.spellCrit +
      this.wrists.spellCrit +
      this.finger2.spellCrit +
      this.mainhand.spellCrit +
      this.trinket1.spellCrit +
      this.offhand.spellCrit +
      this.trinket2.spellCrit +
      this.idol.spellDamage
    )
  }

  get intellect(): number {
    return (
      this.head.intellect +
      this.hands.intellect +
      this.neck.intellect +
      this.waist.intellect +
      this.shoulders.intellect +
      this.legs.intellect +
      this.back.intellect +
      this.feet.intellect +
      this.chest.intellect +
      this.finger1.intellect +
      this.wrists.intellect +
      this.finger2.intellect +
      this.mainhand.intellect +
      this.trinket1.intellect +
      this.offhand.intellect +
      this.trinket2.intellect +
      this.idol.intellect
    )
  }

  get stamina(): number {
    return (
      this.head.stamina +
      this.hands.stamina +
      this.neck.stamina +
      this.waist.stamina +
      this.shoulders.stamina +
      this.legs.stamina +
      this.back.stamina +
      this.feet.stamina +
      this.chest.stamina +
      this.finger1.stamina +
      this.wrists.stamina +
      this.finger2.stamina +
      this.mainhand.stamina +
      this.trinket1.stamina +
      this.offhand.stamina +
      this.trinket2.stamina +
      this.idol.stamina
    )
  }

  get spirit(): number {
    return (
      this.head.spirit +
      this.hands.spirit +
      this.neck.spirit +
      this.waist.spirit +
      this.shoulders.spirit +
      this.legs.spirit +
      this.back.spirit +
      this.feet.spirit +
      this.chest.spirit +
      this.finger1.spirit +
      this.wrists.spirit +
      this.finger2.spirit +
      this.mainhand.spirit +
      this.trinket1.spirit +
      this.offhand.spirit +
      this.trinket2.spirit +
      this.idol.spirit
    )
  }

  get mp5(): number {
    return (
      this.head.mp5 +
      this.hands.mp5 +
      this.neck.mp5 +
      this.waist.mp5 +
      this.shoulders.mp5 +
      this.legs.mp5 +
      this.back.mp5 +
      this.feet.mp5 +
      this.chest.mp5 +
      this.finger1.mp5 +
      this.wrists.mp5 +
      this.finger2.mp5 +
      this.mainhand.mp5 +
      this.trinket1.mp5 +
      this.offhand.mp5 +
      this.trinket2.mp5 +
      this.idol.mp5
    )
  }

  /* TODO: There's isn't any spell pen gear yet */
  get spellPenetration(): number {
    return 0
  }
}
