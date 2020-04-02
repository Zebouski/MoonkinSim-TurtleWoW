<template>
  <div id="app">
    <Component v-for="component in components" :key="component" :is="component" :options="options"></Component>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from './wow'

import Content from './components/Content.vue'
import Footer from './components/Footer.vue'

@Component({
  components: {
    Content,
    Footer
  }
})
export default class App extends Vue {
  components: Array<string> = ['Content', 'Footer']
  options = wow.constants.defaults
}
</script>
