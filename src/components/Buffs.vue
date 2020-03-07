<template>
  <div class="content">
    <div class="columns is-mobile">
      <div class="column">
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="PowerInfusion" v-model="options.buffs">
            Power Infusion
          </b-checkbox>
        </div>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="FlaskOfSupremePower" v-model="options.buffs">
            Flask of Supreme Power
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="CerebralCortexCompound" v-model="options.buffs">
            Cerebral Cortex Compound
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="ArcaneBrilliance" v-model="options.buffs">
            Arcane Brilliance
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="ImprovedGiftOfTheWild" v-model="options.buffs">
            Improved Gift of the Wild
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="SlipkiksSavvy" v-model="options.buffs">
            Slip'kik's Saavy
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="MoonkinAura" v-model="options.buffs">
            Moonkin Aura
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="SaygesDarkFortune" v-model="options.buffs">
            Sayge's Dark Fortune
          </b-checkbox>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="EphemeralPower" v-model="options.buffs">
            Ephemeral Power
          </b-checkbox>
        </div>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="GreaterArcaneElixir" v-model="options.buffs">
            Greater Arcane Elixir
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="RunnTumTuberSurprise" v-model="options.buffs">
            Runn Tum Tuber Surprise
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="BlessingOfKings" v-model="options.buffs">
            Blessing of Kings
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="RallyingCryOfTheDragonSlayer" v-model="options.buffs">
            Rallying Cry of the Dragon Slayer
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="SongflowerSerenade" v-model="options.buffs">
            Songflower Serenade
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="TracesOfSilithyst" v-model="options.buffs">
            Traces of Silithyst
          </b-checkbox>
        </div>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="BurningAdrenaline" v-model="options.buffs">
            Burning Adrenaline
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
export default class Buffs extends Props {
  wow = wow
}
</script>
