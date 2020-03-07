<template>
  <section class="section has-background-black-bis">
    <!-- <section id="debugSection" class="section has-background-grey-darker"> -->
    <div class="container is-fluid">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child box has-background-black-ter has-text-white">
            <p class="subtitle has-text-white"></p>
            <div class="content">
              <div class="columns is-mobile">
                <div class="column">
                  <pre>
                      {{ JSON.stringify(data, null, 2) }}
                    </pre
                  >
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

const Props = Vue.extend({
  props: {
    data: Object
  }
})

@Component
export default class Debug extends Props {
  wow = wow
}
</script>
