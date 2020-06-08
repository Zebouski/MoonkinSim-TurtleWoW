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
              <b-tabs class="block">
                <b-tab-item label="Gear">
                  <Gear :options="options" :encounter="encounter" />
                </b-tab-item>
                <b-tab-item label="Damage">
                  <div class="tile">
                    <article
                      class="tile is-child box has-background-black-ter has-text-white"
                      style="border-width: 0px; align-items: center;"
                    >
                      <SpellTooltip :data="encounter.spellCast" />
                    </article>
                  </div>
                  <hr style="height: 1px; background-color: #4a4a4a;" />
                  <Damage :data="encounter.spellCast" />
                </b-tab-item>
                <b-tab-item label="Stats">
                  <div class="tile is-vertical">
                    <div class="tile">
                      <div class="tile is-5">
                        <article
                          style="border-width: 0px;"
                          class="tile is-child box has-background-black-ter has-text-white"
                        >
                          <AttributesGeneral :data="encounter.spellCast" />
                        </article>
                      </div>
                      <div class="tile">
                        <article
                          style="border-width: 0px;"
                          class="tile is-child box has-background-black-ter has-text-white"
                        >
                          <AttributesSpell :data="encounter.spellCast" />
                        </article>
                      </div>
                    </div>
                  </div>
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
    let gearv1 = wow.Tools.optionFromURL('gear')
    let gearv2 = wow.Tools.optionFromURL('gearv2')

    if (gearv2) {
      this.options.character.lockedItems = gearv2.items
      this.options.character.lockedEnchants = gearv2.enchants
    } else if (gearv1) {
      this.options.character.lockedItems = gearv1.items
    }

    /* other options*/
    let phase = wow.Tools.optionFromURL('phase')
    if (phase !== null && phase !== undefined) {
      this.options.phase = phase
    }

    let raids = wow.Tools.optionFromURL('raids')
    if (raids !== null && raids !== undefined) {
      this.options.raids = raids
    }

    let worldbosses = wow.Tools.optionFromURL('worldbosses')
    if (worldbosses !== null && worldbosses !== undefined) {
      this.options.worldBosses = worldbosses
    }

    let randomenchants = wow.Tools.optionFromURL('randomenchants')
    if (randomenchants !== null && randomenchants !== undefined) {
      this.options.randomEnchants = randomenchants
    }

    let tailoring = wow.Tools.optionFromURL('tailoring')
    if (tailoring !== null && tailoring !== undefined) {
      this.options.tailoring = tailoring
    }

    let pvprank = wow.Tools.optionFromURL('pvprank')
    if (pvprank !== null && pvprank !== undefined) {
      this.options.character.pvpRank = pvprank
    }
  }

  get encounter() {
    return new wow.Encounter(this.options)
  }

  get debugObj() {
    /*
    return {
      enchants: wow.Query.Enchants({
        slot: wow.ItemSlot.Head,
        phase: this.options.phase
      }),
      items: wow.Query.Items({
        slot: wow.ItemSlot.Head,
        phase: this.options.phase,
        faction: this.options.faction,
        pvpRank: this.options.pvpRank,
        worldBosses: false,
        raids: this.options.raids,
        randomEnchants: this.options.randomEnchants
      })
    }
    */
    return {
      spellCast: this.encounter.spellCast
    }
  }
}
</script>
