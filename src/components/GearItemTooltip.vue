<template>
  <aside class="wow-item" :data-quality="itemData.qualityName">
    <header class="wow-item__header">
      <p class="header__title">{{ itemData.name }}</p>
      <p class="header__item-level">
        Item Level {{ itemData.level }} (Score {{ parseFloat(itemData.score.toFixed(2)) }})
      </p>
      <p class="header__binds">{{ itemData.bindText }}</p>
      <p v-if="itemData.isUnique" class="header__unique">Unique</p>
    </header>
    <section class="wow-item__type">
      <p class="type__slot">{{ itemData.slotName }}</p>
      <p class="type__item">{{ itemData.subclassName }}</p>
    </section>

    <section class="wow-item__stats">
      <p v-if="itemData.isWeapon" class="stats__damage-armor">
        <span class="value">{{ itemData.dmgText }}</span>
        Damage
      </p>
      <p v-if="itemData.isWeapon" class="stats__speed">
        Speed
        <span class="value">{{ itemData.speedText }}</span>
      </p>
      <p v-if="itemData.isWeapon" class="stats__dps">
        (
        <span class="value">{{ itemData.dpsText }}</span> damage per second)
      </p>

      <p v-if="itemData.isArmor && itemData._armor > 0" class="stats__armor">{{ itemData._armor }} Armor</p>

      <div class="stats__list">
        <p v-for="stat in itemData.statsList" :key="stat.stat" class="stats__list-item" :class="'stats__' + stat.type">
          +{{ stat.value }} {{ stat.stat }}
        </p>
      </div>
    </section>

    <section class="wow-item__info">
      <p v-if="itemData.durability" class="info__durability">
        Durability: {{ itemData.durability }} / {{ itemData.durability }}
      </p>

      <p v-for="hit in itemData.chanceOnHitList" :key="hit" class="info__chance-on-hit">Chance on hit: {{ hit }}</p>
      <p v-if="itemData.allowableClassesText" class="info__class-requirement">
        Classes:
        <span class="value">{{ itemData.allowableClassesText }}</span>
      </p>
      <p class="info__level-requirement">Requires Level {{ itemData.reqLevel }}</p>
    </section>

    <section class="wow-item__bonuses">
      <p v-for="bonus in itemData.bonusesList" :key="bonus" class="bonuses__bonus">{{ bonus }}</p>
    </section>
  </aside>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

const Props = Vue.extend({
  props: {
    itemData: Object
  }
})

@Component
export default class GearItemTooltip extends Props {
  wow = wow
}
</script>
