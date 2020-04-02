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
    let main: number = Number(this.data.dps.effective.avg.toFixed(0))
    if (this.data.spell.isInsectSwarm || this.data.spell.isHurricane) {
      main = Number(this.data.periodicDPS.effective.dps.toFixed(2))
    }
    return `${main}`
  }

  get spellHitWeight() {
    let main: number = Number(this.data.spellHitWeight.toFixed(1))
    if (this.data.spell.isInsectSwarm || this.data.spell.isHurricane) {
      return `N/A`
    }
    return `${main}`
  }

  get spellCritWeight() {
    let main: number = Number(this.data.spellCritWeight.toFixed(1))
    if (this.data.spell.isInsectSwarm || this.data.spell.isHurricane) {
      return `N/A`
    }
    return `${main}`
  }

  get intWeight() {
    let main: number = Number(Number(this.data.intWeight).toFixed(3))
    let rev: number = Number((1 / main).toFixed(0))
    if (this.data.spell.isInsectSwarm || this.data.spell.isHurricane) {
      return `N/A`
    }
    return `${main} (${rev})`
  }
}
</script>
