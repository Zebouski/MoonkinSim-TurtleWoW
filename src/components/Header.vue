<template>
  <section class="section has-background-black-ter is-paddingless no-borders">
    <div class="container is-fluid is-marginless">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box has-background-black-ter has-text-white no-borders">
            <div class="content">
              <div class="columns is-centered is-vcentered is-mobile">
                <div class="column"></div>
                <div class="column is-narrow">
                  <b-field label="Spell Name" label-position="on-border">
                    <b-select class="is-size-7-mobile" v-model="options.spellName">
                      <option v-for="name in spellList" :key="name" v-bind:value="name">
                        {{ name }}
                      </option>
                    </b-select>
                  </b-field>
                </div>
                <div class="column is-narrow">
                  <b-field label="Race" label-position="on-border">
                    <b-select class="is-size-7-mobile" v-model.number="options.race">
                      <option value="6">Tauren</option>
                      <option value="4">Night-elf</option>
                    </b-select>
                  </b-field>
                </div>
                <div class="column ">
                  <b-field label="Phase" label-position="on-border">
                    <b-select
                      class="is-size-7-mobile"
                      v-model="options.phase"
                      @input="$emit('change-phase', options.phase)"
                    >
                      <option v-for="phase in phaseList" :key="phase" v-bind:value="phase">
                        {{ phase }}
                      </option>
                    </b-select>
                  </b-field>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
    options: Object
  }
})

@Component
export default class Header extends Props {
  wow = wow

  get spellList() {
    return wow.Database.spellListByPhase(this.options.phase)
  }

  get phaseList() {
    return wow.Database.phaseList()
  }
}
</script>
