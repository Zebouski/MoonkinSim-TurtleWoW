<template>
  <div id="app">
    <Component v-for="component in components" :key="component" :is="component" :options="options"></Component>
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
  components: Array<string> = ['Header', 'Content', 'Footer']
  options = wow.constants.defaults
}
</script>
