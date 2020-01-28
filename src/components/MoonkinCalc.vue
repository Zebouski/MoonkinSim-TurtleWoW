<template>
  <div>
    <section class="section has-background-black-ter">
      <nav class="level is-mobile">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">DPS</p>
            <p class="title has-text-white is-size-5-mobile">{{ spellCast.DPS.toFixed(1) }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Spell Crit Weight</p>
            <p class="title has-text-white is-size-5-mobile">{{ spellCast.spellCritWeight.toFixed(1) }}</p>
            <p></p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Spell Hit Weight</p>
            <p class="title has-text-white is-size-5-mobile">{{ spellCast.spellHitWeight.toFixed(1) }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Int Weight</p>
            <p class="title has-text-white is-size-5-mobile">
              {{ Number(spellCast.spellCritToDamage / spellCast.spellPowerToDamage / 60).toFixed(1) }}
            </p>
          </div>
        </div>
      </nav>
    </section>
    <section class="section has-background-grey-darker">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <div class="content">
                <div class="input_fields">
                  <label class="input-box">
                    <div class="is-size-7-mobile">Spell Name:</div>
                    <div class="select is-size-7-mobile">
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
                    <div class="is-size-7-mobile">Spell Power:</div>
                    <input class="input is-size-7-mobile" type="number" v-model.number="spellPower" />
                  </label>
                  <label class="input-box">
                    <div class="is-size-7-mobile">Spell Crit:</div>
                    <input class="input is-size-7-mobile" type="number" v-model.number="spellCrit" />
                  </label>
                  <label class="input-box">
                    <div class="is-size-7-mobile">Spell Hit:</div>
                    <input class="input is-size-7-mobile" type="number" v-model.number="spellHit" />
                  </label>
                </div>
                <div class="input_fields">
                  <label class="input-box">
                    <div class="is-size-7-mobile">Moonfury rank:</div>
                    <input class="input is-size-7-mobile" type="number" v-model.number="moonFuryRank" />
                  </label>
                  <label class="input-box">
                    <div class="is-size-7-mobile">Vengeance rank:</div>
                    <input class="input is-size-7-mobile" type="number" v-model.number="vengeanceRank" />
                  </label>
                  <label class="input-box">
                    <div class="is-size-7-mobile">Improved Wrath rank:</div>
                    <input class="input is-size-7-mobile" type="number" v-model.number="improvedWrathRank" />
                  </label>
                  <label class="input-box">
                    <div class="is-size-7-mobile">Improved Starfire rank:</div>
                    <input class="input is-size-7-mobile" type="number" v-model.number="improvedStarfireRank" />
                  </label>
                  <label class="input-box">
                    <div class="is-size-7-mobile">Natures Grace rank:</div>
                    <input class="input is-size-7-mobile" type="number" v-model.number="naturesGraceRank" />
                  </label>
                </div>
                <div class="columns is-mobile">
                  <div class="column">
                    <div class="field">
                      <b-checkbox class="is-size-7-mobile" v-model="curseOfShadow">
                        Curse of Shadow
                      </b-checkbox>
                    </div>
                    <div class="field">
                      <b-checkbox class="is-size-7-mobile" v-model="powerInfusion">
                        Power Infusion
                      </b-checkbox>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <b-checkbox class="is-size-7-mobile" v-model="saygesDarkFortune">
                        Sayge's Dark Fortune
                      </b-checkbox>
                    </div>
                    <div class="field">
                      <b-checkbox class="is-size-7-mobile" v-model="tracesOfSilithyst">
                        Traces of Silithyst
                      </b-checkbox>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <b-checkbox class="is-size-7-mobile" v-model="spellVuln">
                        Spell Vulnerability
                      </b-checkbox>
                    </div>

                    <div class="field">
                      <b-checkbox class="is-size-7-mobile" v-model="stormStrike">
                        Storm Strike
                      </b-checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <p class="subtitle has-text-white"></p>
              <div class="content">
                <div class="columns is-mobile">
                  <div class="column">
                    <p class="is-size-7-mobile">
                      Spell Crit Weight:
                      {{ spellCast.spellCritWeight.toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Spell Hit Weight:
                      {{ spellCast.spellHitWeight.toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Int Weight:
                      {{ Number(spellCast.spellCritToDamage / spellCast.spellPowerToDamage / 60).toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Base Dmg: {{ spellCast.spell.baseDmg }} ({{ spellCast.spell.minDmg }} -
                      {{ spellCast.spell.maxDmg }})
                    </p>
                    <p class="is-size-7-mobile">
                      Coefficient (direct): {{ spellCast.spell.coefficient.direct.toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Average Dmg:
                      {{ Number(spellCast.spellAverageDmgNonCrit).toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">Chance to miss: {{ Number(spellCast.spellChanceToMiss).toFixed(3) }}</p>
                    <p class="is-size-7-mobile">School: {{ spellCast.spell.school }}</p>
                    <p class="is-size-7-mobile">Range: {{ spellCast.spell.range }}</p>
                    <p class="is-size-7-mobile">Target Resistance: {{ spellCast.target.spellResistance }}</p>
                  </div>
                  <div class="column">
                    <p class="is-size-7-mobile">
                      <i>1 Spell Crit = {{ spellCast.spellCritWeight.toFixed(3) }} Spell Power</i>
                    </p>
                    <p class="is-size-7-mobile">
                      <i>1 Spell Hit = {{ spellCast.spellHitWeight.toFixed(3) }} Spell Power</i>
                    </p>
                    <p class="is-size-7-mobile">
                      <i
                        >{{
                          Number((1 / (spellCast.spellCritToDamage / spellCast.spellPowerToDamage / 60)).toFixed(3))
                        }}
                        Int = 1 Spell Power</i
                      >
                    </p>
                    <p class="is-size-7-mobile">
                      Cast Time: {{ spellCast.castTime }} (Effective: {{ spellCast.spellEffectiveCastTime.toFixed(3) }},
                      Base: {{ spellCast.spell.castTime }})
                    </p>
                    <p class="is-size-7-mobile">Coefficient (dot): {{ spellCast.spell.coefficient.dot.toFixed(3) }}</p>
                    <p class="is-size-7-mobile">
                      Average Crit:
                      {{ Number(spellCast.spellAverageDmgCrit).toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">Chance to crit: {{ Number(spellCast.spellChanceToCrit).toFixed(3) }}</p>
                    <p class="is-size-7-mobile">Mana cost: {{ spellCast.spell.manaCost }}</p>
                    <p class="is-size-7-mobile">Spell Penetration: {{ spellCast.spellPenetration }}</p>
                    <p class="is-size-7-mobile">
                      Partial resist average loss:
                      {{ Number(spellCast.spellPartialResistLossAverage).toFixed(3) }}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
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
