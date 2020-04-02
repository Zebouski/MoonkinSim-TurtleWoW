<template>
  <section class="section has-background-black-ter is-paddingless">
    <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">DPS</p>
          <p class="title">{{ data.dps.effective.avg.toFixed(0) }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Spell Hit Weight</p>
          <p class="title">{{ data.spellHitWeight.toFixed(1) }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Spell Crit Weight</p>
          <p class="title">{{ data.spellCritWeight.toFixed(1) }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Int Weight</p>
          <p class="title">{{ Number(data.intWeight).toFixed(3) }} ({{ (1 / data.intWeight).toFixed(0) }})</p>
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

const Props = Vue.extend({
  props: {
    data: Object
  }
})

@Component
export default class Header extends Props {
  wow = wow
}
</script>
