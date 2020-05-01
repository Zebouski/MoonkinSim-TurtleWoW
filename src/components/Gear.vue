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
      :options="{ showExport: true, showShare: true, showUnlock: true, showUnequip: true }"
      @share-gear="shareGear"
      @unlock-gear="unlockGear"
      @unequip-gear="unequipGear"
      @export-gear="exportGear"
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
    <div class="exportModal">
      <b-modal :active.sync="showExportModal" scroll="keep">
        <div class="container">
          <b-message type="is-info">
            <h1 class="title">Export to ClassicSim</h1>

            <ol type="1">
              <li>
                Download and extract the latest <a href="https://classicsim.org/?C=M;O=D" target="_blank">ClassicSim</a>
              </li>
              <li><a href="#" @click="downloadExport">Download the exported settings zipfile</a></li>
              <li>Extract zipfile in the root directory of classicsim (Backup 'Saves' first)</li>
              <li>Launch ClassicSim, Select 'Starfire' in 'Rotations' and click 'Run Full Sim'</li>
            </ol>
          </b-message>
          <b-message type="is-warning" has-icon>
            <p>This is an experimental feature. Not all gear and options are supported yet.</p>
            <p>NOTE: Due to a bug in classicsim you'll need to select the rotation each time you open it.</p>
          </b-message>
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
  showExportModal = false
  paginated = true

  shareGear() {
    this.showPublicLinkModal = true
  }

  downloadExport() {
    wow.ClassicSim.ExportGear(this.options, this.encounter.equipment)
  }

  exportGear() {
    this.showExportModal = true
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
