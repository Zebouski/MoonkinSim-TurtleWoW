<template>
  <div>
    <section id="spellSelectSection" class="section has-background-black-ter is-paddingless	">
      <div class="container is-fluid is-marginless">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article id="spellSelectArticle" class="tile is-child box has-background-black-ter has-text-white">
              <div class="content">
                <div class="columns is-centered is-vcentered is-mobile">
                  <div class="column"></div>
                  <div class="column is-narrow">
                    <b-field label="Spell Name" label-position="on-border">
                      <b-select class="is-size-7-mobile" v-model="spellName">
                        <option v-for="name in spellList" :key="name" v-bind:value="name">
                          {{ name }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column is-narrow">
                    <b-field label="Race" label-position="on-border">
                      <b-select class="is-size-7-mobile" v-model.number="race">
                        <option value="6">Tauren</option>
                        <option value="4">Night-elf</option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column is-narrow">
                    <b-field label="Phase" label-position="on-border">
                      <b-select class="is-size-7-mobile" v-model="phase" @input="phaseChange">
                        <option v-for="phase in phaseList" :key="phase" v-bind:value="phase">
                          {{ phase }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column"></div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="mainSection" class="section has-background-grey-darker">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <b-tabs class="block">
                <b-tab-item label="Gear">
                  <div class="content">
                    <div class="columns is-mobile">
                      <div class="column">
                        <b-field label="Spell Dmg" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="spellDamage" />
                        </b-field>
                        <b-field label="Nature Dmg" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="natureDamage" />
                        </b-field>

                        <b-field label="Spell Crit" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="spellCrit" />
                        </b-field>
                      </div>
                      <div class="column">
                        <b-field label="Arcane Dmg" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="arcaneDamage" />
                        </b-field>
                        <b-field label="Spell Hit" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="spellHit" />
                        </b-field>
                        <b-field label="Intellect" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="intellect" />
                        </b-field>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
                <b-tab-item label="Talents">
                  <div class="content">
                    <div class="columns is-mobile">
                      <div class="column">
                        <b-field label="Moonfury" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="moonFuryRank" />
                        </b-field>

                        <b-field label="Vengeance" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="vengeanceRank" />
                        </b-field>

                        <b-field label="Imp. Wrath" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="improvedWrathRank" />
                        </b-field>
                      </div>
                      <div class="column">
                        <b-field label="Imp. Starfire" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="improvedStarfireRank" />
                        </b-field>
                        <b-field label="Natures Grace" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="naturesGraceRank" />
                        </b-field>
                        <b-field label="Imp. Moonfire" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="improvedMoonfireRank" />
                        </b-field>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
                <b-tab-item label="Buffs">
                  <div class="content">
                    <div class="columns is-mobile">
                      <div class="column">
                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="PowerInfusion" v-model="buffNames">
                            Power Infusion
                          </b-checkbox>
                        </div>
                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="FlaskOfSupremePower" v-model="buffNames">
                            Flask of Supreme Power
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox
                            class="is-size-7-mobile"
                            native-value="CerebralCortexCompound"
                            v-model="buffNames"
                          >
                            Cerebral Cortex Compound
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="ArcaneBrilliance" v-model="buffNames">
                            Arcane Brilliance
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="ImprovedGiftOfTheWild" v-model="buffNames">
                            Improved Gift of the Wild
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="SlipkiksSavvy" v-model="buffNames">
                            Slip'kik's Saavy
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="MoonkinAura" v-model="buffNames">
                            Moonkin Aura
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="SaygesDarkFortune" v-model="buffNames">
                            Sayge's Dark Fortune
                          </b-checkbox>
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="EphemeralPower" v-model="buffNames">
                            Ephemeral Power
                          </b-checkbox>
                        </div>
                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="GreaterArcaneElixir" v-model="buffNames">
                            Greater Arcane Elixir
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="RunnTumTuberSurprise" v-model="buffNames">
                            Runn Tum Tuber Surprise
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="BlessingOfKings" v-model="buffNames">
                            Blessing of Kings
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox
                            class="is-size-7-mobile"
                            native-value="RallyingCryOfTheDragonSlayer"
                            v-model="buffNames"
                          >
                            Rallying Cry of the Dragon Slayer
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="SongflowerSerenade" v-model="buffNames">
                            Songflower Serenade
                          </b-checkbox>
                        </div>

                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="TracesOfSilithyst" v-model="buffNames">
                            Traces of Silithyst
                          </b-checkbox>
                        </div>
                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="BurningAdrenaline" v-model="buffNames">
                            Burning Adrenaline
                          </b-checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
                <b-tab-item label="Target">
                  <div class="content">
                    <div class="columns is-mobile">
                      <div class="column">
                        <b-field label="Type" label-position="on-border">
                          <b-select class="is-size-7-mobile" v-model.number="targetType">
                            <option value="0">Beast</option>
                            <option value="1">Demon</option>
                            <option value="2">Dragonkin</option>
                            <option value="3">Elemental</option>
                            <option value="4">Giant</option>
                            <option value="5">Humanoid</option>
                            <option value="6">Mechanical</option>
                            <option value="7">Undead</option>
                          </b-select>
                        </b-field>
                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="StormStrike" v-model="buffNames">
                            Storm Strike
                          </b-checkbox>
                        </div>
                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="SpellVulnerability" v-model="buffNames">
                            Spell Vulnerability
                          </b-checkbox>
                        </div>
                      </div>
                      <div class="column">
                        <b-field label="Resistance" label-position="on-border">
                          <input class="input is-size-7-mobile" type="number" v-model.number="targetSpellResistance" />
                        </b-field>
                        <div class="field">
                          <b-checkbox class="is-size-7-mobile" native-value="CurseOfShadow" v-model="buffNames">
                            Curse of Shadow
                          </b-checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <b-tabs class="block">
                <b-tab-item label="Summary">
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
                          {{ Number(spellCast.intWeight).toFixed(3) }}
                        </p>
                        <p class="is-size-7-mobile">
                          DPS:
                          {{
                            spellCast.dps.effective.avg !== 0
                              ? spellCast.dps.effective.text
                              : spellCast.periodicDPS.effective.text
                          }}
                        </p>
                        <p class="is-size-7-mobile">Intellect: {{ spellCast.character.intellect }}</p>
                        <p class="is-size-7-mobile">Spell Hit: {{ spellCast.character.spellHit }}</p>
                        <p class="is-size-7-mobile">Arcane Damage: {{ spellCast.character.arcaneDamage }}</p>
                        <p class="is-size-7-mobile">
                          Chance To Miss:
                          {{ Number(spellCast.chanceToMiss).toFixed(0) }}%
                        </p>
                        <p class="is-size-7-mobile">
                          Cast Time:
                          {{ spellCast.effectiveCastTime.toFixed(2) }} (Base: {{ spellCast.castTime }})
                        </p>
                        <p class="is-size-7-mobile">Magic School: {{ spellCast.spell.magicSchoolText }}</p>
                        <p class="is-size-7-mobile">
                          Target Resistance:
                          {{ spellCast.target.spellResistance }}
                        </p>
                      </div>
                      <div class="column">
                        <p class="is-size-7-mobile">
                          <i>1 Spell Crit = {{ spellCast.spellCritWeight.toFixed(3) }} Spell Damage</i>
                        </p>
                        <p class="is-size-7-mobile">
                          <i>1 Spell Hit = {{ spellCast.spellHitWeight.toFixed(3) }} Spell Damage</i>
                        </p>
                        <p class="is-size-7-mobile">
                          <i>{{ (1 / spellCast.intWeight).toFixed(0) }} Int = 1 Spell Damage</i>
                        </p>
                        <p class="is-size-7-mobile">
                          Faerie Fire Upkeep: -{{ spellCast.ffDPSLoss.toFixed(0) }}
                          DPS
                        </p>

                        <p class="is-size-7-mobile">
                          Spell Crit:
                          {{ spellCast.character.spellCrit.toFixed(3) }}
                        </p>

                        <p class="is-size-7-mobile">
                          Spell Damage:
                          {{ spellCast.character.spellDamage }}
                        </p>

                        <p class="is-size-7-mobile">
                          Nature Damage:
                          {{ spellCast.character.natureDamage }}
                        </p>

                        <p class="is-size-7-mobile">
                          Chance To Crit:
                          {{ Number(spellCast.chanceToCrit).toFixed(3) }}%
                        </p>
                        <p class="is-size-7-mobile">Mana Cost: {{ spellCast.spell.manaCost }}</p>
                        <p class="is-size-7-mobile">Spell Penetration: {{ spellCast.spellPenetration }}</p>
                        <p class="is-size-7-mobile">
                          Partial Resist Penalty:
                          {{ Number(spellCast.partialResistPenalty).toFixed(3) * 100 }}%
                        </p>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
                <b-tab-item label="Damage">
                  <div class="content">
                    <table class="table is-fullwidth is-bordered">
                      <thead>
                        <tr>
                          <th>
                            <span class="is-size-6 is-size-7-mobile has-text-warning">
                              Direct ({{ (spellCast.spell.coefficient.direct * 100).toFixed(2) }}%)
                            </span>
                          </th>
                          <th>
                            <span class="is-size-7 has-text-white">Normal</span>
                          </th>
                          <th>
                            <span class="is-size-7 has-text-white">Crit</span>
                          </th>
                          <th>
                            <span class="is-size-7 has-text-white">DPS</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <b-tooltip v-bind:label="tooltipBase" multilined>
                              <span class="is-size-7 has-text-weight-bold">Base</span>
                            </b-tooltip>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">{{ spellCast.normalDmg.base.text }}</span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">{{ spellCast.critDmg.base.text }}</span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">{{ spellCast.dps.base.text }}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b-tooltip v-bind:label="tooltipActual" multilined>
                              <span class="is-size-7 has-text-weight-bold">Actual</span>
                            </b-tooltip>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">{{ spellCast.normalDmg.actual.text }}</span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">{{ spellCast.critDmg.actual.text }}</span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">{{ spellCast.dps.actual.text }}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b-tooltip v-bind:label="tooltipEffective" multilined>
                              <span class="is-size-7 has-text-weight-bold">Effective</span>
                            </b-tooltip>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">{{ spellCast.normalDmg.effective.text }}</span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">{{ spellCast.critDmg.effective.text }}</span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic has-text-success has-text-weight-bold">{{
                              spellCast.dps.effective.text
                            }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    <table class="table is-fullwidth is-bordered">
                      <thead>
                        <tr>
                          <th>
                            <span class="is-size-6 is-size-7-mobile has-text-warning">
                              Periodic ({{ (spellCast.spell.coefficient.periodic * 100).toFixed(2) }}%)
                            </span>
                          </th>
                          <th>
                            <span class="is-size-7 has-text-weight-bold has-text-white">Tick</span>
                          </th>
                          <th>
                            <span class="is-size-7 has-text-weight-bold has-text-white">Total</span>
                          </th>
                          <th>
                            <span class="is-size-7 has-text-weight-bold has-text-white">DPS</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <b-tooltip v-bind:label="tooltipBase" multilined>
                              <span class="is-size-7 has-text-weight-bold">Base</span>
                            </b-tooltip>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">
                              {{ spellCast.periodicDmg.base.tickText }}
                            </span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">
                              {{ spellCast.periodicDmg.base.totalText }}
                            </span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">
                              {{ spellCast.periodicDPS.base.text }}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b-tooltip v-bind:label="tooltipActual" multilined>
                              <span class="is-size-7 has-text-weight-bold">Actual</span>
                            </b-tooltip>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">
                              {{ spellCast.periodicDmg.actual.tickText }}
                            </span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">
                              {{ spellCast.periodicDmg.actual.totalText }}
                            </span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">
                              {{ spellCast.periodicDPS.actual.text }}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b-tooltip v-bind:label="tooltipEffective" multilined>
                              <span class="is-size-7 has-text-weight-bold">Effective</span>
                            </b-tooltip>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">
                              {{ spellCast.periodicDmg.effective.tickText }}
                            </span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic">
                              {{ spellCast.periodicDmg.effective.totalText }}
                            </span>
                          </td>
                          <td>
                            <span class="is-size-7 is-italic has-text-success has-text-weight-bold">
                              {{ spellCast.periodicDPS.effective.text }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                  </div>
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section id="debugSection" class="section has-background-black-ter" v-bind:class="{ 'is-hidden': !DEBUG }">
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
                      {{ buffNames }}
                      {{ JSON.stringify(spellCast, null, 2) }}
                    </pre>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

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
        <b-checkbox class="is-size-7" v-model="DEBUG">
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
  </div>
</template>

<style scoped>
#spellSelectSection {
  border-left: none;
  border-right: none;
}
#spellSelectArticle {
  border-left: none;
  border-right: none;
}

.footer {
  border-left: none;
  border-right: none;
}
/*
#spellSelectSection {
  padding-top: 1rem;
  padding-bottom: 0;
}

#debugSection {
  padding-top: 0;
  padding-bottom: 1rem;
}

#mainSection {
  padding-top: 0;
  padding-bottom: 1rem;
}

#myFooter {
  padding-top: 0;
  padding-bottom: 1rem;
}

.tab-content {
  padding: 0;
}
*/
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

@Component
export default class MoonkinCalc extends Vue {
  DEBUG = false

  phase = 3
  spellName = 'Starfire Rank 6'
  race = wow.PlayableRace.Tauren

  /* target */
  targetType = wow.TargetType.Elemental
  targetSpellResistance = 75

  /* talents */
  naturesGraceRank = 1
  moonFuryRank = 5
  vengeanceRank = 5
  improvedWrathRank = 5
  improvedStarfireRank = 5
  improvedMoonfireRank = 5

  /* buffs */
  buffNames = [
    'MoonkinAura',
    'FlaskOfSupremePower',
    'GreaterArcaneElixir',
    'CerebralCortexCompound',
    'RunnTumTuberSurprise',
    'RallyingCryOfTheDragonSlayer',
    'SlipkiksSavvy',
    'ArcaneBrilliance',
    'SongflowerSerenade',
    'BlessingOfKings',
    'ImprovedGiftOfTheWild',
    'CurseOfShadow'
  ]

  tooltipBase =
    'Base damage is the spells damage including talents that modify the base, such as Moonfury. This is the damage listed in the in-game spellbook.'
  tooltipActual = 'Actual damage is base damage plus (spellpower * spell coefficient)'
  tooltipEffective = 'Effective damage is actual damage plus multipliers from buffs, debuffs, and partial resists'

  stamina = this.rawGear.stamina
  intellect = this.rawGear.intellect
  spirit = this.rawGear.spirit
  mp5 = this.rawGear.mp5
  spellPenetration = this.rawGear.spellPenetration
  spellHit = this.rawGear.spellHit
  spellCrit = this.rawGear.spellCrit
  spellDamage = this.rawGear.spellDamage
  arcaneDamage = this.rawGear.arcaneDamage
  natureDamage = this.rawGear.natureDamage

  /*
  mounted(): void {
    console.log('hello mounted world')
  }
*/
  get version() {
    return process.env.VUE_APP_VERSION ? process.env.VUE_APP_VERSION : 'debug'
  }

  phaseChange(): void {
    // window.alert('phase changed: ' + this.phase)
    this.stamina = this.rawGear.stamina
    this.intellect = this.rawGear.intellect
    this.spirit = this.rawGear.spirit
    this.mp5 = this.rawGear.mp5
    this.spellPenetration = this.rawGear.spellPenetration
    this.spellHit = this.rawGear.spellHit
    this.spellCrit = this.rawGear.spellCrit
    this.spellDamage = this.rawGear.spellDamage
    this.arcaneDamage = this.rawGear.arcaneDamage
    this.natureDamage = this.rawGear.natureDamage
  }

  get spellList() {
    return wow.Database.spellListByPhase(this.phase)
  }

  get phaseList() {
    return wow.Database.phaseList()
  }

  get targetList() {
    return wow.Database.targetList()
  }

  get rawGear() {
    return new wow.RawGear(this.phase)
  }

  get spellCast() {
    return new wow.Cast(
      new wow.Character(
        wow.constants.playerLevelCap,
        this.race,
        wow.PlayableClass.Druid,
        wow.Gender.Male,
        new wow.Talents(
          this.naturesGraceRank,
          this.moonFuryRank,
          this.vengeanceRank,
          this.improvedWrathRank,
          this.improvedStarfireRank,
          this.improvedMoonfireRank
        ),
        new wow.Gear(
          this.stamina,
          this.intellect,
          this.spirit,
          this.mp5,
          this.spellPenetration,
          this.spellHit,
          this.spellCrit,
          this.spellDamage,
          this.arcaneDamage,
          this.natureDamage
        ),
        wow.Character.buffListToFlags(this.buffNames)
      ),
      new wow.Spell(this.spellName),
      new wow.Target(this.targetType, this.targetSpellResistance, wow.Character.buffListToFlags(this.buffNames))
    )
  }
}
</script>
