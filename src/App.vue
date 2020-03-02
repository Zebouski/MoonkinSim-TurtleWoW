<template>
  <div id="app">
    <MoonkinCalc />
    <!-- <GearPlayground /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MoonkinCalc from './components/MoonkinCalc.vue'
import GearPlayground from './components/GearPlayground.vue'

@Component({
  components: {
    MoonkinCalc,
    GearPlayground
  }
})
export default class App extends Vue {}
</script>
