<template>
  <div id="app">
    <MoonkinCalc />
  </div>
</template>

<script>
import MoonkinCalc from "./components/MoonkinCalc.vue";

export default {
  name: "app",
  components: {
    MoonkinCalc
  },
  created() {
    document.title = "Moonkin Calculator";
    //document.body.style.background = "#2e2e33";
  }
};
</script>
