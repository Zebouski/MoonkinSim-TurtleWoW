<template>
  <div id="app">
    <MoonkinCalc />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MoonkinCalc from "./components/MoonkinCalc.vue";

@Component({
  components: {
    MoonkinCalc
  }
})
export default class App extends Vue {
  created() {
    document.title = "Moonkin Calculator";
    //document.body.style.background = "#2e2e33";
  }
}
</script>
