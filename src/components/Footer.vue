<template>
  <footer class="footer has-background-black-ter">
    <div class="content has-text-centered has-text-white">
      <font-awesome-icon :icon="['fab', 'discord']" /> Beef Broccoli#5067
      <br />
      <font-awesome-icon :icon="['fas', 'file-pdf']" />&nbsp;
      <a href="https://kmmiles.gitlab.io/moonkin-calc/whitepaper/SpellDamage.pdf">Whitepaper</a>&nbsp;
      <font-awesome-icon :icon="['fab', 'gitlab']" />&nbsp;
      <a href="https://gitlab.com/kmmiles/moonkin-calc">Source</a>&nbsp;
      <font-awesome-icon :icon="['fas', 'book']" />&nbsp;
      <a href="https://kmmiles.gitlab.io/moonkin-calc/docs">Docs</a>&nbsp;
      <b-checkbox class="is-size-7" v-model="options.debug">
        <font-awesome-icon :icon="['fas', 'bug']" />
      </b-checkbox>
      <br />
      <p>
        Based on Keftenk's
        <a
          href="https://forum.classicwow.live/topic/726/by-the-great-winds-i-come-classic-balance-druid-theorycraft-spreadsheet-v1-3"
          >Classic Balance Druid spreadsheet</a
        >
        and math by Balor.
        <br />
        <span class="is-size-7">Version: {{ version }}</span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-left: none;
  border-right: none;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

const Props = Vue.extend({
  props: {
    options: Object
  }
})

@Component
export default class Footer extends Props {
  wow = wow

  get version() {
    return process.env.VUE_APP_VERSION ? process.env.VUE_APP_VERSION : 'debug'
  }
}
</script>
