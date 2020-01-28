<template>
  <div id="app">
    <MoonkinCalc />
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MoonkinCalc from './components/MoonkinCalc.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

@Component({
  components: {
    MoonkinCalc,
    Header,
    Footer
  }
})
export default class App extends Vue {
  created() {
    document.title = 'Moonkin Calculator'
  }
}
</script>
