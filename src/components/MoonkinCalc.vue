<template>
  <div>
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Moonkin Calculator
          </h1>
          <h2 class="subtitle">
            Calculate things...for moonkin.
          </h2>
        </div>
      </div>
    </section>
    <section class="section has-background-grey-darker ">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article
              class="tile is-child box has-background-black-ter has-text-white"
            >
              <div class="content">
                <div class="select">
                  <select v-model="spellName" @change="onChange($event)">
                    <option>Starfire Rank 1</option>
                    <option>Starfire Rank 2</option>
                    <option>Starfire Rank 3</option>
                    <option>Starfire Rank 4</option>
                    <option>Starfire Rank 5</option>
                    <option>Starfire Rank 6</option>
                    <option>Starfire Rank 7</option>
                    <option>Wrath Rank 1</option>
                    <option>Wrath Rank 2</option>
                    <option>Wrath Rank 3</option>
                    <option>Wrath Rank 4</option>
                    <option>Wrath Rank 5</option>
                    <option>Wrath Rank 6</option>
                    <option>Wrath Rank 7</option>
                    <option>Wrath Rank 8</option>
                  </select>
                </div>
                <div class="input_fields">
                  <label class="input-box">
                    <div>Spell Base Damage:</div>
                    <input
                      class="input"
                      type="number"
                      v-model="spellBaseDamage"
                    />
                  </label>
                  <label class="input-box">
                    <div>Spell Base Cast Time:</div>
                    <input
                      class="input"
                      type="number"
                      v-model="spellCastTime"
                    />
                  </label>
                  <label class="input-box">
                    <div>Spell Coefficient:</div>
                    <input
                      class="input"
                      type="number"
                      v-model="spellCoefficient"
                    />
                  </label>
                </div>
                <div class="input_fields">
                  <label class="input-box">
                    <div>Spell Power:</div>
                    <input class="input" type="number" v-model="spellPower" />
                  </label>
                  <label class="input-box">
                    <div>Spell Crit:</div>
                    <input class="input" type="number" v-model="spellCrit" />
                  </label>
                  <label class="input-box">
                    <div>Spell Hit:</div>
                    <input class="input" type="number" v-model="spellHit" />
                  </label>
                  <label class="input-box">
                    <div>Spell Penetration:</div>
                    <input
                      class="input"
                      type="number"
                      v-model="spellPenetration"
                    />
                  </label>
                  <label class="input-box">
                    <div>Enemy Resistance:</div>
                    <input
                      class="input"
                      type="number"
                      v-model="enemySpellResistance"
                    />
                  </label>
                </div>
                <div class="input_fields">
                  <label class="input-box">
                    <div>Moonfury points:</div>
                    <input
                      class="input"
                      type="number"
                      v-model="moonFuryPoints"
                    />
                  </label>
                  <label class="input-box">
                    <div>Vengeance points:</div>
                    <input
                      class="input"
                      type="number"
                      v-model="vengeancePoints"
                    />
                  </label>
                  <label class="input-box">
                    <div>Improved Wrath points:</div>
                    <input
                      class="input"
                      type="number"
                      v-model="improvedWrathPoints"
                    />
                  </label>
                  <label class="input-box">
                    <input type="checkbox" v-model="naturesGrace" />Nature's
                    Grace
                  </label>
                  <label class="input-box">
                    <input type="checkbox" v-model="curseOfShadow" />Curse of
                    Shadow
                  </label>
                  <label class="input-box">
                    <input type="checkbox" v-model="powerInfusion" />Power
                    Infusion
                  </label>
                  <label class="input-box">
                    <input type="checkbox" v-model="saygesDarkFortune" />Sayge's
                    Dark Fortune of Damage
                  </label>
                  <label class="input-box">
                    <input type="checkbox" v-model="tracesOfSilithyst" />Traces
                    of Silithyst
                  </label>
                  <label class="input-box">
                    <input type="checkbox" v-model="spellVuln" />Spell
                    Vulnerability
                  </label>
                  <label class="input-box">
                    <input type="checkbox" v-model="stormStrike" />Storm Strike
                  </label>
                </div>
              </div>
            </article>
          </div>
          <div class="tile is-parent">
            <article
              class="tile is-child box has-background-black-ter has-text-white"
            >
              <p class="subtitle has-text-white"></p>
              <div class="content">
                <p>DPS: {{ Number(spellDPS.toFixed(2)) }}</p>
                <p>
                  Spell Crit Weight:
                  {{
                    Number(spellCritToDamage / spellPowerToDamage).toFixed(2)
                  }}
                  <i
                    >(1 Spell Crit =
                    {{
                      Number(
                        (spellCritToDamage / spellPowerToDamage).toFixed(2)
                      )
                    }}
                    Spell Power)</i
                  >
                </p>
                <p>
                  Spell Hit Weight:
                  {{ Number(spellHitToDamage / spellPowerToDamage).toFixed(2) }}
                  <i
                    >(1 Spell Hit =
                    {{
                      Number((spellHitToDamage / spellPowerToDamage).toFixed(2))
                    }}
                    Spell Power)</i
                  >
                </p>
                <p>
                  Int Weight:
                  {{
                    Number(spellCritToDamage / spellPowerToDamage / 60).toFixed(
                      2
                    )
                  }}
                  <i
                    >({{
                      Number(
                        (
                          1 /
                          (spellCritToDamage / spellPowerToDamage / 60)
                        ).toFixed(2)
                      )
                    }}
                    Int = 1 Spell Power)</i
                  >
                </p>
                <p>
                  Spell chance to miss:
                  {{ Number(spellChanceToMiss).toFixed(2) }}
                </p>
                <p>
                  Spell chance to regular hit:
                  {{ Number(spellChanceToRegularHit).toFixed(2) }}
                </p>
                <p>
                  Spell chance to crit:
                  {{ Number(spellChanceToCrit).toFixed(2) }}
                </p>
                <p>
                  Spell average non-crit:
                  {{ Number(spellAverageNonCrit).toFixed(2) }}
                </p>
                <p>
                  Spell effective cast-time:
                  {{ Number(spellEffectiveCastTime).toFixed(2) }}
                </p>
                <p>
                  Spell partial resist average loss:
                  {{ Number(spellPartialResistLossAverage).toFixed(2) }}
                </p>
                <p>Spell Crit Bonus: {{ spellCritBonus }}</p>
                <p>Moonfury Bonus: {{ moonFuryBonus }}</p>
                <!--<p>Spell Power To Damage: {{ spellPowerToDamage }}</p>
                <p>Spell Crit To Damage: {{ spellCritToDamage }}</p>
                <p>Spell Hit To Damage: {{ spellHitToDamage }}</p>-->
              </div>
            </article>
          </div>
        </div>
      </div>
      <!--
      <div class="tile is-parent">
        <article
          class="tile is-child box has-background-black-ter has-text-white">
          <p class="subtitle has-text-white">Gear</p>
          <div class="content">
            <div class="control">
              <div class="select">
                <select :value="gearListHeads">
                  <option v-for="gearItem in gearListHeads" v-bind:key="gearItem.Name">{{ gearItem.Name }}</option>
                </select>
              </div>
            </div>
            <div class="control">
              <div class="select">
                <select :value="gearListNecks">
                  <option v-for="gearItem in gearListNecks" v-bind:key="gearItem.Name">{{ gearItem.Name }}</option>
                </select>
              </div>
            </div>
          </div>
        </article>
      </div>
      -->
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <font-awesome-icon :icon="['fab', 'discord']" /> Beef Broccoli#5067<br />
        <font-awesome-icon :icon="['fab', 'gitlab']" />
        <a href="https://gitlab.com/kmmiles/moonkin-calc"
          >https://gitlab.com/kmmiles/moonkin-calc</a
        ><br />
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

<style scoped lang="scss">
.input_fields {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  margin: 1rem 0;
}
</style>

<script>
var wcf = require("../wcf.js");
//import gearJSON from "../../db/Classic_Balance_Druidv1.3.json";

export default {
  name: "MoonkinCalc",
  data() {
    return {
      spellName: wcf.defaults.spellName,
      spellDamageType: wcf.defaults.spellDamageType,
      spellBaseDamage: wcf.defaults.spellBaseDamage,
      spellCoefficient: wcf.defaults.spellCoefficient,
      spellCastTime: wcf.defaults.spellCastTime,
      spellPower: wcf.defaults.spellPower,
      spellCrit: wcf.defaults.spellCrit,
      spellHit: wcf.defaults.spellHit,
      spellPenetration: wcf.defaults.spellPenetration,
      enemySpellResistance: wcf.defaults.enemySpellResistance,
      vengeancePoints: wcf.defaults.vengeancePoints,
      moonFuryPoints: wcf.defaults.moonFuryPoints,
      improvedWrathPoints: wcf.defaults.improvedWrathPoints,
      naturesGrace: wcf.defaults.naturesGrace,
      curseOfShadow: wcf.defaults.curseOfShadow,
      powerInfusion: wcf.defaults.powerInfusion,
      saygesDarkFortune: wcf.defaults.saygesDarkFortune,
      tracesOfSilithyst: wcf.defaults.tracesOfSilithyst,
      spellVuln: wcf.defaults.spellVuln,
      stormStrike: wcf.defaults.stormStrike
    };
  },
  methods: {
    onChange(event) {
      switch (event.target.value) {
        case "Starfire Rank 1":
          this.spellDamageType = "Arcane";
          this.spellBaseDamage = 99.5;
          this.spellCoefficient = 1.0;
          this.spellCastTime = 3;
          this.spellPenetration = 75;
          break;
        case "Starfire Rank 2":
          this.spellDamageType = "Arcane";
          this.spellBaseDamage = 152.5;
          this.spellCoefficient = 1.0;
          this.spellCastTime = 3;
          this.spellPenetration = 75;
          break;
        case "Starfire Rank 3":
          this.spellDamageType = "Arcane";
          this.spellBaseDamage = 221.5;
          this.spellCoefficient = 1.0;
          this.spellCastTime = 3;
          this.spellPenetration = 75;
          break;
        case "Starfire Rank 4":
          this.spellDamageType = "Arcane";
          this.spellBaseDamage = 307.5;
          this.spellCoefficient = 1.0;
          this.spellCastTime = 3;
          this.spellPenetration = 75;
          break;
        case "Starfire Rank 5":
          this.spellDamageType = "Arcane";
          this.spellBaseDamage = 395.5;
          this.spellCoefficient = 1.0;
          this.spellCastTime = 3;
          this.spellPenetration = 75;
          break;
        case "Starfire Rank 6":
          this.spellDamageType = "Arcane";
          this.spellBaseDamage = 488.5;
          this.spellCoefficient = 1.0;
          this.spellCastTime = 3;
          this.spellPenetration = 75;
          break;
        case "Starfire Rank 7":
          this.spellDamageType = "Arcane";
          this.spellBaseDamage = 540.5;
          this.spellCoefficient = 1.0;
          this.spellCastTime = 3;
          this.spellPenetration = 75;
          break;
        case "Wrath Rank 1":
          this.spellDamageType = "Nature";
          this.spellBaseDamage = 13.5;
          this.spellCoefficient = 0.5714;
          this.spellCastTime = 2;
          this.spellPenetration = 0;
          break;
        case "Wrath Rank 2":
          this.spellDamageType = "Nature";
          this.spellBaseDamage = 27.5;
          this.spellCoefficient = 0.5714;
          this.spellCastTime = 2;
          this.spellPenetration = 0;
          break;
        case "Wrath Rank 3":
          this.spellDamageType = "Nature";
          this.spellBaseDamage = 48.5;
          this.spellCoefficient = 0.5714;
          this.spellCastTime = 2;
          this.spellPenetration = 0;
          break;
        case "Wrath Rank 4":
          this.spellDamageType = "Nature";
          this.spellBaseDamage = 68.5;
          this.spellCoefficient = 0.5714;
          this.spellCastTime = 2;
          this.spellPenetration = 0;
          break;
        case "Wrath Rank 5":
          this.spellDamageType = "Nature";
          this.spellBaseDamage = 108.5;
          this.spellCoefficient = 0.5714;
          this.spellCastTime = 2;
          this.spellPenetration = 0;
          break;
        case "Wrath Rank 6":
          this.spellDamageType = "Nature";
          this.spellBaseDamage = 148.5;
          this.spellCoefficient = 0.5714;
          this.spellCastTime = 2;
          this.spellPenetration = 0;
          break;
        case "Wrath Rank 7":
          this.spellDamageType = "Nature";
          this.spellBaseDamage = 199.5;
          this.spellCoefficient = 0.5714;
          this.spellCastTime = 2;
          this.spellPenetration = 0;
          break;
        case "Wrath Rank 8":
          this.spellDamageType = "Nature";
          this.spellBaseDamage = 250.5;
          this.spellCoefficient = 0.5714;
          this.spellCastTime = 2;
          this.spellPenetration = 0;
          break;
      }
    }
  },
  computed: {
    /*
    gearListHeads: function() {
      return gearJSON.filter((gearItem) => {
        return gearItem['Equipment Type'] === 'Head';
      })
    },
    gearListNecks: function() {
      return gearJSON.filter((gearItem) => {
        return gearItem['Equipment Type'] === 'Neck';
      })
    },
    */
    spellDPS: function() {
      console.log(
        "spellPowerToDamage: " +
          wcf.spellPowerToDamage(
            this.spellName,
            parseFloat(this.spellCoefficient),
            parseFloat(this.spellCastTime),
            parseFloat(this.spellCrit),
            parseFloat(this.spellHit),
            parseFloat(this.improvedWrathPoints),
            this.naturesGrace
          )
      );

      console.log(
        "spellCritToDamage: " +
          wcf.spellCritToDamage(
            this.spellName,
            parseFloat(this.spellBaseDamage),
            parseFloat(this.spellCoefficient),
            parseFloat(this.spellCastTime),
            parseFloat(this.spellPower),
            parseFloat(this.spellCrit),
            parseFloat(this.spellHit),
            parseFloat(this.spellPenetration),
            parseFloat(this.enemySpellResistance),
            parseFloat(this.vengeancePoints),
            parseFloat(this.moonFuryPoints),
            parseFloat(this.improvedWrathPoints),
            this.naturesGrace,
            this.curseOfShadow,
            this.powerInfusion,
            this.saygesDarkFortune,
            this.tracesOfSilithyst,
            this.spellVuln,
            this.stormStrike
          )
      );

      console.log(
        "spellHitToDamage: " +
          wcf.spellHitToDamage(
            this.spellName,
            parseFloat(this.spellBaseDamage),
            parseFloat(this.spellCoefficient),
            parseFloat(this.spellCastTime),
            parseFloat(this.spellPower),
            parseFloat(this.spellCrit),
            parseFloat(this.spellHit),
            parseFloat(this.spellPenetration),
            parseFloat(this.enemySpellResistance),
            parseFloat(this.vengeancePoints),
            parseFloat(this.moonFuryPoints),
            parseFloat(this.improvedWrathPoints),
            this.naturesGrace,
            this.curseOfShadow,
            this.powerInfusion,
            this.saygesDarkFortune,
            this.tracesOfSilithyst,
            this.spellVuln,
            this.stormStrike
          )
      );

      return wcf.spellDPS(
        this.spellName,
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        parseFloat(this.spellPenetration),
        parseFloat(this.enemySpellResistance),
        parseFloat(this.vengeancePoints),
        parseFloat(this.moonFuryPoints),
        parseFloat(this.improvedWrathPoints),
        this.naturesGrace,
        this.curseOfShadow,
        this.powerInfusion,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    },
    moonFuryBonus: function() {
      return wcf.moonFuryBonus(this.spellName, parseFloat(this.moonFuryPoints));
    },
    spellCritBonus: function() {
      return wcf.spellCritBonus(
        this.spellName,
        parseFloat(this.vengeancePoints)
      );
    },
    spellAverageNonCrit: function() {
      return wcf.spellAverageNonCrit(
        this.spellName,
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellPower),
        parseFloat(this.moonFuryPoints)
      );
    },
    spellEffectiveCastTime: function() {
      return wcf.spellEffectiveCastTime(
        this.spellName,
        parseFloat(this.spellCastTime),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        parseFloat(this.improvedWrathPoints),
        this.naturesGrace
      );
    },
    spellPartialResistLossAverage: function() {
      return wcf.spellPartialResistLossAverage(
        this.spellName,
        parseFloat(this.spellPenetration),
        parseFloat(this.enemySpellResistance)
      );
    },
    spellChanceToMiss: function() {
      return wcf.spellChanceToMiss(parseFloat(this.spellHit));
    },
    spellChanceToRegularHit: function() {
      return wcf.spellChanceToRegularHit(
        parseFloat(this.spellCrit, this.spellHit),
        parseFloat(this.spellHit)
      );
    },
    spellChanceToCrit: function() {
      return wcf.spellChanceToCrit(
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit)
      );
    },
    spellPowerToDamage: function() {
      return wcf.spellPowerToDamage(
        this.spellName,
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        parseFloat(this.improvedWrathPoints),
        this.naturesGrace
      );
    },
    spellCritToDamage: function() {
      return wcf.spellCritToDamage(
        this.spellName,
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        parseFloat(this.spellPenetration),
        parseFloat(this.enemySpellResistance),
        parseFloat(this.vengeancePoints),
        parseFloat(this.moonFuryPoints),
        parseFloat(this.improvedWrathPoints),
        this.naturesGrace,
        this.curseOfShadow,
        this.powerInfusion,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    },
    spellHitToDamage: function() {
      return wcf.spellHitToDamage(
        this.spellName,
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        parseFloat(this.spellPenetration),
        parseFloat(this.enemySpellResistance),
        parseFloat(this.vengeancePoints),
        parseFloat(this.moonFuryPoints),
        parseFloat(this.improvedWrathPoints),
        this.naturesGrace,
        this.curseOfShadow,
        this.powerInfusion,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    }
  }
};
</script>
