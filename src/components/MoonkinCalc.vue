<template>
<div>
<section class="hero is-dark">
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
<section class="section">
  <div class="container is-fluid">
  <div class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child box">
      <div class="content">
      <div class="input_fields">
        <label class="input-box">
          <div>Spell Base Damage:</div>
          <input class="input" type="number" v-model="spellBaseDamage" />
        </label>
        <label class="input-box">
          <div>Spell Cast Time:</div>
          <input class="input" type="number" v-model="spellCastTime" />
        </label>
        <label class="input-box">
          <div>Spell Coefficient:</div>
          <input
            class="input"
            type="number"
            v-model="spellCoefficient"
          />
        </label>
        <label class="input-box">
          <div>Spell Power:</div>
          <input class="input" type="number" v-model="spellPower" />
        </label>

        <label class="input-box">
          <div>Spell Hit:</div>
          <input class="input" type="number" v-model="spellHit" />
        </label>
        <label class="input-box">
          <div>Spell Crit:</div>
          <input class="input" type="number" v-model="spellCrit" />
        </label>
        <label class="input-box">
          <input type="checkbox" v-model="moonFury" />Moonfury
        </label>
        <label class="input-box">
          <input type="checkbox" v-model="vengeance" />Vengeance
        </label>
        <label class="input-box">
          <input type="checkbox" v-model="curseOfShadow" />Curse of Shadow
        </label>
        <label class="input-box">
          <input type="checkbox" v-model="saygesDarkFortune" />Sayge's Dark
          Fortune of Damage
        </label>
        <label class="input-box">
          <input type="checkbox" v-model="tracesOfSilithyst" />Traces of
          Silithyst
        </label>
        <label class="input-box">
          <input type="checkbox" v-model="spellVuln" />Spell Vulnerability
        </label>
        <label class="input-box">
          <input type="checkbox" v-model="stormStrike" />Storm Strike
        </label>
      </div>
      </div>
      </article>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child box">
        <p class="subtitle">Classic Balance Druid v1.3</p>
      <div class="content">
      <p>Spell Power To Damage: {{ spellPowerToDamage }}</p>
      <p>Spell Crit To Damage: {{ spellCritToDamage }}</p>
      <p>Spell Hit To Damage: {{ spellHitToDamage }}</p>
      <p>
        Spell Crit To Spell Power:
        {{ spellCritToDamage / spellPowerToDamage }}
      </p>
      <p>
        Spell Hit To Spell Power:
        {{ spellHitToDamage / spellPowerToDamage }}
      </p>
      <p>Spell chance to miss: {{ spellChanceToMiss }}</p>
      <p>Spell chance to crit: {{ spellChanceToCrit }}</p>
      <p>Spell chance to hit (normal): {{ spellChanceToHit }}</p>
      </div>
      </article>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child box">
      <p class="subtitle">Balor</p>
      <div class="content">
      <p>Spell Power To Damage: {{ balorSpellPowerToDamage }}</p>
      <p>Spell Crit To Damage: {{ balorSpellCritToDamage }}</p>
      <p>Spell Hit To Damage: {{ balorSpellHitToDamage }}</p>
      <p>Spell Crit To Spell Power: {{ balorSpellCritToSpellPower }}</p>
      <p>Spell Hit To Spell Power: {{ balorSpellHitToSpellPower }}</p>
      <p>DPS: {{ balorDPS }}</p>
      </div>
      </article>
    </div>
  </div>
  </div>
  </section>
  <footer class="footer">
  <div class="content has-text-centered">
    <p>Discord: Beef Broccoli#5067</p>
    <p>Based on Keftenk's <a href="https://forum.classicwow.live/topic/726/by-the-great-winds-i-come-classic-balance-druid-theorycraft-spreadsheet-v1-3">Classic Balance Druid spreadsheet</a></p>
  </div>
</footer>
  </div>
</template>

<style scoped lang="scss">


article {
  //background: #1e1e22;
  //color: #fff;
  text-align: center;
}

/*
.input {
  width: 100%;
  height: 35px;
  padding-left: 15px;
  border: none;
  border-radius: 8px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
*/

.input_fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  margin: 1rem 0;
}
</style>

<script>
var wcf = require("../wcf.js");

export default {
  name: "MoonkinCalc",
  data() {
    return {
      rotationFactor: wcf.defaults.rotationFactor, // TODO: Something to do with starfire vs wrath
      spellBaseDamage: wcf.defaults.spellBaseDamage,
      spellCoefficient: wcf.defaults.spellCoefficient,
      spellCastTime: wcf.defaults.spellCastTime,
      spellPower: wcf.defaults.spellPower,
      spellCrit: wcf.defaults.spellCrit,
      spellHit: wcf.defaults.spellHit,
      vengeance: wcf.defaults.vengeance, // Rank 5: Increases the critical strike damage bonus by 100%
      moonFury: wcf.defaults.moonFury, // Rank 5: Increases the damage done by your Starfire, Moonfire and Wrath spells by 10%.
      curseOfShadow: wcf.defaults.curseOfShadow,
      powerInfusion: wcf.defaults.powerInfusion,
      saygesDarkFortune: wcf.defaults.saygesDarkFortune,
      tracesOfSilithyst: wcf.defaults.tracesOfSilithyst,
      spellVuln: wcf.defaults.spellVuln,
      stormStrike: wcf.defaults.stormStrike
    };
  },
  computed: {
    spellChanceToHit: function() {
      return wcf.spellChanceToHit(parseFloat(this.spellCrit, this.spellHit), parseFloat(this.spellHit));
    },
    spellChanceToMiss: function() {
      return wcf.spellChanceToMiss(parseFloat(this.spellHit));
    },
    spellChanceToCrit: function() {
      return wcf.spellChanceToCrit(parseFloat(this.spellCrit), parseFloat(this.spellHit));
    },
    spellPowerToDamage: function() {
      return wcf.spellPowerToDamage(
        parseFloat(this.spellCastTime),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit)
      );
    },
    spellCritToDamage: function() {
      return wcf.spellCritToDamage(
        parseFloat(this.rotationFactor),
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        this.moonFury,
        this.curseOfShadow,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    },
    spellHitToDamage: function() {
      return wcf.spellHitToDamage(
        parseFloat(this.rotationFactor),
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        this.moonFury,
        this.curseOfShadow,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    },
    balorSpellPowerToDamage: function() {
      return wcf.balorSpellPowerToDamage(
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        this.curseOfShadow
      );
    },
    balorSpellCritToDamage: function() {
      return wcf.balorSpellCritToDamage(
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        this.moonFury,
        this.curseOfShadow,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    },
    balorSpellHitToDamage: function() {
      return wcf.balorSpellHitToDamage(
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        this.moonFury,
        this.curseOfShadow,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    },
    balorSpellCritToSpellPower: function() {
      return wcf.balorSpellCritToSpellPower(
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        this.moonFury,
        this.curseOfShadow,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    },
    balorSpellHitToSpellPower: function() {
      return wcf.balorSpellHitToSpellPower(
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        this.moonFury,
        this.curseOfShadow,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    },
    balorDPS: function() {
      return wcf.balorDPS(
        parseFloat(this.spellBaseDamage),
        parseFloat(this.spellCoefficient),
        parseFloat(this.spellCastTime),
        parseFloat(this.spellPower),
        parseFloat(this.spellCrit),
        parseFloat(this.spellHit),
        this.moonFury,
        this.curseOfShadow,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    }
  }
};
</script>
