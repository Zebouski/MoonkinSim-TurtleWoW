<template>
  <div id="app">
    <MoonkinCalc />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MoonkinCalc from './components/MoonkinCalc.vue'

@Component({
  components: {
    MoonkinCalc
  }
})
export default class App extends Vue {}
</script>
