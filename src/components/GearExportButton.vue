<template>
  <div>
    <b-button class="btn">
      <font-awesome-layers>
        <!--<font-awesome-icon icon="tshirt" transform="up-3 left-4" size="lg" />-->
        <font-awesome-icon icon="file-export" transform="up-4 left-2" size="lg" style="color: white;" />
        <font-awesome-layers-text class="gray8" transform="down-11 shrink-5" value="Export" />
      </font-awesome-layers>
    </b-button>
  </div>
</template>

<style scoped>
.btn {
  background-color: dimgrey;
  border-color: transparent;
  color: #fff;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

const GearExportButtonProps = Vue.extend({
  props: {
    options: Object
  }
})

@Component
export default class GearExportButton extends GearExportButtonProps {}
</script>
