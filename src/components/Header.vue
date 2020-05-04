<template>
  <section class="section has-background-black-ter is-paddingless">
    <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">DPS</p>
          <p class="title">{{ dps }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Spell Hit Weight</p>
          <p class="title">{{ spellHitWeight }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Spell Crit Weight</p>
          <p class="title">{{ spellCritWeight }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Int Weight</p>
          <p class="title">{{ intWeight }}</p>
        </div>
      </div>
    </nav>
  </section>
</template>

<style scoped>
.level-item {
  color: white;
}
.title {
  color: white;
}
.no-borders {
  border-left: none;
  border-right: none;
  border-radius: 0px;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

import Cast from '../wow/class/Cast'

const Props = Vue.extend({
  props: {
    data: Cast
  }
})

@Component
export default class Header extends Props {
  wow = wow

  get dps() {
    let val = this.data.dps.effective.avg
    if (this.data.spell.isInsectSwarm || this.data.spell.isHurricane) {
      val = this.data.periodicDPS.effective.dps
    }
    return `${wow.Tools.RoundedString(val, 2)}`
  }

  get spellHitWeight() {
    if (this.data.spell.isInsectSwarm || this.data.spell.isHurricane) {
      return `N/A`
    }
    return `${wow.Tools.RoundedString(this.data.spellHitWeight, 2)}`
  }

  get spellCritWeight() {
    if (this.data.spell.isInsectSwarm || this.data.spell.isHurricane) {
      return `N/A`
    }
    return `${wow.Tools.RoundedString(this.data.spellCritWeight, 2)}`
  }

  get intWeight() {
    if (this.data.spell.isInsectSwarm || this.data.spell.isHurricane) {
      return `N/A`
    }

    return `${wow.Tools.RoundedString(this.data.intWeight, 3)} (${wow.Tools.RoundedString(1 / this.data.intWeight, 2)})`
  }
}
</script>
