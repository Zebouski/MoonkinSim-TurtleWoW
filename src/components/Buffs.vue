<template>
  <div class="content">
    <div class="columns is-mobile">
      <div class="column">
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="PowerInfusion" v-model="options.character.buffs">
            Power Infusion
          </b-checkbox>
        </div>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="FlaskOfSupremePower" v-model="options.character.buffs">
            Flask of Supreme Power
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="CerebralCortexCompound" v-model="options.character.buffs">
            Cerebral Cortex Compound
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="ArcaneBrilliance" v-model="options.character.buffs">
            Arcane Brilliance
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="ImprovedGiftOfTheWild" v-model="options.character.buffs">
            Improved Gift of the Wild
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="SlipkiksSavvy" v-model="options.character.buffs">
            Slip'kik's Saavy
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="MoonkinAura" v-model="options.character.buffs">
            Moonkin Aura
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="SaygesDarkFortune" v-model="options.character.buffs">
            Sayge's Dark Fortune
          </b-checkbox>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="GreaterArcaneElixir" v-model="options.character.buffs">
            Greater Arcane Elixir
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="RunnTumTuberSurprise" v-model="options.character.buffs">
            Runn Tum Tuber Surprise
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="BlessingOfKings" v-model="options.character.buffs">
            Blessing of Kings
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox
            class="is-size-7-mobile"
            native-value="RallyingCryOfTheDragonSlayer"
            v-model="options.character.buffs"
          >
            Rallying Cry of the Dragon Slayer
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="SongflowerSerenade" v-model="options.character.buffs">
            Songflower Serenade
          </b-checkbox>
        </div>

        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="TracesOfSilithyst" v-model="options.character.buffs">
            Traces of Silithyst
          </b-checkbox>
        </div>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="BurningAdrenaline" v-model="options.character.buffs">
            Burning Adrenaline
          </b-checkbox>
        </div>
        <div class="field">
          <b-checkbox class="is-size-7-mobile" native-value="SpiritOfZandalar" v-model="options.character.buffs">
            Spirit of Zandalar
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
