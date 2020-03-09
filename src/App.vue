<template>
  <div id="app">
    <Header :options="options" />
    <Content :options="options" />
    <Footer :options="options" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from './wow'

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Content from './components/Content.vue'

@Component({
  components: {
    Header,
    Footer,
    Content
  }
})
export default class App extends Vue {
  options = wow.constants.defaults
}
</script>
