var wcf = {
  globals: {
    hitCap: process.env.HITCAP ? parseFloat(process.env.HITCAP) : 17,
    naturesGraceReduction: process.env.NATURESGRACEREDUCTION
      ? parseFloat(process.env.NATURESGRACEREDUCTION)
      : 0.5,
    critMultiplier: process.env.CRITMULTIPLIER
      ? parseFloat(process.env.CRITMULTIPLIER)
      : 2,
    moonFuryBonus: process.env.MOONFURYBONUS
      ? parseFloat(process.env.MOONFURYBONUS)
      : 1.1,
    vengeanceBonus: process.env.VENGEANCEBONUS
      ? parseFloat(process.env.VENGEANCEBONUS)
      : 1.0,
    powerInfusionBonus: process.env.POWERINFUSIONBONUS
      ? parseFloat(process.env.POWERINFUSIONBONUS)
      : 1.1, //todo
    curseOfShadowBonus: process.env.CURSEOFSHADOWSBONUS
      ? parseFloat(process.env.CURSEOFSHADOWSBONUS)
      : 1.1,
    saygesDarkFortuneBonus: process.env.SAYGESDARKFORTUNEBONUS
      ? parseFloat(process.env.SAYGESDARKFORTUNEBONUS)
      : 1.1, //todo
    tracesOfSilithystBonus: process.env.TRACESOFSILITHYSTBONUS
      ? parseFloat(process.env.TRACESOFSILITHYSTBONUS)
      : 1.1, //todo
    spellVulnBonus: process.env.TRACESOFSILITHYSTBONUS
      ? parseFloat(process.env.TRACESOFSILITHYSTBONUS)
      : 1.1, //todo
    stormStrikeBonus: process.env.STORMSTRIKEBONUS
      ? parseFloat(process.env.STORMSTRIKEBONUS)
      : 1.1
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
    critRating: process.env.CRITRATING
      ? parseFloat(process.env.CRITRATING)
      : 26,
    hitRating: process.env.HITRATING ? parseFloat(process.env.HITRATING) : 2,
    moonFury: true,
    vengeance: false,
    curseOfShadow: false,
    powerInfusion: false,
    saygesDarkFortune: false,
    tracesOfSilithyst: false,
    spellVuln: false,
    stormStrike: false
  },
  spellPowerToDamage: function(spellCastTime, critRating, hitRating) {
    return (
      ((1 + critRating / 100) * (1 - (this.globals.hitCap - hitRating) / 100)) /
      (spellCastTime - (this.globals.naturesGraceReduction * critRating) / 100)
    );
  },
  spellCritToDamage: function(
    rotationFactor,
    spellBaseDamage,
    spellCastTime,
    spellPower,
    critRating,
    hitRating,
    moonFury,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    return (
      (((spellBaseDamage * (moonFury ? this.globals.moonFuryBonus : 1.0) +
        spellPower * rotationFactor) *
        (1 / 100) *
        (1 - (this.globals.hitCap - hitRating) / 100)) /
        (spellCastTime -
          (this.globals.naturesGraceReduction * critRating) / 100)) *
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
    critRating,
    moonFury,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    return (
      (((spellBaseDamage * (moonFury ? this.globals.moonFuryBonus : 1.0) +
        spellPower * rotationFactor) *
        (1 + critRating / 100) *
        (1 / 100)) /
        (spellCastTime -
          (this.globals.naturesGraceReduction * critRating) / 100)) *
      (curseOfShadow ? this.globals.curseOfShadowBonus : 1.0) *
      (saygesDarkFortune ? this.globals.saygesDarkFortuneBonus : 1.0) *
      (tracesOfSilithyst ? this.globals.tracesOfSilithystBonus : 1.0) *
      (spellVuln ? this.globals.spellVulnBonus : 1.0) *
      (stormStrike ? this.globals.stormStrikeBonus : 1.0)
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
  balorSpellPowerToDamage: function(
    spellCoefficient,
    spellCastTime,
    critRating,
    hitRating,
    curseOfShadow
  ) {
    // v1 dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
    var d = curseOfShadow ? this.globals.curseOfShadowBonus : 1.0;
    return (
      (d *
        spellCoefficient *
        (0.83 + hitRating / 100) *
        (1 + ((this.globals.critMultiplier - 1) * hitRating) / 100)) /
      (spellCastTime -
        this.globals.naturesGraceReduction *
          (0.83 + hitRating / 100) *
          (critRating / 100))
    );
  },
  balorSpellCritToDamage: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    critRating,
    hitRating,
    moonFury,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    //v1 d(83+H)(mB+cP)(xT-t(0.83+H/100))/(100T-t(0.83+H/100)R)^2
    var d = curseOfShadow ? this.globals.curseOfShadowBonus : 1.0;
    var m = moonFury ? this.globals.moonFuryBonus : 1.0;

    return (
      (d *
        (83 + hitRating) *
        (m * spellBaseDamage + spellCoefficient * spellPower) *
        ((wcf.globals.critMultiplier - 1) * spellCastTime -
          this.globals.naturesGraceReduction * (0.83 + hitRating / 100))) /
      (100 * spellCastTime -
        this.globals.naturesGraceReduction *
          (0.83 + hitRating / 100) *
          critRating) **
        2
    );
  },
  balorSpellHitToDamage: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    critRating,
    hitRating,
    moonFury,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // v1 d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
    var d = curseOfShadow ? this.globals.curseOfShadowBonus : 1.0;
    var m = moonFury ? this.globals.moonFuryBonus : 1.0;

    return (
      (d *
        (m * spellBaseDamage + spellCoefficient * spellPower) *
        (100 + (this.globals.critMultiplier - 1) * critRating) *
        (100 ** 2 * spellCastTime)) /
      (100 ** 2 * spellCastTime -
        this.globals.naturesGraceReduction *
          (83 + hitRating) *
          critRating) **
        2
    );
  },
  balorSpellCritToSpellPower: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    critRating,
    hitRating,
    moonFury,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // v1 Crit:Spellpower = x(B/c + P)/(100 + R)   *   (T + t/x)/(T - tR/100)
    // v2 Crit:Spellpower = x(B/c + P)/(100 +xR)   *   (T + t/x)/(T - tR/100)
    // v3 Crit:Spellpower = x(mB/c + P)/(100+xR)   *   (T + (0.83+H/100)t/x)/(T-(0.83+H/100)tR/100)
    var m = moonFury ? this.globals.moonFuryBonus : 1.0;
    return (
      ((((this.globals.critMultiplier - 1) *
        ((m * spellBaseDamage) / spellCoefficient +
          spellPower)) /
        (100 + (this.globals.critMultiplier - 1) * critRating)) *
        (spellCastTime +
          ((0.83 + hitRating / 100) * this.globals.naturesGraceReduction) /
            (this.globals.critMultiplier - 1))) /
      (spellCastTime -
        ((0.83 + hitRating / 100) *
          this.globals.naturesGraceReduction *
          critRating) /
          100)
    );
  },
  balorSpellHitToSpellPower: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    critRating,
    hitRating,
    moonFury,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // v1 Hit:Spellpower = (B/c + P)/(83 + H)
    // v2 Hit:SpellPower = (mB/c+P)/(83+H) * (100^2 T)/(100^2 T - t(83+H)R)
    var m = moonFury ? this.globals.moonFuryBonus : 1.0;
    return (
      ((((m * spellBaseDamage) / spellCoefficient +
        spellPower) /
        (83 + hitRating)) *
        (100 ** 2 * spellCastTime)) /
      (100 ** 2 * spellCastTime -
        this.globals.naturesGraceReduction * (83 + hitRating) * critRating)
    );
  },
  balorSpellHitToSpellPower2: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    critRating,
    hitRating,
    moonFury,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    var m = moonFury ? this.globals.moonFuryBonus : 1.0;
    // ((mB/c+P)(100^2 T)) / ((100^2 T - t(83+H)R)(83+H))
    return (
      (((m * spellBaseDamage) / spellCoefficient +
        spellPower) *
        (100 ** 2 * spellCastTime)) /
      ((100 ** 2 * spellCastTime -
        this.globals.naturesGraceReduction *
          (83 + hitRating) *
          critRating) *
        (83 + hitRating))
    );
  },
  balorDPS: function(
    spellBaseDamage,
    spellCoefficient,
    spellCastTime,
    spellPower,
    critRating,
    hitRating,
    moonFury,
    curseOfShadow,
    saygesDarkFortune,
    tracesOfSilithyst,
    spellVuln,
    stormStrike
  ) {
    // v1 DPS = d(0.83 + H/100)(mB +cP)(1 + xR/100) / (T - t(0.83+H/100)(R/100))
    var d = curseOfShadow ? this.globals.curseOfShadowBonus : 1.0;
    var m = moonFury ? this.globals.moonFuryBonus : 1.0;

    return (
      (d *
        (0.83 + hitRating / 100) *
        (m * spellBaseDamage + spellCoefficient * spellPower) *
        (1 + ((wcf.globals.critMultiplier - 1) * critRating) / 100)) /
      (spellCastTime -
        this.globals.naturesGraceReduction *
          (0.83 + hitRating / 100) *
          (critRating / 100))
    );
  },
  test: function( ) {
    var xx = this.spellPowerToDamage(
          this.defaults.spellCastTime,
          this.defaults.critRating,
          this.defaults.hitRating);

    var yy = this.spellCritToDamage(
          this.defaults.rotationFactor,
          this.defaults.spellBaseDamage,
          this.defaults.spellCastTime,
          this.defaults.spellPower,
          this.defaults.critRating,
          this.defaults.hitRating,
          this.defaults.moonFury,
          this.defaults.curseOfShadow,
          this.defaults.saygesDarkFortune,
          this.defaults.tracesOfSilithyst,
          this.defaults.spellVuln,
          this.defaults.stormStrike);

    var zz = this.spellHitToDamage(
          this.defaults.rotationFactor,
          this.defaults.spellBaseDamage,
          this.defaults.spellCastTime,
          this.defaults.spellPower,
          this.defaults.critRating,
          this.defaults.moonFury,
          this.defaults.curseOfShadow,
          this.defaults.saygesDarkFortune,
          this.defaults.tracesOfSilithyst,
          this.defaults.spellVuln,
          this.defaults.stormStrike);

    console.log("spellPowerToDamage: " + xx);
    console.log("spellCritToDamage: " + yy);
    console.log("spellHitToDamage: " + zz);
    console.log("spellCritToSpellPower: " + yy / xx);
    console.log("spellHitToSpellPower: " +  zz / xx);
    
  }
};

module.exports = wcf;