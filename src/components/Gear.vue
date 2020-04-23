<template>
  <div>
    <div class="gear">
      <div class="gear-left">
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Head" :itemData="encounter.equipment.head" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Neck" :itemData="encounter.equipment.neck" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Shoulder" :itemData="encounter.equipment.shoulder" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Back" :itemData="encounter.equipment.back" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Chest" :itemData="encounter.equipment.chest" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Wrist" :itemData="encounter.equipment.wrist" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Mainhand" :itemData="encounter.equipment.mainhand" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Offhand" :itemData="encounter.equipment.offhand" />
      </div>
      <div class="gear-center"></div>
      <div class="gear-right">
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Hands" :itemData="encounter.equipment.hands" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Waist" :itemData="encounter.equipment.waist" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Legs" :itemData="encounter.equipment.legs" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Feet" :itemData="encounter.equipment.feet" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Finger" :itemData="encounter.equipment.finger" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Finger2" :itemData="encounter.equipment.finger2" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Trinket" :itemData="encounter.equipment.trinket" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Trinket2" :itemData="encounter.equipment.trinket2" />
      </div>
    </div>

    <GearButtonBar
      :options="{ showShare: true, showUnlock: true, showUnequip: true }"
      @share-gear="shareGear"
      @unlock-gear="unlockGear"
      @unequip-gear="unequipGear"
    />
    <div class="publicLinkModal">
      <b-modal :active.sync="showPublicLinkModal" scroll="keep">
        <p>Copy the link below to share this gear set</p>
        <div class="content">
          <b-field>
            <input class="input is-size-7-mobile" size="50" v-model="publicLink" />
          </b-field>
        </div>
      </b-modal>
    </div>
    <GearItemSelect :options="options" :encounter="encounter" />
    <GearEnchantSelect :options="options" :encounter="encounter" />
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
}

.gear-right {
  max-width: calc(50% - 0.625rem);
  overflow: hidden;
}

.gear-center {
  flex-grow: 1;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'
import GearItem from './GearItem.vue'
import GearItemSelect from './GearItemSelect.vue'
import GearEnchantSelect from './GearEnchantSelect.vue'
import GearButtonBar from './GearButtonBar.vue'
import ItemSlot from '../wow/enum/ItemSlot'

const GearProps = Vue.extend({
  props: {
    options: Object,
    encounter: Object
  }
})

@Component({
  components: { GearButtonBar, GearItem, GearItemSelect, GearEnchantSelect }
})
export default class Gear extends GearProps {
  wow = wow
  showPublicLinkModal = false
  paginated = true

  shareGear() {
    this.showPublicLinkModal = true
  }

  unlockGear() {
    wow.Locked.UnlockItems(this.options.character.lockedItems)
    wow.Locked.UnlockEnchants(this.options.character.lockedEnchants)
  }

  unequipGear() {
    wow.Locked.UnequipItems(this.options.character.lockedItems)
    wow.Locked.UnequipEnchants(this.options.character.lockedEnchants)
  }

  get publicLink() {
    return wow.Tools.publicUrl(this.encounter.equipment)
  }
}
</script>
