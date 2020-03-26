<template>
  <div>
    <div class="gear">
      <div class="gear-left">
        <GearItem :itemSlot="wow.ItemSlot.Head" :itemData="gearData.head" />
        <GearItem :itemSlot="wow.ItemSlot.Neck" :itemData="gearData.neck" />
        <GearItem :itemSlot="wow.ItemSlot.Shoulder" :itemData="gearData.shoulders" />
        <GearItem :itemSlot="wow.ItemSlot.Back" :itemData="gearData.back" />
        <GearItem :itemSlot="wow.ItemSlot.Chest" :itemData="gearData.chest" />
        <GearItem :itemSlot="wow.ItemSlot.Wrist" :itemData="gearData.wrists" />
        <GearItem :itemSlot="wow.ItemSlot.Mainhand" :itemData="gearData.mainhand" />
        <GearItem :itemSlot="wow.ItemSlot.Offhand" :itemData="gearData.offhand" />
      </div>
      <div class="gear-center"></div>
      <div class="gear-right">
        <GearItem :itemSlot="wow.ItemSlot.Hands" :itemData="gearData.hands" />
        <GearItem :itemSlot="wow.ItemSlot.Waist" :itemData="gearData.waist" />
        <GearItem :itemSlot="wow.ItemSlot.Legs" :itemData="gearData.legs" />
        <GearItem :itemSlot="wow.ItemSlot.Feet" :itemData="gearData.feet" />
        <GearItem :itemSlot="wow.ItemSlot.Finger" :itemData="gearData.finger1" />
        <GearItem :itemSlot="wow.ItemSlot.Finger2" :itemData="gearData.finger2" />
        <GearItem :itemSlot="wow.ItemSlot.Trinket" :itemData="gearData.trinket1" />
        <GearItem :itemSlot="wow.ItemSlot.Trinket2" :itemData="gearData.trinket2" />
      </div>
    </div>
    <div class="columns is-centered is-vcentered is-mobile">
      <div class="column is-narrow">
        <b-field label="PvP" label-position="on-border">
          <b-select class="is-size-7-mobile" v-model="options.character.pvpRank">
            <option v-for="rank in pvpRankList" :key="rank" v-bind:value="rank">
              {{ rank }}
            </option>
          </b-select>
        </b-field>
      </div>
      <!--
      <div class="column is-narrow">
        <b-field label="Fight Length" label-position="on-border">
          <input class="input is-size-7-mobile" type="number" v-model.number="options.combatLength" />
        </b-field>
      </div>
      -->
    </div>
    <div class="columns is-centered is-vcentered is-mobile">
      <div class="column is-narrow">
        <div class="field">
          <b-checkbox class="is-size-7-mobile" v-model="options.raids">
            Raids
          </b-checkbox>
        </div>
      </div>
      <div class="column is-narrow">
        <div class="field">
          <b-checkbox class="is-size-7-mobile" v-model="options.tailoring">
            Tailoring
          </b-checkbox>
        </div>
      </div>
      <div class="column is-narrow">
        <div class="field">
          <b-checkbox class="is-size-7-mobile" v-model="options.worldBosses">
            World Bosses
          </b-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gear {
  position: relative;
  display: flex;
  padding: 1.25rem;
}

.gear-left {
  max-width: calc(50% - 0.625rem);
  overflow: hidden;
  transition: opacity 0.2s;
}

.gear-right {
  max-width: calc(50% - 0.625rem);
  overflow: hidden;
  transition: opacity 0.2s;
}

.gear-center {
  flex-grow: 1;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'
import GearItem from './GearItem.vue'

const GearProps = Vue.extend({
  props: {
    options: Object,
    gearData: Object
  }
})

@Component({
  components: { GearItem }
})
export default class Gear extends GearProps {
  wow = wow

  get sliderType() {
    if (this.options.combatLength < 120) {
      return 'is-success'
    } else if (this.options.combatLength >= 120 && this.options.combatLength < 300) {
      return 'is-warning'
    }
    return 'is-danger'
  }

  get pvpRankList() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  }
}
</script>
