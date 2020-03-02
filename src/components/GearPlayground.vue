<template>
  <div>
    <section id="mainSection" class="section has-background-grey-darker">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <b-tabs class="block">
                <b-tab-item label="Gear">
                  <div class="columns is-mobile">
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column is-narrow">
                          <div
                            class="image-wrapper"
                            @mouseenter="mouseEnter"
                            @mousemove="mouseMove"
                            @mouseleave="mouseLeave"
                          >
                            <figure class="image is-48x48">
                              <img :src="gearHead.iconFullPath" />
                            </figure>
                          </div>
                        </div>
                        <div class="column">
                          <p :class="gearHead.qualityName.toLowerCase()" class="has-text-left is-size-7-mobile">
                            {{ gearHead.name }}
                          </p>
                          <p class="uncommon has-text-left is-size-7">{{ gearHead.enchantText }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-narrow"></div>
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column">
                          <p class="item-name has-text-right is-size-7-mobile">
                            Mish'undare, Circlet of the Mind Flayer2
                          </p>
                          <p class="enchant has-text-right is-size-7">enchant</p>
                        </div>
                        <div class="column is-narrow">
                          <figure class="image-wrapper image is-48x48">
                            <img :src="gearHandsIcon" />
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-mobile">
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column is-narrow">
                          <div class="image-wrapper">
                            <figure class="image is-48x48">
                              <img :src="gearNeckIcon" />
                            </figure>
                          </div>
                        </div>
                        <div class="column">
                          <p class="item-name has-text-left is-size-7-mobile">
                            Mishd'undare, Circlet of the Mind Flayer3
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-narrow"></div>
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column">
                          <p class="item-name has-text-right is-size-7-mobile">
                            Mishd'undare, Circlet of the Mind Flayer3
                          </p>
                        </div>
                        <div class="column is-narrow">
                          <div class="image-wrapper">
                            <figure class="image is-48x48">
                              <img :src="gearWaistIcon" />
                            </figure>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-mobile">
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column is-narrow">
                          <div class="image-wrapper">
                            <figure class="image is-48x48">
                              <img :src="gearShouldersIcon" />
                            </figure>
                          </div>
                        </div>
                        <div class="column">
                          <p class="item-name has-text-left is-size-7-mobile">
                            Mishd'undare, Circlet of the Mind Flayer1
                          </p>
                          <p class="enchant has-text-left is-size-7">enchant</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-narrow"></div>
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column">
                          <p class="item-name has-text-right is-size-7-mobile">
                            Mish'undare, Circlet of the Mind Flayer2
                          </p>
                          <p class="enchant has-text-right is-size-7">enchant</p>
                        </div>
                        <div class="column is-narrow">
                          <figure class="image-wrapper image is-48x48">
                            <img :src="gearLegsIcon" />
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-mobile">
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column is-narrow">
                          <div class="image-wrapper">
                            <figure class="image is-48x48">
                              <img :src="gearBackIcon" />
                            </figure>
                          </div>
                        </div>
                        <div class="column">
                          <p class="item-name has-text-left is-size-7-mobile">
                            Mishd'undare, Circlet of the Mind Flayer1
                          </p>
                          <p class="enchant has-text-left is-size-7">enchant</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-narrow"></div>
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column">
                          <p class="item-name has-text-right is-size-7-mobile">
                            Mish'undare, Circlet of the Mind Flayer2
                          </p>
                          <p class="enchant has-text-right is-size-7">enchant</p>
                        </div>
                        <div class="column is-narrow">
                          <figure class="image-wrapper image is-48x48">
                            <img :src="gearFeetIcon" />
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-mobile">
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column is-narrow">
                          <div class="image-wrapper">
                            <figure class="image is-48x48">
                              <img :src="gearChestIcon" />
                            </figure>
                          </div>
                        </div>
                        <div class="column">
                          <p class="item-name has-text-left is-size-7-mobile">
                            Mishd'undare, Circlet of the Mind Flayer1
                          </p>
                          <p class="enchant has-text-left is-size-7">enchant</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-narrow"></div>
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column">
                          <p class="item-name has-text-right is-size-7-mobile">
                            Mish'undare, Circlet of the Mind Flayer2
                          </p>
                        </div>
                        <div class="column is-narrow">
                          <figure class="image-wrapper image is-48x48">
                            <img :src="gearFinger1Icon" />
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-mobile">
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column is-narrow">
                          <div class="image-wrapper">
                            <figure class="image is-48x48">
                              <img :src="gearWristsIcon" />
                            </figure>
                          </div>
                        </div>
                        <div class="column">
                          <p class="item-name has-text-left is-size-7-mobile">
                            Mishd'undare, Circlet of the Mind Flayer1
                          </p>
                          <p class="enchant has-text-left is-size-7">enchant</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-narrow"></div>
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column">
                          <p class="item-name has-text-right is-size-7-mobile">
                            Mish'undare, Circlet of the Mind Flayer2
                          </p>
                        </div>
                        <div class="column is-narrow">
                          <figure class="image-wrapper image is-48x48">
                            <img :src="gearFinger2Icon" />
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-mobile">
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column is-narrow">
                          <div class="image-wrapper">
                            <figure class="image is-48x48">
                              <img :src="gearMainHandIcon" />
                            </figure>
                          </div>
                        </div>
                        <div class="column">
                          <p class="item-name has-text-left is-size-7-mobile">
                            Mishd'undare, Circlet of the Mind Flayer1
                          </p>
                          <p class="enchant has-text-left is-size-7">enchant</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-narrow"></div>
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column">
                          <p class="item-name has-text-right is-size-7-mobile">
                            Mish'undare, Circlet of the Mind Flayer2
                          </p>
                        </div>
                        <div class="column is-narrow">
                          <figure class="image-wrapper image is-48x48">
                            <img :src="gearTrinket1Icon" />
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-mobile">
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column is-narrow">
                          <div class="image-wrapper">
                            <figure class="image is-48x48">
                              <img :src="gearOffHandIcon" />
                            </figure>
                          </div>
                        </div>
                        <div class="column">
                          <p class="item-name has-text-left is-size-7-mobile">
                            Mishd'undare, Circlet of the Mind Flayer1
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-narrow"></div>
                    <div class="column">
                      <div class="columns is-mobile">
                        <div class="column">
                          <p class="item-name has-text-right is-size-7-mobile">
                            Mish'undare, Circlet of the Mind Flayer2
                          </p>
                        </div>
                        <div class="column is-narrow">
                          <figure class="image-wrapper image is-48x48">
                            <img :src="gearTrinket2Icon" />
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
                <pre>{{ gearHead }}</pre>
                <pre>{{ gearWeaponCombo }}</pre>
                <!--
                <aside v-if="hover" class="wow-item" :style="toolTipStyle" :data-quality="highlightedItem.qualityName">
                -->
                <aside
                  class="wow-item"
                  :class="{ hidden: !hover }"
                  :style="toolTipStyle"
                  :data-quality="highlightedItem.qualityName"
                >
                  <header class="wow-item__header">
                    <p class="header__title">{{ highlightedItem.name }}</p>
                    <p class="header__item-level">Item Level {{ highlightedItem.itemJSON.level }}</p>
                    <p class="header__binds">{{ highlightedItem.bindText }}</p>
                    <p v-if="highlightedItem.itemJSON.unique" class="header__unique">Unique</p>
                  </header>
                  <section class="wow-item__type">
                    <p class="type__slot">{{ highlightedItem.slotName }}</p>
                    <p class="type__item">{{ highlightedItem.subclassName }}</p>
                  </section>

                  <section class="wow-item__stats">
                    <p v-if="highlightedItem.class === wow.ItemClass.Weapon" class="stats__damage-armor">
                      <span class="value">{{ highlightedItem.dmgText }}</span>
                      Damage
                    </p>
                    <p v-if="highlightedItem.class === wow.ItemClass.Weapon" class="stats__speed">
                      Speed <span class="value">{{ highlightedItem.speedText }}</span>
                    </p>
                    <p v-if="highlightedItem.class === wow.ItemClass.Weapon" class="stats__dps">
                      (<span class="value">{{ highlightedItem.dpsText }}</span> damage per second)
                    </p>

                    <p v-if="highlightedItem.class === wow.ItemClass.Armor" class="stats__armor">
                      {{ highlightedItem.itemJSON.armor }} Armor
                    </p>

                    <div class="stats__list">
                      <p
                        v-for="stat in highlightedItem.statsList"
                        :key="stat.stat"
                        class="stats__list-item"
                        :class="'stats__' + stat.type"
                      >
                        +{{ stat.value }} {{ stat.stat }}
                      </p>
                    </div>
                  </section>

                  <section class="wow-item__info">
                    <p v-if="highlightedItem.durability" class="info__durability">
                      Durability: {{ highlightedItem.durability }} / {{ highlightedItem.durability }}
                    </p>

                    <p v-for="hit in highlightedItem.chanceOnHitList" :key="hit" class="info__chance-on-hit">
                      Chance on hit: {{ hit }}
                    </p>
                    <p v-if="highlightedItem.allowableClassesText" class="info__class-requirement">
                      Classes: <span class="value">{{ highlightedItem.allowableClassesText }}</span>
                    </p>
                    <p class="info__level-requirement">Requires Level {{ highlightedItem.itemJSON.reqLevel }}</p>
                  </section>

                  <section class="wow-item__bonuses">
                    <p v-for="bonus in highlightedItem.bonusesList" :key="bonus" class="bonuses__bonus">
                      {{ bonus }}
                    </p>
                  </section>
                </aside>
              </b-tabs>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.image-wrapper {
  border: 0.0625rem solid #595959;
}

.poor {
  color: #9d9d9d;
}

.common {
  color: #ffffff;
}

.uncommon {
  color: #1eff00;
}

.rare {
  color: #0070dd;
}

.epic {
  color: #a335ee;
}

.legendary {
  color: #ff8000;
}

.item-name {
  color: #a335ee;
}

.enchant {
  color: #1eff00;
}

.heading {
  color: #fff;
}

.title {
  color: #fff;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

const newGear = new wow.Equipment(
  new wow.Item(`Adventurer's Bandana of Nature's Wrath`, `Arcanum of Focus`),
  new wow.Item(`Abyssal Cloth Handwraps of Sorcery`, `Enchant Gloves - Healing Power`),
  new wow.Item(`Pristine Enchanted South Seas Kelp`, `Empty`),
  new wow.Item(`Abyssal Cloth Sash of Sorcery`, `Empty`),
  new wow.Item(`Abyssal Cloth Amice of Sorcery`, `Zandalar Signet of Mojo`),
  new wow.Item(`Abyssal Cloth Pants of Sorcery`, `Arcanum of Focus`),
  new wow.Item(`Adventurer's Cape of Arcane Wrath`, `Enchant Cloak - Subtlety`),
  new wow.Item(`Abyssal Cloth Slippers of Sorcery`, `Enchant Boots - Minor Speed`),
  new wow.Item(`Alanna's Embrace`, `Enchant Chest - Greater Stats`),
  new wow.Item(`Advisor's Ring`, `Empty`),
  new wow.Item(`Abyssal Cloth Wristbands of Sorcery`, `Enchant Bracer - Greater Intellect`),
  new wow.Item(`Advisor's Ring`, `Empty`),
  new wow.Item(`Dire Nail of Nature's Wrath`, `Enchant Weapon - Spell Power`),
  new wow.Item(`Briarwood Reed`, `Empty`),
  new wow.Item(`Astral Orb of Arcane Wrath`, `Empty`),
  new wow.Item(`Briarwood Reed`, `Empty`),
  new wow.Item(`Idol of the Moon`, `Empty`)
)

// console.log(newGear)

@Component
export default class MoonkinCalc extends Vue {
  phases = wow.Database.phaseList()
  phase = 3
  faction = 'Horde'
  spellName = 'Starfire Rank 6'

  /* target */
  targetNames = wow.Database.targetList()
  targetName = 'Ragnaros'
  targetSpellResistance = 75
  curseOfShadow = true
  spellVuln = false
  stormStrike = false

  /* talents */
  naturesGraceRank = 1
  moonFuryRank = 5
  vengeanceRank = 5
  improvedWrathRank = 5
  improvedStarfireRank = 5
  improvedMoonfireRank = 5

  /* buffs */
  moonkinAura = true
  flaskOfSupremePower = true
  greaterArcaneElixir = true
  cerebralCortexCompound = true
  runnTumTuberSurprise = true
  powerInfusion = false
  ephemeralPower = false
  rallyingCryOfTheDragonSlayer = true
  slipkiksSavvy = true
  songflowerSerenade = true
  saygesDarkFortune = false
  tracesOfSilithyst = false
  arcaneBrilliance = true
  blessingOfKings = true
  improvedGiftOfTheWild = true
  burningAdrenaline = false

  stamina = this.rawGear.stamina
  intellect = this.rawGear.intellect
  spirit = this.rawGear.spirit
  mp5 = this.rawGear.mp5
  spellPenetration = this.rawGear.spellPenetration
  spellHit = this.rawGear.spellHit
  spellCrit = this.rawGear.spellCrit
  spellDamage = this.rawGear.spellDamage
  arcaneDamage = this.rawGear.arcaneDamage
  natureDamage = this.rawGear.natureDamage

  hover = false
  toolTipStyle = {
    top: '0px',
    left: '0px'
  }

  buffNames = []

  mouseEnter(event: any): void {
    this.hover = true
    // console.log(event)
  }

  mouseMove(event: any): void {
    // console.log(event)
    this.toolTipStyle.left = event.clientX + 10 + 'px'
    this.toolTipStyle.top = event.clientY - 200 + 'px'
  }

  mouseLeave(event: any): void {
    this.hover = false
    console.log(event)
  }

  phaseChange(): void {
    // window.alert('phase changed: ' + this.phase)
    this.stamina = this.rawGear.stamina
    this.intellect = this.rawGear.intellect
    this.spirit = this.rawGear.spirit
    this.mp5 = this.rawGear.mp5
    this.spellPenetration = this.rawGear.spellPenetration
    this.spellHit = this.rawGear.spellHit
    this.spellCrit = this.rawGear.spellCrit
    this.spellDamage = this.rawGear.spellDamage
    this.arcaneDamage = this.rawGear.arcaneDamage
    this.natureDamage = this.rawGear.natureDamage
  }

  get wow() {
    return wow
  }

  get rawGear() {
    return new wow.RawGear(this.phase)
  }

  get publicPath() {
    return process.env.BASE_URL
  }

  get iconPath() {
    return process.env.BASE_URL + 'wow-icons'
  }

  get highlightedItem() {
    return this.gearHead
  }

  get gearWeaponCombo() {
    const weaponCombo = wow.Database.getBestInSlotWeaponCombo(
      5,
      wow.Faction.Alliance | wow.Faction.Horde,
      wow.MagicSchool.Nature,
      this.spellCast.spellHitWeight,
      this.spellCast.spellCritWeight
    )
    return weaponCombo
  }

  get gearHead() {
    const _item = wow.Database.getBestInSlotItem(
      wow.ItemSlot.Onehand,
      6,
      wow.Faction.Alliance | wow.Faction.Horde,
      wow.MagicSchool.Arcane,
      this.spellCast.spellHitWeight,
      this.spellCast.spellCritWeight
    )
    const _itemEnchant = wow.Database.getBestInSlotEnchant(
      wow.ItemSlot.Head,
      5,
      wow.MagicSchool.Arcane,
      this.spellCast.spellHitWeight,
      this.spellCast.spellCritWeight
    )

    return new wow.Item(_item.name, _itemEnchant.name)
  }

  get gearHeadIcon() {
    return `${this.iconPath}/Head.png`
  }

  get gearHandsIcon() {
    return `${this.iconPath}/Hands.png`
  }

  get gearWaistIcon() {
    return `${this.iconPath}/Waist.png`
  }

  get gearNeckIcon() {
    return `${this.iconPath}/Neck.png`
  }

  get gearShouldersIcon() {
    return `${this.iconPath}/Shoulders.png`
  }

  get gearLegsIcon() {
    return `${this.iconPath}/Legs.png`
  }

  get gearBackIcon() {
    return `${this.iconPath}/Back.png`
  }

  get gearFeetIcon() {
    return `${this.iconPath}/Feet.png`
  }

  get gearChestIcon() {
    return `${this.iconPath}/Chest.png`
  }

  get gearFinger1Icon() {
    return `${this.iconPath}/Finger.png`
  }

  get gearWristsIcon() {
    return `${this.iconPath}/Wrists.png`
  }

  get gearFinger2Icon() {
    return `${this.iconPath}/Finger.png`
  }

  get gearMainHandIcon() {
    return `${this.iconPath}/MainHand.png`
  }

  get gearTrinket1Icon() {
    return `${this.iconPath}/Trinket.png`
  }

  get gearOffHandIcon() {
    return `${this.iconPath}/OffHand.png`
  }

  get gearTrinket2Icon() {
    return `${this.iconPath}/Trinket.png`
  }

  get spellCast() {
    return new wow.Cast(
      new wow.Character(
        wow.constants.playerLevelCap,
        wow.PlayableRace.Tauren,
        wow.PlayableClass.Druid,
        wow.Gender.Male,
        new wow.Talents(
          this.naturesGraceRank,
          this.moonFuryRank,
          this.vengeanceRank,
          this.improvedWrathRank,
          this.improvedStarfireRank,
          this.improvedMoonfireRank
        ),
        new wow.Gear(
          this.stamina,
          this.intellect,
          this.spirit,
          this.mp5,
          this.spellPenetration,
          this.spellHit,
          this.spellCrit,
          this.spellDamage,
          this.arcaneDamage,
          this.natureDamage
        ),
        wow.Character.buffListToFlags(this.buffNames)
      ),
      new wow.Spell(this.spellName),
      new wow.Target(
        wow.TargetType.Elemental,
        this.targetSpellResistance,
        wow.Character.buffListToFlags(this.buffNames)
      )
    )
  }
}
</script>
