<template>
  <div class="links">
    <div class="columns is-centered is-mobile">
      <div v-if="options.showUnlock" class="column is-narrow">
        <GearUnlockButton v-on:click.native="$emit('unlock-gear')" />
      </div>
      <div v-if="options.showUnequip" class="column is-narrow">
        <GearUnequipButton v-on:click.native="$emit('unequip-gear')" />
      </div>
      <div v-if="options.showShare" class="column is-narrow">
        <GearShareButton v-on:click.native="$emit('share-gear')" />
      </div>
      <div v-if="options.showExport" class="column is-narrow">
        <GearExportButton v-on:click.native="$emit('export-gear')" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GearUnlockButton from './GearUnlockButton.vue'
import GearUnequipButton from './GearUnequipButton.vue'
import GearShareButton from './GearShareButton.vue'
import GearExportButton from './GearExportButton.vue'

const GearButtonBarProps = Vue.extend({
  props: {
    options: Object
  }
})

@Component({
  components: { GearExportButton, GearShareButton, GearUnlockButton, GearUnequipButton }
})
export default class GearButtonBar extends GearButtonBarProps {}
</script>
