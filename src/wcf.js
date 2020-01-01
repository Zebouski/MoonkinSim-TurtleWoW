/* TODO: Things that are weird or I don't understand yet...
  - replace any hardcoded values
    - what is 83?
  - probably should make use of spellEffectiveCastTime across all functions
  - talents
    - vengeance isn't factored in consistantly across all functions
*/

var wcf = {
  globals: {
    globalCoolDown: process.env.GLOBALCOOLDOWN
      ? parseFloat(process.env.GLOBALCOOLDOWN)
      : 1.5,
    hitCap: process.env.HITCAP ? parseFloat(process.env.HITCAP) : 17,
    naturesGraceReduction: process.env.NATURESGRACEREDUCTION
      ? parseFloat(process.env.NATURESGRACEREDUCTION)
      : 0.5,
    critMultiplier: process.env.CRITMULTIPLIER
      ? parseFloat(process.env.CRITMULTIPLIER)
      : 2.0,
    curseOfShadowBonus: process.env.CURSEOFSHADOWSBONUS
      ? parseFloat(process.env.CURSEOFSHADOWSBONUS)
      : 1.1,
    powerInfusionBonus: process.env.POWERINFUSIONBONUS
      ? parseFloat(process.env.POWERINFUSIONBONUS)
      : 1.2,
    saygesDarkFortuneBonus: process.env.SAYGESDARKFORTUNEBONUS
      ? parseFloat(process.env.SAYGESDARKFORTUNEBONUS)
      : 1.1,
    tracesOfSilithystBonus: process.env.TRACESOFSILITHYSTBONUS
      ? parseFloat(process.env.TRACESOFSILITHYSTBONUS)
      : 1.05,
    spellVulnBonus: process.env.TRACESOFSILITHYSTBONUS
      ? parseFloat(process.env.TRACESOFSILITHYSTBONUS)
      : 1.15,
    stormStrikeBonus: process.env.STORMSTRIKEBONUS
      ? parseFloat(process.env.STORMSTRIKEBONUS)
      : 1.2
  },
  defaults: {
    spellBaseDamage: process.env.SPELLBASEDAMAGE
      ? parseFloat(process.env.SPELLBASEDAMAGE)
      : 488.5,
    spellCoefficient: process.env.SPELLCOEFFICIENT
      ? parseFloat(process.env.SPELLCOEFFICIENT)
      : 1.0,
    spellCastTime: process.env.SPELLCASTTIME
      ? parseFloat(process.env.SPELLCASTTIME)
      : 3.0,
    spellPower: process.env.SPELLPOWER
      ? parseFloat(process.env.SPELLPOWER)
      : 684,
    spellCrit: process.env.SPELLCRIT ? parseFloat(process.env.SPELLCRIT) : 26,
    spellHit: process.env.SPELLHIT ? parseFloat(process.env.SPELLHIT) : 2,
    enemySpellResistance: process.env.ENEMYSPELLRESISTANCE
      ? parseFloat(process.env.ENEMYRESISTANCE)
      : 75,
    spellPenetration: process.env.SPELLPENETRATION
      ? parseFloat(process.env.SPELLPENETRATION)
      : 75,
    moonFuryPoints: process.env.MOONFURYPOINTS
      ? parseFloat(process.env.MOONFURYPOINTS)
      : 5,
    vengeancePoints: process.env.VENGEANCEPOINTS
      ? parseFloat(process.env.VENGEANCEPOINTS)
      : 5,
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
        return 1.6;
      case 2:
        return 1.7;
      case 3:
        return 1.8;
      case 4:
        return 1.9;
      case 5:
        return 2;
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
    // IF(CharRotation="Wrath",1.5,3-(0.5*($H$13/100)))
    var x =
      spellCastTime -
      this.naturesGraceBonus(naturesGrace) *
        (this.spellChanceToCrit(spellCrit, spellHit) / 100);
    return Math.max(x, this.globals.globalCoolDown);
  },
  spellPartialResistLossAverage: function(
    spellPenetration,
    enemySpellResistance
  ) {
    // =($E$19-$E$20+24)/300*0.75
    //E19 = Boss Resist =MIN($D$19,276)
    //E20 = Boss Resist2 =MIN($D$18,$E$19)
    //D18 = Spell Penetration =Character!$H$38
    //D19 = Boss Resist Input =75

    var br1 = Math.min(enemySpellResistance, 276);
    var br2 = Math.min(spellPenetration, br1);
    return ((br1 - br2 + 24) / 300) * 0.75;
  },
  spellPowerToDamage: function(
    spellCastTime,
    spellCrit,
    spellHit,
    naturesGrace
  ) {
    return (
      ((1 + spellCrit / 100) * (1 - (this.globals.hitCap - spellHit) / 100)) /
      (spellCastTime - (this.naturesGraceBonus(naturesGrace) * spellCrit) / 100)
    );
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
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    powerInfusion,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    return (
      (((spellBaseDamage * this.moonFuryBonus(moonFuryPoints) +
        spellPower * spellCoefficient) *
        (1 / 100) *
        (1 - (this.globals.hitCap - spellHit) / 100)) /
        (spellCastTime -
          (this.naturesGraceBonus(naturesGrace) * spellCrit) / 100)) *
      this.spellMultiplicativeBonuses(
        spellPenetration,
        enemySpellResistance,
        curseOfShadow,
        powerInfusion,
        saygesDarkFortune,
        tracesOfSilithyst,
        spellVuln,
        stormStrike
      )
    );
  },
  spellHitToDamage: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    spellCrit,
    spellPenetration,
    enemySpellResistance,
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    powerInfusion,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    return (
      (((spellBaseDamage * this.moonFuryBonus(moonFuryPoints) +
        spellPower * spellCoefficient) *
        (1 + spellCrit / 100) *
        (1 / 100)) /
        (spellCastTime -
          (this.naturesGraceBonus(naturesGrace) * spellCrit) / 100)) *
      this.spellMultiplicativeBonuses(
        spellPenetration,
        enemySpellResistance,
        curseOfShadow,
        powerInfusion,
        saygesDarkFortune,
        tracesOfSilithyst,
        spellVuln,
        stormStrike
      )
    );
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
  },
  /*    
    B = spellBaseDamage
    c = spellCoefficient
    P = spellPower
    x = critMultiplier
    R = spellCrit
    T = spellCastTime
    t = naturesGraceReduction
    d = totalDebuffBonus (e.g. curse of shadows)
    m = totalBaseDamageBonus (e.g. moonfury)
    H = spellHit
  */
  balorSpellPowerToDamage: function(
    spellCoefficient,
    spellCastTime,
    spellCrit,
    spellHit,
    naturesGrace,
  ) {
    // v1 dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
    // v2 dc(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
    // [beefbroc] v3 c(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
    var x =
      spellCoefficient * (0.83 + spellHit / 100) * (1 + spellCrit / 100);
    var y =
      spellCastTime -
      this.naturesGraceBonus(naturesGrace) *
        (0.83 + spellHit / 100) *
        (spellCrit / 100);
    return x / y;
  },
  balorSpellCritToDamage: function(
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
  balorSpellHitToDamage: function(
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
  balorDPS: function(
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
    // v1 DPS = d(0.83 + H/100)(mB +cP)(1 + xR/100) / (T - t(0.83+H/100)(R/100))
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
        (0.83 + spellHit / 100) *
        (this.moonFuryBonus(moonFuryPoints) * spellBaseDamage +
          spellCoefficient * spellPower) *
        (1 + ((this.spellCritBonus(vengeancePoints) - 1) * spellCrit) / 100)) /
      (spellCastTime -
        this.naturesGraceBonus(naturesGrace) *
          (0.83 + spellHit / 100) *
          (spellCrit / 100))
    );
  }
};

module.exports = wcf;
