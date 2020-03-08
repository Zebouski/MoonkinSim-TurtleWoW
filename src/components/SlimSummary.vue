<template>
  <div class="content">
    <p class="is-size-7-mobile">
      Spell Crit Weight:
      {{ data.spellCritWeight.toFixed(3) }}
    </p>
    <!--
      <div class="column">
        <p class="is-size-7-mobile">
          Spell Crit Weight:
          {{ data.spellCritWeight.toFixed(3) }}
        </p>
        <p class="is-size-7-mobile">
          Spell Hit Weight:
          {{ data.spellHitWeight.toFixed(3) }}
        </p>
        <p class="is-size-7-mobile">
          Int Weight:
          {{ Number(data.intWeight).toFixed(3) }}
        </p>
        <p class="is-size-7-mobile">
          DPS:
          {{ data.dps.effective.avg !== 0 ? data.dps.effective.text : data.periodicDPS.effective.text }}
        </p>
        <p class="is-size-7-mobile">Intellect: {{ data.character.intellect }}</p>
        <p class="is-size-7-mobile">Spell Hit: {{ data.character.spellHit }}</p>
        <p class="is-size-7-mobile">Arcane Damage: {{ data.character.arcaneDamage }}</p>
        <p class="is-size-7-mobile">
          Chance To Miss:
          {{ Number(data.chanceToMiss).toFixed(0) }}%
        </p>
        <p class="is-size-7-mobile">
          Cast Time:
          {{ data.effectiveCastTime.toFixed(2) }} (Base: {{ data.castTime }})
        </p>
        <p class="is-size-7-mobile">Magic School: {{ data.spell.magicSchoolText }}</p>
        <p class="is-size-7-mobile">
          Target Resistance:
          {{ data.target.spellResistance }}
        </p>
      </div>
      <div class="column">
        <p class="is-size-7-mobile">
          <i>1 Spell Crit = {{ data.spellCritWeight.toFixed(3) }} Spell Damage</i>
        </p>
        <p class="is-size-7-mobile">
          <i>1 Spell Hit = {{ data.spellHitWeight.toFixed(3) }} Spell Damage</i>
        </p>
        <p class="is-size-7-mobile">
          <i>{{ (1 / data.intWeight).toFixed(0) }} Int = 1 Spell Damage</i>
        </p>
        <p class="is-size-7-mobile">
          Faerie Fire Upkeep: -{{ data.ffDPSLoss.toFixed(0) }}
          DPS
        </p>

        <p class="is-size-7-mobile">
          Spell Crit:
          {{ data.character.spellCrit.toFixed(3) }}
        </p>

        <p class="is-size-7-mobile">
          Spell Damage:
          {{ data.character.spellDamage }}
        </p>

        <p class="is-size-7-mobile">
          Nature Damage:
          {{ data.character.natureDamage }}
        </p>

        <p class="is-size-7-mobile">
          Chance To Crit:
          {{ Number(data.chanceToCrit).toFixed(3) }}%
        </p>
        <p class="is-size-7-mobile">Mana Cost: {{ data.spell.manaCost }}</p>
        <p class="is-size-7-mobile">Spell Penetration: {{ data.spellPenetration }}</p>
        <p class="is-size-7-mobile">
          Partial Resist Penalty:
          {{ Number(data.partialResistPenalty).toFixed(3) * 100 }}%
        </p>
      </div>
    </div>
    -->
  </div>
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
export default class SlimSummary extends Props {
  wow = wow
}
</script>
