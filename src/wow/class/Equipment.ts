import Item from './Item'

/* head, gloves, neck, waist, shoulders, legs, back, feet, chest, finger1
wrists, finger 2, mainhand, trinket1, offhand, trinket2 */
export default class Equipment {
  public head: Item
  public hands: Item
  public neck: Item
  public waist: Item
  public shoulders: Item
  public legs: Item
  public back: Item
  public feet: Item
  public chest: Item
  public finger1: Item
  public wrists: Item
  public finger2: Item
  public mainhand: Item
  public trinket1: Item
  public offhand: Item
  public trinket2: Item
  public idol: Item

  public constructor(
    head: Item,
    hands: Item,
    neck: Item,
    waist: Item,
    shoulders: Item,
    legs: Item,
    back: Item,
    feet: Item,
    chest: Item,
    finger1: Item,
    wrists: Item,
    finger2: Item,
    mainhand: Item,
    trinket1: Item,
    offhand: Item,
    trinket2: Item,
    idol: Item
  ) {
    this.head = head
    this.hands = hands
    this.neck = neck
    this.waist = waist
    this.shoulders = shoulders
    this.legs = legs
    this.back = back
    this.feet = feet
    this.chest = chest
    this.finger1 = finger1
    this.wrists = wrists
    this.finger2 = finger2
    this.mainhand = mainhand
    this.trinket1 = trinket1
    this.offhand = offhand
    this.trinket2 = trinket2
    this.idol = idol
  }

  public get headUI(): Object {
    return {
      icon: `inv_helmet_52.png`,
      nameText: `Mishd'undare, Circlet of the Mind Flayer`,
      nameClass: 'epic has-text-left is-size-7-mobile',
      enchantText: '+8 Spell Damage and Healing',
      enchantClass: 'uncommon has-text-left is-size-7-mobile'
    }
  }

  public get spellDamage(): number {
    return (
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

  public get arcaneDamage(): number {
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
      this.idol.spellDamage
    )
  }

  public get natureDamage(): number {
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

  public get spellHit(): number {
    return (
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

  public get spellCrit(): number {
    return (
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

  public get intellect(): number {
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
}
