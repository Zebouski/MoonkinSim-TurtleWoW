<template>
  <div class="content">
    <div class="columns is-mobile">
      <div class="column">
        <b-field label="Level" label-position="on-border">
          <b-select class="is-size-7-mobile" expanded v-model.number="options.target.level">
            <option value="63">63</option>
            <option value="62">62</option>
            <option value="61">61</option>
            <option value="60">60</option>
          </b-select>
        </b-field>
        <b-field label="Type" label-position="on-border">
          <b-select class="is-size-7-mobile" expanded v-model.number="options.target.type">
            <option value="1">Beast</option>
            <option value="2">Demon</option>
            <option value="4">Dragonkin</option>
            <option value="8">Elemental</option>
            <option value="16">Giant</option>
            <option value="32">Humanoid</option>
            <option value="64">Mechanical</option>
            <option value="128">Undead</option>
          </b-select>
        </b-field>
        <b-field label="Shimmer" label-position="on-border">
          <b-select class="is-size-7-mobile" expanded v-model.number="options.target.shimmer">
            <option value="0">None</option>
            <option value="1">Arcane</option>
            <option value="2">Fire</option>
            <option value="3">Frost</option>
            <option value="4">Nature</option>
            <option value="5">Shadow</option>
            <option value="6">Holy</option>
          </b-select>
        </b-field>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="StormStrike" v-model="options.target.debuffs">
            Storm Strike
          </b-checkbox>
        </div>
      </div>
      <div class="column">
        <b-field label="Resistance" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.target.spellResistance" />
        </b-field>
        <b-field label="Thunderfury" label-position="on-border">
          <b-select class="is-size-7-mobile" expanded v-model.number="options.target.thunderfury">
            <option value="0">None</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </b-select>
        </b-field>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="CurseOfShadow" v-model="options.target.debuffs">
            Curse of Shadow
          </b-checkbox>
        </div>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="SpellVulnerability" v-model="options.target.debuffs">
            Spell Vulnerability
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

const Props = Vue.extend({
  props: {
    options: Object
  }
})

@Component
export default class Target extends Props {
  wow = wow
}
</script>
