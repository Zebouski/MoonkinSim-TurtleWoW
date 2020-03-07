<template>
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
    gearData: Object
  }
})

@Component({
  components: { GearItem }
})
export default class Gear extends GearProps {
  wow = wow
}
</script>
