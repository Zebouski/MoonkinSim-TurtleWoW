<template>
  <div>
    <section class="section has-background-black-bis">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <b-tabs class="block">
                <b-tab-item label="Gear">
                  <Gear :options="options" :gearData="encounter.spellCast.character.equipment" />
                </b-tab-item>
                <b-tab-item label="Talents">
                  <Talents :options="options" />
                </b-tab-item>
                <b-tab-item label="Buffs">
                  <Buffs :options="options" />
                </b-tab-item>
                <b-tab-item label="Target">
                  <Target :options="options" />
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <b-tabs class="block">
                <b-tab-item label="Summary">
                  <Summary :data="encounter.spellCast" />
                </b-tab-item>
                <b-tab-item label="Damage">
                  <Damage :data="encounter.spellCast" />
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
        </div>
      </div>
    </section>

    <Debug v-bind:class="{ 'is-hidden': !options.debug }" :data="debugObj" />
  </div>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

import Gear from './Gear.vue'
import Talents from './Talents.vue'
import Buffs from './Buffs.vue'
import Target from './Target.vue'
import Summary from './Summary.vue'
import Damage from './Damage.vue'
import Debug from './Debug.vue'

const Props = Vue.extend({
  props: {
    options: Object
  }
})

@Component({
  components: { Gear, Talents, Buffs, Target, Summary, Damage, Debug }
})
export default class Content extends Props {
  get encounter() {
    return new wow.Encounter(this.options)
  }

  get debugObj() {
    return {
      spellCast: this.encounter.spellCast
    }
  }
}
</script>
