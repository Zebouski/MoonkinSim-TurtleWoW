<template>
  <div class="container is-fluid">
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>
            <span class="is-size-7 has-text-warning">
              Direct ({{ (data.spell.coefficient.direct * 100).toFixed(2) }}%)
            </span>
          </th>
          <th>
            <span class="is-size-7 has-text-white">Normal</span>
          </th>
          <th>
            <span class="is-size-7 has-text-white">Crit</span>
          </th>
          <th>
            <span class="is-size-7 has-text-white">DPS</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <b-tooltip v-bind:label="tooltipBase" multilined>
              <span class="is-size-7 has-text-weight-bold">Base</span>
            </b-tooltip>
          </td>
          <td>
            <span class="is-size-7 is-italic">{{ data.normalDmg.base.text }}</span>
          </td>
          <td>
            <span class="is-size-7 is-italic">{{ data.critDmg.base.text }}</span>
          </td>
          <td>
            <span class="is-size-7 is-italic">{{ data.dps.base.text }}</span>
          </td>
        </tr>
        <tr>
          <td>
            <b-tooltip v-bind:label="tooltipActual" multilined>
              <span class="is-size-7 has-text-weight-bold">Actual</span>
            </b-tooltip>
          </td>
          <td>
            <span class="is-size-7 is-italic">{{ data.normalDmg.actual.text }}</span>
          </td>
          <td>
            <span class="is-size-7 is-italic">{{ data.critDmg.actual.text }}</span>
          </td>
          <td>
            <span class="is-size-7 is-italic">{{ data.dps.actual.text }}</span>
          </td>
        </tr>
        <tr>
          <td>
            <b-tooltip v-bind:label="tooltipEffective" multilined>
              <span class="is-size-7 has-text-weight-bold">Effective</span>
            </b-tooltip>
          </td>
          <td>
            <span class="is-size-7 is-italic">{{ data.normalDmg.effective.text }}</span>
          </td>
          <td>
            <span class="is-size-7 is-italic">{{ data.critDmg.effective.text }}</span>
          </td>
          <td>
            <span class="is-size-7 is-italic has-text-success has-text-weight-bold">{{ data.dps.effective.text }}</span>
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th>
            <span class="is-size-7 has-text-warning">
              Periodic ({{ (data.spell.coefficient.periodic * 100).toFixed(2) }}%)
            </span>
          </th>
          <th>
            <span class="is-size-7 has-text-weight-bold has-text-white">Tick</span>
          </th>
          <th>
            <span class="is-size-7 has-text-weight-bold has-text-white">Total</span>
          </th>
          <th>
            <span class="is-size-7 has-text-weight-bold has-text-white">DPS</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <b-tooltip v-bind:label="tooltipBase" multilined>
              <span class="is-size-7 has-text-weight-bold">Base</span>
            </b-tooltip>
          </td>
          <td>
            <span class="is-size-7 is-italic">
              {{ data.periodicDmg.base.tickText }}
            </span>
          </td>
          <td>
            <span class="is-size-7 is-italic">
              {{ data.periodicDmg.base.totalText }}
            </span>
          </td>
          <td>
            <span class="is-size-7 is-italic">
              {{ data.periodicDPS.base.text }}
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <b-tooltip v-bind:label="tooltipActual" multilined>
              <span class="is-size-7 has-text-weight-bold">Actual</span>
            </b-tooltip>
          </td>
          <td>
            <span class="is-size-7 is-italic">
              {{ data.periodicDmg.actual.tickText }}
            </span>
          </td>
          <td>
            <span class="is-size-7 is-italic">
              {{ data.periodicDmg.actual.totalText }}
            </span>
          </td>
          <td>
            <span class="is-size-7 is-italic">
              {{ data.periodicDPS.actual.text }}
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <b-tooltip v-bind:label="tooltipEffective" multilined>
              <span class="is-size-7 has-text-weight-bold">Effective</span>
            </b-tooltip>
          </td>
          <td>
            <span class="is-size-7 is-italic">
              {{ data.periodicDmg.effective.tickText }}
            </span>
          </td>
          <td>
            <span class="is-size-7 is-italic">
              {{ data.periodicDmg.effective.totalText }}
            </span>
          </td>
          <td>
            <span class="is-size-7 is-italic has-text-success has-text-weight-bold">
              {{ data.periodicDPS.effective.text }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
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
export default class Damage extends Props {
  wow = wow

  tooltipBase =
    'Base damage is the spells damage including talents that modify the base, such as Moonfury. This is the damage listed in the in-game spellbook.'
  tooltipActual = 'Actual damage is base damage plus (spellpower * spell coefficient)'
  tooltipEffective = 'Effective damage is actual damage plus multipliers from buffs, debuffs, and partial resists'
}
</script>
