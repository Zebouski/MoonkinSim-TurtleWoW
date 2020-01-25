<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <font-awesome-icon :icon="['fab', 'discord']" /> Beef Broccoli#5067
      <br />
      <font-awesome-icon :icon="['fas', 'file-pdf']" />&nbsp;
      <a href="https://kmmiles.gitlab.io/moonkin-calc/whitepaper/SpellDamage.pdf">Whitepaper / </a>
      <font-awesome-icon :icon="['fab', 'gitlab']" />&nbsp;
      <a href="https://gitlab.com/kmmiles/moonkin-calc">Source / </a>
      <font-awesome-icon :icon="['fas', 'book']" />&nbsp;
      <a href="https://kmmiles.gitlab.io/moonkin-calc/docs">Docs</a>
      <br />
      <p>
        Based on Keftenk's
        <a
          href="https://forum.classicwow.live/topic/726/by-the-great-winds-i-come-classic-balance-druid-theorycraft-spreadsheet-v1-3"
          >Classic Balance Druid spreadsheet</a
        >
        and math by Balor.
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {}
</script>
