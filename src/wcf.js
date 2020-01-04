var wcf = {
  globals: {
    /* constant values that can't be overridden in the app */
    globalCoolDown: 1.5,
    hitCap: 17,
    spellCastTimeHumanFactor: 0.05,
    naturesGraceReduction: 0.5,
    curseOfShadowBonus: 1.1,
    powerInfusionBonus: 1.2,
    saygesDarkFortuneBonus: 1.1,
    tracesOfSilithystBonus: 1.05,
    spellVulnBonus: 1.15,
    stormStrikeBonus: 1.2
  },
  defaults: {
    /* default values that can be changed in the app */
    spellBaseDamage: 488.5,
    spellCoefficient: 1.0,
    spellCastTime: 3.0,
    spellPower: 684,
    spellCrit: 30.785,
    spellHit: 2,
    enemySpellResistance: 75,
    spellPenetration: 75,
    moonFuryPoints: 5,
    vengeancePoints: 5,
    naturesGrace: true,
    curseOfShadow: true,
    powerInfusion: false,
    saygesDarkFortune: false,
    tracesOfSilithyst: false,
    spellVuln: false,
    stormStrike: false
  },
  spellCritBonus: function(vengeancePoints) {
    switch (vengeancePoints) {
      case 1:
        return 1.6; // rank 1: Increases the critical strike damage bonus by 20%
      case 2:
        return 1.7; // rank 2: Increases the critical strike damage bonus by 40%
      case 3:
        return 1.8; // rank 3: Increases the critical strike damage bonus by 60%
      case 4:
        return 1.9; // rank 4: Increases the critical strike damage bonus by 80%
      case 5:
        return 2; // rank 5: Increases the critical strike damage bonus by 100%
      default:
        return 1.5;
    }
  },
  moonFuryBonus: function(moonFuryPoints) {
    switch (moonFuryPoints) {
      case 1:
        return 1.02; // rank 1: 2% bonus
      case 2:
        return 1.04; // rank 2: 4% bonus
      case 3:
        return 1.06; // rank 3: 6% bonus
      case 4:
        return 1.08; // rank 4: 8% bonus
      case 5:
        return 1.1; // rank 5: 10% bonus
      default:
        return 1.0; // rank 0: 0% bonus
    }
  },
  naturesGraceBonus: function(naturesGrace) {
    if (naturesGrace) {
      return this.globals.naturesGraceReduction;
    }
    return 0;
  },
  spellMultiplicativeBonuses: function(
    spellPenetration,
    enemySpellResistance,
    curseOfShadow,
    powerInfusion,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    return (
      (curseOfShadow ? this.globals.curseOfShadowBonus : 1.0) *
      (powerInfusion ? this.globals.powerInfusionBonus : 1.0) *
      (saygesDarkFortune ? this.globals.saygesDarkFortuneBonus : 1.0) *
      (tracesOfSilithyst ? this.globals.tracesOfSilithystBonus : 1.0) *
      (spellVuln ? this.globals.spellVulnBonus : 1.0) *
      (stormStrike ? this.globals.stormStrikeBonus : 1.0) *
      (1 -
        this.spellPartialResistLossAverage(
          spellPenetration,
          enemySpellResistance
        ))
    );
  },
  spellPowerToDamage: function(
    spellCoefficient,
    spellCastTime,
    spellCrit,
    spellHit,
    naturesGrace
  ) {
    // v1 dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
    // v2 dc(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
    // [beefbroc] v3 c(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
    var x = spellCoefficient * (0.83 + spellHit / 100) * (1 + spellCrit / 100);
    var y =
      spellCastTime -
      this.naturesGraceBonus(naturesGrace) *
        (0.83 + spellHit / 100) *
        (spellCrit / 100);
    return x / y;
  },
  spellCritToDamage: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    spellCrit,
    spellHit,
    spellPenetration,
    enemySpellResistance,
    vengeancePoints,
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    powerInfusion,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    //v1 d(83+H)(mB+cP)(xT-t(0.83+H/100))/(100T-t(0.83+H/100)R)^2
    //v2 d(83+H)(mB+cP) * (xT+t(0.83+H/100)) / (100T-t(0.83+H/100)R)^2
    var d = this.spellMultiplicativeBonuses(
      spellPenetration,
      enemySpellResistance,
      curseOfShadow,
      powerInfusion,
      saygesDarkFortune,
      tracesOfSilithyst,
      spellVuln,
      stormStrike
    );

    return (
      (d *
        (83 + spellHit) *
        (this.moonFuryBonus(moonFuryPoints) * spellBaseDamage +
          spellCoefficient * spellPower) *
        ((this.spellCritBonus(vengeancePoints) - 1) * spellCastTime +
          this.naturesGraceBonus(naturesGrace) * (0.83 + spellHit / 100))) /
      (100 * spellCastTime -
        this.naturesGraceBonus(naturesGrace) *
          (0.83 + spellHit / 100) *
          spellCrit) **
        2
    );
  },
  spellHitToDamage: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    spellCrit,
    spellHit,
    spellPenetration,
    enemySpellResistance,
    vengeancePoints,
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    powerInfusion,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // v1 d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
    var d = this.spellMultiplicativeBonuses(
      spellPenetration,
      enemySpellResistance,
      curseOfShadow,
      powerInfusion,
      saygesDarkFortune,
      tracesOfSilithyst,
      spellVuln,
      stormStrike
    );

    return (
      (d *
        (this.moonFuryBonus(moonFuryPoints) * spellBaseDamage +
          spellCoefficient * spellPower) *
        (100 + (this.spellCritBonus(vengeancePoints) - 1) * spellCrit) *
        (100 ** 2 * spellCastTime)) /
      (100 ** 2 * spellCastTime -
        this.naturesGraceBonus(naturesGrace) * (83 + spellHit) * spellCrit) **
        2
    );
  },
  spellChanceToMiss: function(spellHit) {
    return 100 - (83 + Math.min(spellHit, this.globals.hitCap - 1));
  },
  spellChanceToRegularHit: function(spellCrit, spellHit) {
    return (
      100 -
      this.spellChanceToMiss(spellHit) -
      this.spellChanceToCrit(spellCrit, spellHit)
    );
  },
  spellChanceToCrit: function(spellCrit, spellHit) {
    return (1.8 + spellCrit) * ((100 - this.spellChanceToMiss(spellHit)) / 100);
  },
  spellAverageNonCrit: function(
    spellBaseDamage,
    spellCoefficient,
    spellPower,
    moonFuryPoints
  ) {
    return (
      spellBaseDamage * this.moonFuryBonus(moonFuryPoints) +
      spellPower * spellCoefficient
    );
  },
  spellEffectiveCastTime: function(
    spellCastTime,
    spellCrit,
    spellHit,
    naturesGrace
  ) {
    var x =
      spellCastTime -
      this.naturesGraceBonus(naturesGrace) *
        (this.spellChanceToCrit(spellCrit, spellHit) / 100) +
      this.globals.spellCastTimeHumanFactor;
    return Math.max(x, this.globals.globalCoolDown);
  },
  spellPartialResistLossAverage: function(
    spellPenetration,
    enemySpellResistance
  ) {
    var br1 = Math.min(enemySpellResistance, 276);
    var br2 = Math.min(spellPenetration, br1);
    return ((br1 - br2 + 24) / 300) * 0.75;
  },
  spellDPS: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    spellCrit,
    spellHit,
    spellPenetration,
    enemySpellResistance,
    vengeancePoints,
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    powerInfusion,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // =(($H$9*$H$13*$I$9+$H$9*$H$16)/100) / $I$18*$D$22*$D$23*$D$24*$D$25*$D$26*$D$27*(1-$H$20)
    var sanc = this.spellAverageNonCrit(
      spellBaseDamage,
      spellCoefficient,
      spellPower,
      moonFuryPoints
    );
    var sctc = this.spellChanceToCrit(spellCrit, spellHit);
    var vb = this.spellCritBonus(vengeancePoints);
    var sctrh = this.spellChanceToRegularHit(spellCrit, spellHit);
    var sect = this.spellEffectiveCastTime(
      spellCastTime,
      spellCrit,
      spellHit,
      naturesGrace
    );
    var d = this.spellMultiplicativeBonuses(
      spellPenetration,
      enemySpellResistance,
      curseOfShadow,
      powerInfusion,
      saygesDarkFortune,
      tracesOfSilithyst,
      spellVuln,
      stormStrike
    );
    var x = ((sanc * sctc * vb + sanc * sctrh) / 100 / sect) * d;
    return x;
  }
};

module.exports = wcf;
