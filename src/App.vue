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
  }
};
</script>

<style lang="scss">
@import "../node_modules/bulma/bulma.sass";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #2e2e33;
  color: #2c3e50;
  text-align: center;
  margin: 0;
  height: 100vh;
  display: grid;
  place-items: center;
}

body {
  margin: 0;
}
</style>
