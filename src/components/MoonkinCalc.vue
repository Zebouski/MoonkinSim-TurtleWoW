<template>
  <div class="moonkincalc">
    <div class="box a">
      <div class="input_fields">
        <label class="input-box">
          <div>Spell Base Damage:</div>
          <input class="form-styling" type="number" v-model="spellBaseDamage" />
        </label>
        <label class="input-box">
          <div>Spell Cast Time:</div>
          <input class="form-styling" type="number" v-model="spellCastTime" />
        </label>
        <label class="input-box">
          <div>Spell Coefficient:</div>
          <input
            class="form-styling"
            type="number"
            v-model="spellCoefficient"
          />
        </label>
        <label class="input-box">
          <div>Spell Power:</div>
          <input class="form-styling" type="number" v-model="spellPower" />
        </label>

        <label class="input-box">
          <div>Hit Rating:</div>
          <input class="form-styling" type="number" v-model="hitRating" />
        </label>
        <label class="input-box">
          <div>Crit Rating:</div>
          <input class="form-styling" type="number" v-model="critRating" />
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
    <div class="box b">
      <p>Keftenk Spell Power To Damage: {{ spellPowerToDamage }}</p>
      <p>Keftenk Spell Crit To Damage: {{ spellCritToDamage }}</p>
      <p>Keftenk Spell Hit To Damage: {{ spellHitToDamage }}</p>
      <p>
        Keftenk Spell Crit To Spell Power:
        {{ spellCritToDamage / spellPowerToDamage }}
      </p>
      <p>
        Keftenk Spell Hit To Spell Power:
        {{ spellHitToDamage / spellPowerToDamage }}
      </p>
      <hr />
      <p>Balor Spell Power To Damage: {{ balorSpellPowerToDamage }}</p>
      <p>Balor Spell Crit To Damage: {{ balorSpellCritToDamage }}</p>
      <p>Balor Spell Hit To Damage: {{ balorSpellHitToDamage }}</p>
      <p>Balor Spell Crit To Spell Power: {{ balorSpellCritToSpellPower }}</p>
      <p>Balor Spell Hit To Spell Power: {{ balorSpellHitToSpellPower }}</p>
      <p>Balor Spell Hit To Spell Power2: {{ balorSpellHitToSpellPower2 }}</p>

      <p>Balor DPS: {{ balorDPS }}</p>
    </div>
  </div>
</template>

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
      critRating: wcf.defaults.critRating,
      hitRating: wcf.defaults.hitRating,
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
    spellPowerToDamage: function() {
      return wcf.spellPowerToDamage(
        this.spellCastTime,
        this.critRating,
        this.hitRating
      );
    },
    spellCritToDamage: function() {
      return wcf.spellCritToDamage(
        this.rotationFactor,
        this.spellBaseDamage,
        this.spellCastTime,
        this.spellPower,
        this.critRating,
        this.hitRating,
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
        this.rotationFactor,
        this.spellBaseDamage,
        this.spellCastTime,
        this.spellPower,
        this.critRating,
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
        this.spellCoefficient,
        this.spellCastTime,
        this.critRating,
        this.hitRating,
        this.curseOfShadow
      );
    },
    balorSpellCritToDamage: function() {
      return wcf.balorSpellCritToDamage(
        this.spellBaseDamage,
        this.spellCoefficient,
        this.spellCastTime,
        this.spellPower,
        this.critRating,
        this.hitRating,
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
        this.spellBaseDamage,
        this.spellCoefficient,
        this.spellCastTime,
        this.spellPower,
        this.critRating,
        this.hitRating,
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
        this.spellBaseDamage,
        this.spellCoefficient,
        this.spellCastTime,
        this.spellPower,
        this.critRating,
        this.hitRating,
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
        this.spellBaseDamage,
        this.spellCoefficient,
        this.spellCastTime,
        this.spellPower,
        this.critRating,
        this.hitRating,
        this.moonFury,
        this.curseOfShadow,
        this.saygesDarkFortune,
        this.tracesOfSilithyst,
        this.spellVuln,
        this.stormStrike
      );
    },
    balorSpellHitToSpellPower2: function() {
      return wcf.balorSpellHitToSpellPower2(
        this.spellBaseDamage,
        this.spellCoefficient,
        this.spellCastTime,
        this.spellPower,
        this.critRating,
        this.hitRating,
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
        this.spellBaseDamage,
        this.spellCoefficient,
        this.spellCastTime,
        this.spellPower,
        this.critRating,
        this.hitRating,
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

<style scoped lang="scss">
.moonkincalc {
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  place-items: center;
}

.form-styling {
  width: 100%;
  height: 35px;
  padding-left: 15px;
  border: none;
  border-radius: 8px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.box {
  max-width: 90%;
  margin: auto;
  background: #1e1e22;
  color: #fff;
}

.input_fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  margin: 1rem 0;
}
</style>
