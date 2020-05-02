<template>
  <div class="content">
    <div class="columns is-mobile">
      <div class="column">
        <b-field label="Spell Name" label-position="on-border">
          <b-select class="is-size-7-mobile" expanded v-model="options.spellName">
            <option v-for="name in spellList" :key="name" v-bind:value="name">
              {{ name }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Phase" label-position="on-border">
          <b-select
            class="is-size-7-mobile"
            expanded
            v-model="options.phase"
            @input="$emit('change-phase', options.phase)"
          >
            <option v-for="phase in phaseList" :key="phase" v-bind:value="phase">
              {{ phase }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Encounter Length" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.encounterLength" />
        </b-field>
      </div>
      <div class="column">
        <b-field label="Race" label-position="on-border">
          <b-select class="is-size-7-mobile" expanded v-model.number="options.character.race">
            <option value="6">Tauren</option>
            <option value="4">Night-elf</option>
          </b-select>
        </b-field>
        <b-field label="PvP Rank" label-position="on-border">
          <b-select class="is-size-7-mobile" expanded v-model="options.character.pvpRank">
            <option v-for="rank in pvpRankList" :key="rank" v-bind:value="rank">
              {{ rank }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Cast Time Penalty" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.castTimePenalty" />
        </b-field>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        <div class="field">
          <b-checkbox class="is-size-7-mobile" v-model="options.raids">
            Include Raids
          </b-checkbox>
        </div>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" v-model="options.randomEnchants">
            Include random enchants
          </b-checkbox>
        </div>
        <!--
        <div class="field">
          <b-checkbox class="is-size-7-mobile" v-model="options.onUseItems">
            Optimize for On Use items
          </b-checkbox>
        </div>
        -->
      </div>
      <div class="column">
        <div class="field">
          <b-checkbox class="is-size-7-mobile" v-model="options.worldBosses">
            Include World Bosses
          </b-checkbox>
        </div>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" v-model="options.tailoring">
            300 Tailoring
          </b-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

import Query from '../wow/class/Query'

const Props = Vue.extend({
  props: {
    options: Object
  }
})

@Component
export default class General extends Props {
  wow = wow

  get spellList() {
    let spellNames: string[] = []

    let spells = Query.Spells({ phase: this.options.phase })
    for (let spell of spells) {
      spellNames.push(spell.name)
    }

    return spellNames
  }

  get phaseList() {
    return [1, 2, 3, 4, 5, 6]
  }

  get pvpRankList() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  }
  get sliderType() {
    if (this.options.encounterLength < 120) {
      return 'is-success'
    } else if (this.options.encounterLength >= 120 && this.options.encounterLength < 300) {
      return 'is-warning'
    }
    return 'is-danger'
  }
}
</script>
