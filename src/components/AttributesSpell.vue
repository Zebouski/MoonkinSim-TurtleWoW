<template>
  <div class="content">
    <div class="columns is-mobile">
      <div class="column">
        <p class="is-size-7-mobile">Spell Hit</p>
        <p class="is-size-7-mobile">Spell Crit</p>
        <p class="is-size-7-mobile">Spell Pen</p>
        <p class="is-size-7-mobile">Spell Damage</p>
        <p class="is-size-7-mobile">Arcane Damage</p>
        <p class="is-size-7-mobile">Nature Damage</p>
      </div>
      <div class="column">
        <p class="is-size-7-mobile has-text-right">{{ data.character.spellHit }}</p>
        <p class="is-size-7-mobile has-text-right">{{ data.character.spellCrit.toFixed(2) }}</p>
        <p class="is-size-7-mobile has-text-right">{{ data.spellPenetration }}</p>

        <p class="is-size-7-mobile has-text-right">
          <b-tooltip v-bind:label="spellDamageTooltip" multilined>{{ data.effectiveSpellDamage }}</b-tooltip>
        </p>

        <p class="is-size-7-mobile has-text-right">
          <b-tooltip v-bind:label="arcaneDamageTooltip" multilined>{{
            data.character.arcaneDamage + data.character.spellDamage + data.spellDamageBonus
          }}</b-tooltip>
        </p>

        <p class="is-size-7-mobile has-text-right">
          <b-tooltip v-bind:label="natureDamageTooltip" multilined>{{
            data.character.natureDamage + data.character.spellDamage + data.spellDamageBonus
          }}</b-tooltip>
        </p>
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

  get spellDamageTooltip() {
    return `${this.data.effectiveSpellDamage} (${this.data.actualSpellDamage} + ${this.data.spellDamageBonus})`
  }

  get arcaneDamageTooltip() {
    return `${this.data.effectiveSpellDamage} (${this.data.character.arcaneDamage} + ${this.data.character.spellDamage} + ${this.data.spellDamageBonus})`
  }

  get natureDamageTooltip() {
    return `${this.data.effectiveSpellDamage} (${this.data.character.natureDamage} + ${this.data.character.spellDamage} + ${this.data.spellDamageBonus})`
  }
}
</script>
