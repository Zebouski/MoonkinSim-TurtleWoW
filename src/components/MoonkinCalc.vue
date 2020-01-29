<template>
  <div>
    <section id="header" class="section has-background-black-ter">
      <nav class="level is-mobile">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">DPS</p>
            <p class="title has-text-white is-size-5-mobile">
              {{ spellCast.DPS.toFixed(1) }}
            </p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Crit Weight</p>
            <p class="title has-text-white is-size-5-mobile">
              {{ spellCast.spellCritWeight.toFixed(1) }}
            </p>
            <p></p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Hit Weight</p>
            <p class="title has-text-white is-size-5-mobile">
              {{ spellCast.spellHitWeight.toFixed(1) }}
            </p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading has-text-white">Int Weight</p>
            <p class="title has-text-white is-size-5-mobile">
              {{ spellCast.intWeight.toFixed(1) }}
            </p>
          </div>
        </div>
      </nav>
    </section>
    <section class="section has-background-grey-darker">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article
              class="tile is-child box has-background-black-ter has-text-white"
            >
              <b-tabs class="block">
                <b-tab-item label="General">
                  <div class="content">
                    <div class="columns is-mobile">
                      <div class="column">
                        <b-field label="Spell Name" label-position="on-border">
                          <b-select
                            class="is-size-7-mobile"
                            v-model="spellName"
                          >
                            <option
                              v-for="name in spellNames"
                              :key="name"
                              v-bind:value="name"
                            >
                              {{ name }}
                            </option>
                          </b-select>
                        </b-field>

                        <b-field label="Spell Crit" label-position="on-border">
                          <input
                            class="input is-size-7-mobile"
                            type="number"
                            v-model.number="spellCrit"
                          />
                        </b-field>
                      </div>
                      <div class="column">
                        <b-field label="Spell Power" label-position="on-border">
                          <input
                            class="input is-size-7-mobile"
                            type="number"
                            v-model.number="spellPower"
                          />
                        </b-field>
                        <b-field label="Spell Hit" label-position="on-border">
                          <input
                            class="input is-size-7-mobile"
                            type="number"
                            v-model.number="spellHit"
                          />
                        </b-field>
                      </div>
                    </div>
                    <div class="columns is-mobile">
                      <div class="column">
                        <div class="field">
                          <b-checkbox
                            class="is-size-7-mobile"
                            v-model="curseOfShadow"
                          >
                            Curse of Shadow
                          </b-checkbox>
                        </div>
                        <div class="field">
                          <b-checkbox
                            class="is-size-7-mobile"
                            v-model="powerInfusion"
                          >
                            Power Infusion
                          </b-checkbox>
                        </div>
                        <div class="field">
                          <b-checkbox
                            class="is-size-7-mobile"
                            v-model="saygesDarkFortune"
                          >
                            Sayge's Dark Fortune
                          </b-checkbox>
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <b-checkbox
                            class="is-size-7-mobile"
                            v-model="tracesOfSilithyst"
                          >
                            Traces of Silithyst
                          </b-checkbox>
                        </div>
                        <div class="field">
                          <b-checkbox
                            class="is-size-7-mobile"
                            v-model="spellVuln"
                          >
                            Spell Vulnerability
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox
                            class="is-size-7-mobile"
                            v-model="stormStrike"
                          >
                            Storm Strike
                          </b-checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
                <b-tab-item label="Talents">
                  <div class="content">
                    <div class="columns is-mobile">
                      <div class="column">
                        <b-field label="Moonfury" label-position="on-border">
                          <input
                            class="input is-size-7-mobile"
                            type="number"
                            v-model.number="moonFuryRank"
                          />
                        </b-field>

                        <b-field label="Vengeance" label-position="on-border">
                          <input
                            class="input is-size-7-mobile"
                            type="number"
                            v-model.number="vengeanceRank"
                          />
                        </b-field>

                        <b-field
                          label="Improved Wrath"
                          label-position="on-border"
                        >
                          <input
                            class="input is-size-7-mobile"
                            type="number"
                            v-model.number="improvedWrathRank"
                          />
                        </b-field>
                      </div>
                      <div class="column">
                        <b-field
                          label="Improved Starfire"
                          label-position="on-border"
                        >
                          <input
                            class="input is-size-7-mobile"
                            type="number"
                            v-model.number="improvedStarfireRank"
                          />
                        </b-field>
                        <b-field
                          label="Natures Grace"
                          label-position="on-border"
                        >
                          <input
                            class="input is-size-7-mobile"
                            type="number"
                            v-model.number="naturesGraceRank"
                          />
                        </b-field>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
          <div class="tile is-parent">
            <article
              class="tile is-child box has-background-black-ter has-text-white"
            >
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
                      {{
                        Number(
                          spellCast.spellCritToDamage /
                            spellCast.spellPowerToDamage /
                            60
                        ).toFixed(3)
                      }}
                    </p>
                    <p class="is-size-7-mobile">
                      Base Dmg: {{ spellCast.spell.baseDmg }} ({{
                        spellCast.spell.minDmg
                      }}
                      - {{ spellCast.spell.maxDmg }})
                    </p>
                    <p class="is-size-7-mobile">
                      Coefficient (direct):
                      {{ spellCast.spell.coefficient.direct.toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Average Base Dmg:
                      {{
                        Number(spellCast.spellAverageBaseDmgNonCrit).toFixed(3)
                      }}
                    </p>
                    <p class="is-size-7-mobile">
                      Average Dmg:
                      {{ Number(spellCast.spellAverageDmgNonCrit).toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Chance to miss:
                      {{ Number(spellCast.spellChanceToMiss).toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      School: {{ spellCast.spell.school }}
                    </p>
                    <p class="is-size-7-mobile">
                      Range: {{ spellCast.spell.range }}
                    </p>
                    <p class="is-size-7-mobile">
                      Target Resistance: {{ spellCast.target.spellResistance }}
                    </p>
                  </div>
                  <div class="column">
                    <p class="is-size-7-mobile">
                      <i
                        >1 Spell Crit =
                        {{ spellCast.spellCritWeight.toFixed(3) }} Spell
                        Power</i
                      >
                    </p>
                    <p class="is-size-7-mobile">
                      <i
                        >1 Spell Hit =
                        {{ spellCast.spellHitWeight.toFixed(3) }} Spell Power</i
                      >
                    </p>
                    <p class="is-size-7-mobile">
                      <i
                        >{{ spellCast.intWeight.toFixed(3) }} Int = 1 Spell
                        Power</i
                      >
                    </p>
                    <p class="is-size-7-mobile">
                      Cast Time: {{ spellCast.castTime }} (Effective:
                      {{ spellCast.spellEffectiveCastTime.toFixed(3) }})
                    </p>
                    <p class="is-size-7-mobile">
                      Coefficient (dot):
                      {{ spellCast.spell.coefficient.dot.toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Average Base Crit:
                      {{ Number(spellCast.spellAverageBaseDmgCrit).toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Average Crit:
                      {{ Number(spellCast.spellAverageDmgCrit).toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Chance to crit:
                      {{ Number(spellCast.spellChanceToCrit).toFixed(3) }}
                    </p>
                    <p class="is-size-7-mobile">
                      Mana cost: {{ spellCast.spell.manaCost }}
                    </p>
                    <p class="is-size-7-mobile">
                      Spell Penetration: {{ spellCast.spellPenetration }}
                    </p>
                    <p class="is-size-7-mobile">
                      Partial resist average loss:
                      {{
                        Number(spellCast.spellPartialResistLossAverage).toFixed(
                          3
                        )
                      }}
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
  grid-template-columns: 1fr 1fr;
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
        new wcf.Buffs(
          this.powerInfusion,
          this.saygesDarkFortune,
          this.tracesOfSilithyst
        )
      ),
      new wcf.Spell(this.spellName),
      new wcf.Target(
        this.targetName,
        new wcf.Debuffs(this.curseOfShadow, this.stormStrike, this.spellVuln)
      )
    )
  }
}
</script>
