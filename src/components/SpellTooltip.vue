<template>
  <div>
    <div class="columns">
      <div class="column is-narrow spellColumn">
        <div class="image-wrapper">
          <figure class="image is-64x64">
            <img class="wow-spell__icon" :src="data.spell.iconFullPath" />
          </figure>
        </div>
      </div>
      <div class="column spellColumn">
        <aside class="wow-spell">
          <header class="wow-spell__header">
            <p class="header__name">{{ data.spell.baseName }}</p>
            <p class="header__rank">Rank {{ data.spell.rank }}</p>
          </header>
          <section class="wow-spell__type">
            <p class="type__slot">{{ data.spell.manaCost }} Mana</p>
            <p class="type__item">{{ data.spell.range }} yd range</p>
          </section>
          <section class="wow-spell__type">
            <p class="type__slot">{{ effectiveCastTime }}</p>
            <p class="type__item">{{ baseCastTime }}</p>
          </section>
          <section class="wow-spell__type">
            <p v-if="showHit" class="type__slot">{{ chanceToHit }}</p>
            <p v-if="showCrit" class="type__item">{{ chanceToCrit }}</p>
          </section>
          <section class="wow-spell__stats">
            <div class="stats__list">
              <p v-if="showPartialResist" class="stats_list-item">
                Partial Resist Penalty: {{ (Number(data.partialResistPenalty).toFixed(3) * 100).toFixed(2) }}%
              </p>
            </div>
          </section>
          <section class="wow-spell__footer">
            <p class="footer__text">{{ description }}</p>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spellColumn {
  padding: 0.15rem;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

const Props = Vue.extend({
  props: {
    data: Object
  }
})

@Component
export default class AttributesGeneral extends Props {
  wow = wow

  get showPartialResist() {
    return this.data.spell.canPartialResist
  }

  get showHit() {
    return this.data.spell.canMiss
  }

  get showCrit() {
    return this.data.spell.canCrit
  }

  get description() {
    let school = this.data.spell.magicSchoolText
    let minDmg = this.data.normalDmg.effective.min.toFixed(0)
    let maxDmg = this.data.normalDmg.effective.max.toFixed(0)
    let tickDmg = this.data.periodicDmg.effective.tick.toFixed(0)
    let directText = `${minDmg} to ${maxDmg} ${school} damage`
    let periodicText = `${this.data.periodicDmg.effective.total.toFixed(0)} ${school} damage over ${
      this.data.spell.duration
    } sec`

    switch (this.data.spell.baseName.toUpperCase()) {
      case 'HURRICANE':
        return `Creates a violent storm in the target area causing ${tickDmg} Nature damage to enemies every 1 sec, and increasing the time between attacks by 25%.  Lasts 10 sec.  Druid must channel to maintain the spell.`
      case 'INSECT SWARM':
        return `The enemy target is swarmed by insects, decreasing their chance to hit with melee and ranged attacks by 5% and causing ${periodicText}.`
      case 'MOONFIRE':
        return `Burns the enemy for ${directText} and then an additional ${periodicText}.`
      default:
        return `Causes ${directText} to the target.`
    }
  }

  get effectiveCastTime() {
    switch (this.data.spell.baseName.toUpperCase()) {
      case 'HURRICANE':
        return `Channeled (10 sec cast)`
      case 'MOONFIRE':
      case 'INSECT SWARM':
        return `Instant`
      default:
        return `${this.data.effectiveCastTime.toFixed(2)} sec cast`
    }
  }

  get baseCastTime() {
    switch (this.data.spell.baseName.toUpperCase()) {
      case 'HURRICANE':
        return `1 min cooldown`
      case 'MOONFIRE':
      case 'INSECT SWARM':
        return ``
      default:
        return `${this.data.spell.castTime} sec base`
    }
  }
  get chanceToHit() {
    return `Hit: ${Number(this.data.chanceToHit).toFixed(2)}%`
  }

  get chanceToMiss() {
    return `Miss: ${Number(this.data.chanceToMiss).toFixed(0)}%`
  }

  get chanceToCrit() {
    return `Crit: ${Number(this.data.chanceToCrit).toFixed(2)}%`
  }
}
</script>
