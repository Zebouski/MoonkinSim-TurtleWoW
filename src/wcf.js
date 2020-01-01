/* TODO: Things that are weird or I don't understand yet...
  - replace any hardcoded values
    - what is 83?
  - rotationFactor? what is it.
  - probably should make use of spellEffectiveCastTime across all functions
  - talents
    X moonfury should be 0-5 points
    X vengeance should be 0-5 points
    - vengeance isn't factored in consistantly across all functions
    X natures grace should be on/off
    - critMultiplier should be handled all the same way
  - buffs
    - they're not factored in consistantly across all functions
    - power infusion in particular seems left out on some functions
  - debuffs
  - resistances
*/

var wcf = {
  globals: {
    globalCoolDown: process.env.GLOBALCOOLDOWN
      ? parseFloat(process.env.GLOBALCOOLDOWN)
      : 1.5,
    hitCap: process.env.HITCAP ? parseFloat(process.env.HITCAP) : 17,
    bossResistance: process.env.BOSSRESISTANCE
      ? parseFloat(process.env.BOSSRESISTANCE)
      : 75,
    spellPenetration: process.env.SPELLPENETRATION
      ? parseFloat(process.env.SPELLPENETRATION)
      : 75,
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
    rotationFactor: process.env.ROTATIONFACTOR
      ? parseFloat(process.env.ROTATIONFACTOR)
      : 1.0, // TODO: Something to do with starfire vs wrath
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
  vengeanceBonus: function(vengeancePoints) {
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
    rotationFactor,
    spellBaseDamage,
    spellPower,
    moonFuryPoints
  ) {
    return (
      spellBaseDamage * this.moonFuryBonus(moonFuryPoints) +
      spellPower * rotationFactor
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
  spellPartialResistLossAverage: function() {
    // =($E$19-$E$20+24)/300*0.75
    //E19 = Boss Resist =MIN($D$19,276)
    //E20 = Boss Resist2 =MIN($D$18,$E$19)
    //D18 = Spell Penetration =Character!$H$38
    //D19 = Boss Resist Input =75

    var br1 = Math.min(this.globals.bossResistance, 276);
    var br2 = Math.min(this.globals.spellPenetration, br1);
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
    rotationFactor,
    spellBaseDamage,
    spellCastTime,
    spellPower,
    spellCrit,
    spellHit,
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    return (
      (((spellBaseDamage * this.moonFuryBonus(moonFuryPoints) +
        spellPower * rotationFactor) *
        (1 / 100) *
        (1 - (this.globals.hitCap - spellHit) / 100)) /
        (spellCastTime -
          (this.naturesGraceBonus(naturesGrace) * spellCrit) / 100)) *
      (curseOfShadow ? this.globals.curseOfShadowBonus : 1.0) *
      (saygesDarkFortune ? this.globals.saygesDarkFortuneBonus : 1.0) *
      (tracesOfSilithyst ? this.globals.tracesOfSilithystBonus : 1.0) *
      (spellVuln ? this.globals.spellVulnBonus : 1.0) *
      (stormStrike ? this.globals.stormStrikeBonus : 1.0)
    );
  },
  spellHitToDamage: function(
    rotationFactor,
    spellBaseDamage,
    spellCastTime,
    spellPower,
    spellCrit,
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    return (
      (((spellBaseDamage * this.moonFuryBonus(moonFuryPoints) +
        spellPower * rotationFactor) *
        (1 + spellCrit / 100) *
        (1 / 100)) /
        (spellCastTime -
          (this.naturesGraceBonus(naturesGrace) * spellCrit) / 100)) *
      (curseOfShadow ? this.globals.curseOfShadowBonus : 1.0) *
      (saygesDarkFortune ? this.globals.saygesDarkFortuneBonus : 1.0) *
      (tracesOfSilithyst ? this.globals.tracesOfSilithystBonus : 1.0) *
      (spellVuln ? this.globals.spellVulnBonus : 1.0) *
      (stormStrike ? this.globals.stormStrikeBonus : 1.0)
    );
  },
  spellDPS: function(
    rotationFactor,
    spellBaseDamage,
    spellCastTime,
    spellPower,
    spellCrit,
    spellHit,
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
      rotationFactor,
      spellBaseDamage,
      spellPower,
      moonFuryPoints
    );
    var sctc = this.spellChanceToCrit(spellCrit, spellHit);
    var vb = this.vengeanceBonus(vengeancePoints);
    var sctrh = this.spellChanceToRegularHit(spellCrit, spellHit);
    var sect = this.spellEffectiveCastTime(
      spellCastTime,
      spellCrit,
      spellHit,
      naturesGrace
    );
    var sprla = this.spellPartialResistLossAverage();
    var m =
      (curseOfShadow ? this.globals.curseOfShadowBonus : 1.0) *
      (spellVuln ? this.globals.spellVulnBonus : 1.0) *
      (powerInfusion ? this.globals.powerInfusionBonus : 1.0) *
      (saygesDarkFortune ? this.globals.saygesDarkFortuneBonus : 1.0) *
      (tracesOfSilithyst ? this.globals.tracesOfSilithystBonus : 1.0) *
      (stormStrike ? this.globals.stormStrikeBonus : 1.0);

    var x = ((sanc * sctc * vb + sanc * sctrh) / 100 / sect) * m * (1 - sprla);
    return x;

    //var x = ((sanc * sctc * vb + sanc * sctrh) / 100);
    //var y = sect * m * (1-sprla);
    //return(x);
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
    curseOfShadow
  ) {
    // v1 dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
    // v2 dc(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
    var d = curseOfShadow ? this.globals.curseOfShadowBonus : 1.0;
    var x =
      d * spellCoefficient * (0.83 + spellHit / 100) * (1 + spellCrit / 100);
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
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    //v1 d(83+H)(mB+cP)(xT-t(0.83+H/100))/(100T-t(0.83+H/100)R)^2
    //v2 d(83+H)(mB+cP) * (xT+t(0.83+H/100)) / (100T-t(0.83+H/100)R)^2
    var d = curseOfShadow ? this.globals.curseOfShadowBonus : 1.0;

    return (
      (d *
        (83 + spellHit) *
        (this.moonFuryBonus(moonFuryPoints) * spellBaseDamage +
          spellCoefficient * spellPower) *
        ((this.globals.critMultiplier - 1) * spellCastTime +
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
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // v1 d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
    var d = curseOfShadow ? this.globals.curseOfShadowBonus : 1.0;

    return (
      (d *
        (this.moonFuryBonus(moonFuryPoints) * spellBaseDamage +
          spellCoefficient * spellPower) *
        (100 + (this.globals.critMultiplier - 1) * spellCrit) *
        (100 ** 2 * spellCastTime)) /
      (100 ** 2 * spellCastTime -
        this.naturesGraceBonus(naturesGrace) * (83 + spellHit) * spellCrit) **
        2
    );
  },
  balorSpellCritToSpellPower: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    spellCrit,
    spellHit,
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // v1 Crit:Spellpower = x(B/c + P)/(100 + R)   *   (T + t/x)/(T - tR/100)
    // v2 Crit:Spellpower = x(B/c + P)/(100 +xR)   *   (T + t/x)/(T - tR/100)
    // v3 Crit:Spellpower = x(mB/c + P)/(100+xR)   *   (T + (0.83+H/100)t/x)/(T-(0.83+H/100)tR/100)
    return (
      ((((this.globals.critMultiplier - 1) *
        ((this.moonFuryBonus(moonFuryPoints) * spellBaseDamage) /
          spellCoefficient +
          spellPower)) /
        (100 + (this.globals.critMultiplier - 1) * spellCrit)) *
        (spellCastTime +
          ((0.83 + spellHit / 100) * this.naturesGraceBonus(naturesGrace)) /
            (this.globals.critMultiplier - 1))) /
      (spellCastTime -
        ((0.83 + spellHit / 100) *
          this.naturesGraceBonus(naturesGrace) *
          spellCrit) /
          100)
    );
  },
  balorSpellHitToSpellPower: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    spellCrit,
    spellHit,
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // v1 Hit:Spellpower = (B/c + P)/(83 + H)
    // v2 Hit:SpellPower = (mB/c+P)/(83+H) * (100^2 T)/(100^2 T - t(83+H)R)
    return (
      ((((this.moonFuryBonus(moonFuryPoints) * spellBaseDamage) /
        spellCoefficient +
        spellPower) /
        (83 + spellHit)) *
        (100 ** 2 * spellCastTime)) /
      (100 ** 2 * spellCastTime -
        this.naturesGraceBonus(naturesGrace) * (83 + spellHit) * spellCrit)
    );
  },
  balorDPS: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    spellCrit,
    spellHit,
    moonFuryPoints,
    naturesGrace,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // v1 DPS = d(0.83 + H/100)(mB +cP)(1 + xR/100) / (T - t(0.83+H/100)(R/100))
    var d = curseOfShadow ? this.globals.curseOfShadowBonus : 1.0;

    return (
      (d *
        (0.83 + spellHit / 100) *
        (this.moonFuryBonus(moonFuryPoints) * spellBaseDamage +
          spellCoefficient * spellPower) *
        (1 + ((wcf.globals.critMultiplier - 1) * spellCrit) / 100)) /
      (spellCastTime -
        this.naturesGraceBonus(naturesGrace) *
          (0.83 + spellHit / 100) *
          (spellCrit / 100))
    );
  }
  /*
  test: function() {
    var xx = this.spellPowerToDamage(
      this.defaults.spellCastTime,
      this.defaults.spellCrit,
      this.defaults.spellHit
    );

    var yy = this.spellCritToDamage(
      this.defaults.rotationFactor,
      this.defaults.spellBaseDamage,
      this.defaults.spellCastTime,
      this.defaults.spellPower,
      this.defaults.spellCrit,
      this.defaults.spellHit,
      this.defaults.moonFury,
      this.defaults.curseOfShadow,
      this.defaults.saygesDarkFortune,
      this.defaults.tracesOfSilithyst,
      this.defaults.spellVuln,
      this.defaults.stormStrike
    );

    var zz = this.spellHitToDamage(
      this.defaults.rotationFactor,
      this.defaults.spellBaseDamage,
      this.defaults.spellCastTime,
      this.defaults.spellPower,
      this.defaults.spellCrit,
      this.defaults.moonFury,
      this.defaults.curseOfShadow,
      this.defaults.saygesDarkFortune,
      this.defaults.tracesOfSilithyst,
      this.defaults.spellVuln,
      this.defaults.stormStrike
    );

    console.log("spellPowerToDamage: " + xx);
    console.log("spellCritToDamage: " + yy);
    console.log("spellHitToDamage: " + zz);
    console.log("spellCritToSpellPower: " + yy / xx);
    console.log("spellHitToSpellPower: " + zz / xx);
  }
  */
};

module.exports = wcf;
