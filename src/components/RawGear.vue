<template>
  <div class="content">
    <div class="columns is-mobile">
      <div class="column">
        <b-field label="Spell Dmg" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="data.spellDamage" />
        </b-field>
        <b-field label="Nature Dmg" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="data.natureDamage" />
        </b-field>

        <b-field label="Spell Crit" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="data.spellCrit" />
        </b-field>
      </div>
      <div class="column">
        <b-field label="Arcane Dmg" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="data.arcaneDamage" />
        </b-field>
        <b-field label="Spell Hit" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="data.spellHit" />
        </b-field>
        <b-field label="Intellect" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="data.intellect" />
        </b-field>
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
export default class RawGear extends Props {
  wow = wow
}
</script>
