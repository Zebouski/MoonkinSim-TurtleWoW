<template>
  <div class="content">
    <div class="columns is-mobile">
      <div class="column">
        <b-field label="Moonfury" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.talents.moonFuryRank" />
        </b-field>

        <b-field label="Vengeance" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.talents.vengeanceRank" />
        </b-field>

        <b-field label="Imp. Wrath" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.talents.improvedWrathRank" />
        </b-field>
      </div>
      <div class="column">
        <b-field label="Imp. Starfire" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.talents.improvedStarfireRank" />
        </b-field>
        <b-field label="Natures Grace" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.talents.naturesGraceRank" />
        </b-field>
        <b-field label="Imp. Moonfire" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.talents.improvedMoonfireRank" />
        </b-field>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

const Props = Vue.extend({
  props: {
    options: Object
  }
})

@Component
export default class Talents extends Props {}
</script>
