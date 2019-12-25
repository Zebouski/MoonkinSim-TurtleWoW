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
          <div>Hit Cap:</div>
          <input class="form-styling" type="number" v-model="hitCap" />
        </label>
        <label class="input-box">
          <div>Crit Multiplier:</div>
          <input class="form-styling" type="number" v-model="critMultiplier" />
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
export default {
  name: "MoonkinCalc",
  data() {
    return {
      spellBaseDamage: 488.5,
      spellCoefficient: 1.0,
      spellCastTime: 3.0,
      naturesGraceReduction: 0.5,
      critMultiplier: 2,
      hitCap: 17,
      rotationFactor: 1.0, // TODO: Something to do with starfire vs wrath
      spellPower: 684,
      hitRating: 2,
      critRating: 26,
      vengeance: true, // Rank 5: Increases the critical strike damage bonus by 100%
      vengeanceBonus: 1,
      moonFury: true, // Rank 5: Increases the damage done by your Starfire, Moonfire and Wrath spells by 10%.
      moonFuryBonus: 1.1,
      curseOfShadow: false,
      curseOfShadowBonus: 1.1,
      powerInfusion: false,
      powerInfusionBonus: 1.1, //todo
      saygesDarkFortune: false,
      saygesDarkFortuneBonus: 1.1, //todo
      tracesOfSilithyst: false,
      tracesOfSilithystBonus: 1.1, //todo
      spellVuln: false,
      spellVulnBonus: 1.1, //todo
      stormStrike: false,
      stormStrikeBonus: 1.1
    };
  },
  computed: {
    spellPowerToDamage: function() {
      return (
        ((1 + this.critRating / 100) *
          //(this.vengeance ? this.vengeanceBonus + this.critRating / 100 : this.critRating / 100) *
          (1 - (this.hitCap - this.hitRating) / 100)) /
        (this.spellCastTime -
          (this.naturesGraceReduction * this.critRating) / 100)
      );
    },
    spellCritToDamage: function() {
      return (
        (((this.spellBaseDamage * (this.moonFury ? this.moonFuryBonus : 1.0) +
          this.spellPower * this.rotationFactor) *
          (1 / 100) *
          (1 - (this.hitCap - this.hitRating) / 100)) /
          (this.spellCastTime -
            (this.naturesGraceReduction * this.critRating) / 100)) *
        (this.curseOfShadow ? this.curseOfShadowBonus : 1.0) *
        (this.saygesDarkFortune ? this.saygesDarkFortuneBonus : 1.0) *
        (this.tracesOfSilithyst ? this.tracesOfSilithystBonus : 1.0) *
        (this.spellVuln ? this.spellVulnBonus : 1.0) *
        (this.stormStrike ? this.stormStrikeBonus : 1.0)
      );
    },
    spellHitToDamage: function() {
      return (
        (((this.spellBaseDamage * (this.moonFury ? this.moonFuryBonus : 1.0) +
          this.spellPower * this.rotationFactor) *
          //(this.vengeance ? this.vengeanceBonus + this.critRating / 100 : this.critRating / 100) *
          (1 + this.critRating / 100) *
          (1 / 100)) /
          (this.spellCastTime -
            (this.naturesGraceReduction * this.critRating) / 100)) *
        (this.curseOfShadow ? this.curseOfShadowBonus : 1.0) *
        (this.saygesDarkFortune ? this.saygesDarkFortuneBonus : 1.0) *
        (this.tracesOfSilithyst ? this.tracesOfSilithystBonus : 1.0) *
        (this.spellVuln ? this.spellVulnBonus : 1.0) *
        (this.stormStrike ? this.stormStrikeBonus : 1.0)
      );
    },
    /*    
    B = spellBaseDamage
    c = spellCoefficient
    P = spellPower
    x = critMultiplier
    R = critRating
    T = spellCastTime
    t = naturesGraceReduction
    d = totalDebuffBonus (e.g. curse of shadows)
    m = totalBaseDamageBonus (e.g. moonfury)
    H = hitRating
    */
    balorSpellPowerToDamage: function() {
      // v1 dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
      var d = this.curseOfShadow ? this.curseOfShadowBonus : 1.0;

      return (
        (d *
          this.spellCoefficient *
          (0.83 + this.hitRating / 100) *
          (1 + ((this.critMultiplier - 1) * this.hitRating) / 100)) /
        (this.spellCastTime -
          this.naturesGraceReduction *
            (0.83 + this.hitRating / 100) *
            (this.critRating / 100))
      );
    },
    balorSpellCritToDamage: function() {
      //v1 d(83+H)(mB+cP)(xT-t(0.83+H/100))/(100T-t(0.83+H/100)R)^2
      var d = this.curseOfShadow ? this.curseOfShadowBonus : 1.0;
      var m = this.moonFury ? this.moonFuryBonus : 1.0;

      return (
        (d *
          (83 + this.hitRating) *
          (m * this.spellBaseDamage + this.spellCoefficient * this.spellPower) *
          ((this.critMultiplier - 1) * this.spellCastTime -
            this.naturesGraceReduction * (0.83 + this.hitRating / 100))) /
        (100 * this.spellCastTime -
          this.naturesGraceReduction *
            (0.83 + this.hitRating / 100) *
            this.critRating) **
          2
      );
    },
    balorSpellHitToDamage: function() {
      // v1 d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
      var d = this.curseOfShadow ? this.curseOfShadowBonus : 1.0;
      var m = this.moonFury ? this.moonFuryBonus : 1.0;

      return (
        (d *
          (m * this.spellBaseDamage + this.spellCoefficient * this.spellPower) *
          (100 + (this.critMultiplier - 1) * this.critRating) *
          (100 ** 2 * this.spellCastTime)) /
        (100 ** 2 * this.spellCastTime -
          this.naturesGraceReduction *
            (83 + this.hitRating) *
            this.critRating) **
          2
      );
    },
    balorSpellCritToSpellPower: function() {
      // v1 Crit:Spellpower = x(B/c + P)/(100 + R)   *   (T + t/x)/(T - tR/100)
      // v2 Crit:Spellpower = x(B/c + P)/(100 +xR)   *   (T + t/x)/(T - tR/100)
      // v3 Crit:Spellpower = x(mB/c + P)/(100+xR)   *   (T + (0.83+H/100)t/x)/(T-(0.83+H/100)tR/100)
      var m = this.moonFury ? this.moonFuryBonus : 1.0;
      return (
        ((((this.critMultiplier - 1) *
          ((m * this.spellBaseDamage) / this.spellCoefficient +
            this.spellPower)) /
          (100 + (this.critMultiplier - 1) * this.critRating)) *
          (this.spellCastTime +
            ((0.83 + this.hitRating / 100) * this.naturesGraceReduction) /
              (this.critMultiplier - 1))) /
        (this.spellCastTime -
          ((0.83 + this.hitRating / 100) *
            this.naturesGraceReduction *
            this.critRating) /
            100)
      );
    },
    balorSpellHitToSpellPower: function() {
      // v1 Hit:Spellpower = (B/c + P)/(83 + H)
      // v2 Hit:SpellPower = (mB/c+P)/(83+H) * (100^2 T)/(100^2 T - t(83+H)R)
      var m = this.moonFury ? this.moonFuryBonus : 1.0;
      return (
        ((((m * this.spellBaseDamage) / this.spellCoefficient +
          this.spellPower) /
          (83 + this.hitRating)) *
          (100 ** 2 * this.spellCastTime)) /
        (100 ** 2 * this.spellCastTime -
          this.naturesGraceReduction * (83 + this.hitRating) * this.critRating)
      );
    },
    balorSpellHitToSpellPower2: function() {
      var m = this.moonFury ? this.moonFuryBonus : 1.0;
      // ((mB/c+P)(100^2 T)) / ((100^2 T - t(83+H)R)(83+H))
      return (
        (((m * this.spellBaseDamage) / this.spellCoefficient +
          this.spellPower) *
          (100 ** 2 * this.spellCastTime)) /
        ((100 ** 2 * this.spellCastTime -
          this.naturesGraceReduction *
            (83 + this.hitRating) *
            this.critRating) *
          (83 + this.hitRating))
      );
    },
    balorDPS: function() {
      // v1 DPS = d(0.83 + H/100)(mB +cP)(1 + xR/100) / (T - t(0.83+H/100)(R/100))
      var d = this.curseOfShadow ? this.curseOfShadowBonus : 1.0;
      var m = this.moonFury ? this.moonFuryBonus : 1.0;

      return (
        (d *
          (0.83 + this.hitRating / 100) *
          (m * this.spellBaseDamage + this.spellCoefficient * this.spellPower) *
          (1 + ((this.critMultiplier - 1) * this.critRating) / 100)) /
        (this.spellCastTime -
          this.naturesGraceReduction *
            (0.83 + this.hitRating / 100) *
            (this.critRating / 100))
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
