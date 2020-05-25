<template>
  <div class="content">
    <div class="columns is-mobile">
      <div class="column">
        <p class="is-size-7-mobile">Health</p>
        <p class="is-size-7-mobile">Mana</p>
        <p class="is-size-7-mobile">Stamina</p>
        <p class="is-size-7-mobile">Intellect</p>
        <p class="is-size-7-mobile">Spirit</p>
        <p class="is-size-7-mobile">Mp5</p>
      </div>
      <div class="column">
        <p class="is-size-7-mobile has-text-right">{{ data.character.health.toFixed(0) }}</p>
        <p class="is-size-7-mobile has-text-right">
          <b-tooltip v-bind:label="manaTooltip" multilined>{{ data.character.mana.toFixed(0) }}</b-tooltip>
        </p>
        <p class="is-size-7-mobile has-text-right">{{ data.character.stamina.toFixed(0) }}</p>
        <p class="is-size-7-mobile has-text-right">{{ data.character.intellect.toFixed(0) }}</p>
        <p class="is-size-7-mobile has-text-right">{{ data.character.spirit.toFixed(0) }}</p>
        <p class="is-size-7-mobile has-text-right">{{ data.character.mp5.toFixed(0) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

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

  get manaTooltip() {
    return (
      `mana while casting = ${this.data.character.manaPerTickCasting} every 2s, ` +
      `mana not casting = ${this.data.character.manaPerTickNotCasting} every 2s, ` +
      `mana from innervate: ${this.data.character.manaPerTickInnervate} every 2s, ` +
      `total mana from innervate: ${this.data.character.manaPerInnervate}\n`
    )
  }
}
</script>
