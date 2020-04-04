<template>
  <div>
    <Header :data="encounter.spellCast" />
    <section class="section has-background-black-bis">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent is-5">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <b-tabs class="block">
                <b-tab-item label="General">
                  <General :options="options" />
                </b-tab-item>
                <b-tab-item label="Buffs">
                  <Buffs :options="options" />
                </b-tab-item>
                <b-tab-item label="Talents">
                  <Talents :options="options" />
                </b-tab-item>
                <b-tab-item label="Target">
                  <Target :options="options" />
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <Gear :options="options" :encounter="encounter" />
            </article>
          </div>
        </div>
      </div>
    </section>
    <section class="section info has-background-black-bis">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <!-- stats box -->
          <div class="tile is-parent is-5">
            <div class="tile is-vertical">
              <div class="tile">
                <article class="tile is-child box has-background-black-ter has-text-white">
                  <SpellTooltip :data="encounter.spellCast" />
                </article>
              </div>
              <div class="tile">
                <div class="tile is-5">
                  <article class="tile is-child box has-background-black-ter has-text-white">
                    <AttributesGeneral :data="encounter.spellCast" />
                  </article>
                </div>
                <div class="tile">
                  <article class="tile is-child box has-background-black-ter has-text-white">
                    <AttributesSpell :data="encounter.spellCast" />
                  </article>
                </div>
              </div>
            </div>
          </div>

          <!-- damage box -->
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <Damage :data="encounter.spellCast" />
            </article>
          </div>
        </div>
      </div>
    </section>

    <Debug v-bind:class="{ 'is-hidden': !options.debug }" :data="debugObj" />
  </div>
</template>

<style scoped>
.info {
  padding-top: 0;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

import Header from './Header.vue'

import SpellTooltip from './SpellTooltip.vue'
import AttributesGeneral from './AttributesGeneral.vue'
import AttributesSpell from './AttributesSpell.vue'
import General from './General.vue'
import Gear from './Gear.vue'
import Talents from './Talents.vue'
import Buffs from './Buffs.vue'
import Target from './Target.vue'
import Damage from './Damage.vue'
import Debug from './Debug.vue'

import PublicLink from '../wow/class/PublicLink'

const Props = Vue.extend({
  props: {
    options: Object
  }
})

@Component({
  components: {
    Header,
    SpellTooltip,
    AttributesGeneral,
    AttributesSpell,
    General,
    Gear,
    Talents,
    Buffs,
    Target,
    Damage,
    Debug
  }
})
export default class Content extends Props {
  mounted() {
    let publicLink = new PublicLink(this.options)

    let lockedItems = publicLink.lockedItemsFromURL
    if (lockedItems) {
      this.options.character.lockedItems = lockedItems
    }
  }

  get encounter() {
    console.log('HELLO ENCOUNTER IS BEING DONE')
    return new wow.Encounter(this.options)
  }

  get debugObj() {
    return {
      options: this.options,
      spellCast: this.encounter.spellCast
    }
  }
}
</script>
