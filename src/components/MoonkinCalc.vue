<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Moonkin Calculator</h1>
          <h2 class="subtitle">Calculate things...for moonkin.</h2>
        </div>
      </div>
    </section>
    <section class="section has-background-grey-darker">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <div class="content">
                <div class="input_fields">
                  <label class="input-box">
                    <div>Spell Name:</div>
                    <div class="select">
                      <select v-model="spellName">
                        <option v-for="name in spellNames" :key="name" v-bind:value="name">{{ name }}</option>
                      </select>
                    </div>
                  </label>
                  <!--
                  <label class="input-box">
                    <div>Target:</div>
                    <div class="select">
                      <select v-model="targetName">
                        <option
                          v-for="name in targetNames"
                          :key="name"
                          v-bind:value="name"
                          >{{ name }}</option
                        >
                      </select>
                    </div>
                  </label>
                  -->
                </div>
                <div class="input_fields">
                  <label class="input-box">
                    <div>Spell Power:</div>
                    <input class="input" type="number" v-model.number="spellPower" />
                  </label>
                  <label class="input-box">
                    <div>Spell Crit:</div>
                    <input class="input" type="number" v-model.number="spellCrit" />
                  </label>
                  <label class="input-box">
                    <div>Spell Hit:</div>
                    <input class="input" type="number" v-model.number="spellHit" />
                  </label>
                </div>
                <div class="input_fields">
                  <label class="input-box">
                    <div>Moonfury rank:</div>
                    <input class="input" type="number" v-model.number="moonFuryRank" />
                  </label>
                  <label class="input-box">
                    <div>Vengeance rank:</div>
                    <input class="input" type="number" v-model.number="vengeanceRank" />
                  </label>
                  <label class="input-box">
                    <div>Improved Wrath rank:</div>
                    <input class="input" type="number" v-model.number="improvedWrathRank" />
                  </label>
                  <label class="input-box">
                    <div>Improved Starfire rank:</div>
                    <input class="input" type="number" v-model.number="improvedStarfireRank" />
                  </label>
                  <label class="input-box">
                    <div>Natures Grace rank:</div>
                    <input class="input" type="number" v-model.number="naturesGraceRank" />
                  </label>
                </div>
                <div class="input_fields">
                  <label class="input-box"> <input type="checkbox" v-model="curseOfShadow" />Curse of Shadow </label>
                  <label class="input-box"> <input type="checkbox" v-model="powerInfusion" />Power Infusion </label>
                  <label class="input-box">
                    <input type="checkbox" v-model="saygesDarkFortune" />Sayge's Dark Fortune of Damage
                  </label>
                  <label class="input-box">
                    <input type="checkbox" v-model="tracesOfSilithyst" />Traces of Silithyst
                  </label>
                  <label class="input-box"> <input type="checkbox" v-model="spellVuln" />Spell Vulnerability </label>
                  <label class="input-box"> <input type="checkbox" v-model="stormStrike" />Storm Strike </label>
                </div>
              </div>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <p class="subtitle has-text-white"></p>
              <div class="content">
                <p>DPS: {{ spellCast.DPS.toFixed(2) }}</p>
                <p>
                  Spell Crit Weight:
                  {{ spellCast.spellCritWeight.toFixed(2) }}
                  <i>(1 Spell Crit = {{ spellCast.spellCritWeight.toFixed(2) }} Spell Power)</i>
                </p>
                <p>
                  Spell Hit Weight:
                  {{ spellCast.spellHitWeight.toFixed(2) }}
                  <i>
                    (1 Spell Hit = {{ spellCast.spellHitWeight.toFixed(2) }}
                    Spell Power)
                  </i>
                </p>
                <p>
                  Int Weight:
                  {{ Number(spellCast.spellCritToDamage / spellCast.spellPowerToDamage / 60).toFixed(2) }}
                  <i>
                    ({{ Number((1 / (spellCast.spellCritToDamage / spellCast.spellPowerToDamage / 60)).toFixed(2)) }}
                    Int = 1 Spell Power)
                  </i>
                </p>
                <p>
                  Spell Base Dmg: {{ spellCast.spell.baseDmg }} ({{ spellCast.spell.minDmg }} -
                  {{ spellCast.spell.maxDmg }})
                </p>
                <p>
                  Spell Cast Time: {{ spellCast.castTime }} (Effective:
                  {{ spellCast.spellEffectiveCastTime.toFixed(2) }}, Base: {{ spellCast.spell.castTime }})
                </p>
                <p>Spell Coefficient: {{ spellCast.spell.coefficient }}</p>
                <p>Spell School: {{ spellCast.spell.school }}</p>
                <p>Spell Range: {{ spellCast.spell.range }}</p>
                <p>Spell Penetration: {{ spellCast.spellPenetration }}</p>
                <p>Target Resistance: {{ spellCast.target.spellResistance }}</p>
                <p>
                  Partial resist average loss:
                  {{ Number(spellCast.spellPartialResistLossAverage).toFixed(2) }}
                </p>
                <p>
                  Spell chance to miss / hit / crit:
                  {{ Number(spellCast.spellChanceToMiss).toFixed(2) }} /
                  {{ Number(spellCast.spellChanceToRegularHit).toFixed(2) }} /
                  {{ Number(spellCast.spellChanceToCrit).toFixed(2) }}
                </p>
                <p>
                  Spell average non-crit:
                  {{ Number(spellCast.spellAverageNonCrit).toFixed(2) }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <font-awesome-icon :icon="['fab', 'discord']" />Beef Broccoli#5067
        <br />
        <font-awesome-icon :icon="['fab', 'gitlab']" />
        <a href="https://gitlab.com/kmmiles/moonkin-calc">Source / </a>
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
  </div>
</template>

<style scoped>
.input_fields {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  margin: 1rem 0;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wcf } from '../wcf'

@Component
export default class MoonkinCalc extends Vue {
  spellNames = wcf.Spell.getSpellNames()
  targetNames = wcf.Target.getTargetNames()
  spellName = 'Starfire Rank 6'
  targetName = 'Ragnaros'
  targetSpellResistance = 75
  spellPower = 684
  spellCrit = 30.785
  spellHit = 2
  spellPenetration = 75
  naturesGraceRank = 1
  moonFuryRank = 5
  vengeanceRank = 5
  improvedWrathRank = 5
  improvedStarfireRank = 5
  curseOfShadow = true
  powerInfusion = false
  saygesDarkFortune = false
  tracesOfSilithyst = false
  spellVuln = false
  stormStrike = false

  get spellCast() {
    return new wcf.SpellCast(
      new wcf.Character(
        60,
        'Tauren',
        'Druid',
        'Male',
        new wcf.Talents(
          this.naturesGraceRank,
          this.moonFuryRank,
          this.vengeanceRank,
          this.improvedWrathRank,
          this.improvedStarfireRank
        ),
        new wcf.Gear(this.spellHit, this.spellCrit, this.spellPower),
        new wcf.Buffs(this.powerInfusion, this.saygesDarkFortune, this.tracesOfSilithyst)
      ),
      new wcf.Spell(this.spellName),
      new wcf.Target(this.targetName, new wcf.Debuffs(this.curseOfShadow, this.stormStrike, this.spellVuln))
    )
  }
}
</script>
