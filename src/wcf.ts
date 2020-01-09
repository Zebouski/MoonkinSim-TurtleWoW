export class Wcf {
  public static globals = {
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
  };

  public static defaults = {
    /* default values that can be changed in the app */
    spellName: "Starfire Rank 6",
    spellDamageType: "Arcane",
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
    improvedWrathPoints: 5,
    naturesGrace: true,
    curseOfShadow: true,
    powerInfusion: false,
    saygesDarkFortune: false,
    tracesOfSilithyst: false,
    spellVuln: false,
    stormStrike: false
  };

  static spellShortName(spellName: string) {
    return spellName.split(" ")[0];
  }

  static spellCritBonus(spellName: string, vengeancePoints: number) {
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
  }

  /* Increases the damage done by Starfire, Moonfire, and Wrath */
  static moonFuryBonus(spellName: string, moonFuryPoints: number) {
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
  }

  static improvedWrathBonus(improvedWrathPoints: number) {
    switch (improvedWrathPoints) {
      case 1:
        return 0.1; // Reduces the cast time of your Wrath spell by 0.1 sec.
      case 2:
        return 0.2; // Reduces the cast time of your Wrath spell by 0.2 sec.
      case 3:
        return 0.3; // Reduces the cast time of your Wrath spell by 0.3 sec.
      case 4:
        return 0.4; // Reduces the cast time of your Wrath spell by 0.4 sec.
      case 5:
        return 0.5; // Reduces the cast time of your Wrath spell by 0.5 sec.
      default:
        return 0; //
    }
  }

  static naturesGraceBonus(
    spellName: string,
    improvedWrathPoints: number,
    naturesGrace: boolean
  ) {
    if (naturesGrace) {
      if (this.spellShortName(spellName) == "Wrath")
        return (
          this.globals.naturesGraceReduction -
          this.improvedWrathBonus(improvedWrathPoints)
        );
      else return this.globals.naturesGraceReduction;
    }
    return 0;
  }

  static spellMultiplicativeBonuses(
    spellName: string,
    spellPenetration: number,
    enemySpellResistance: number,
    curseOfShadow: boolean,
    powerInfusion: boolean,
    saygesDarkFortune: boolean,
    tracesOfSilithyst: boolean,
    spellVuln: boolean,
    stormStrike: boolean
  ) {
    return (
      (curseOfShadow && this.spellShortName(spellName) == "Starfire"
        ? this.globals.curseOfShadowBonus
        : 1.0) *
      (powerInfusion ? this.globals.powerInfusionBonus : 1.0) *
      (saygesDarkFortune ? this.globals.saygesDarkFortuneBonus : 1.0) *
      (tracesOfSilithyst ? this.globals.tracesOfSilithystBonus : 1.0) *
      (spellVuln ? this.globals.spellVulnBonus : 1.0) *
      (stormStrike ? this.globals.stormStrikeBonus : 1.0) *
      (1 -
        this.spellPartialResistLossAverage(
          spellName,
          spellPenetration,
          enemySpellResistance
        ))
    );
  }

  static spellPowerToDamage(
    spellName: string,
    spellCoefficient: number,
    spellCastTime: number,
    spellCrit: number,
    spellHit: number,
    improvedWrathPoints: number,
    naturesGrace: boolean
  ) {
    // v1 dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
    // v2 dc(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
    // [beefbroc] v3 c(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
    var x = spellCoefficient * (0.83 + spellHit / 100) * (1 + spellCrit / 100);
    var y =
      this.spellCastTimeModified(
        spellName,
        spellCastTime,
        improvedWrathPoints
      ) -
      this.naturesGraceBonus(spellName, improvedWrathPoints, naturesGrace) *
        (0.83 + spellHit / 100) *
        (spellCrit / 100);
    return x / y;
  }

  static spellCritToDamage(
    spellName: string,
    spellBaseDamage: number,
    spellCoefficient: number,
    spellCastTime: number,
    spellPower: number,
    spellCrit: number,
    spellHit: number,
    spellPenetration: number,
    enemySpellResistance: number,
    vengeancePoints: number,
    moonFuryPoints: number,
    improvedWrathPoints: number,
    naturesGrace: boolean,
    curseOfShadow: boolean,
    powerInfusion: boolean,
    saygesDarkFortune: boolean,
    tracesOfSilithyst: boolean,
    spellVuln: boolean,
    stormStrike: boolean
  ) {
    //v1 d(83+H)(mB+cP)(xT-t(0.83+H/100))/(100T-t(0.83+H/100)R)^2
    //v2 d(83+H)(mB+cP) * (xT+t(0.83+H/100)) / (100T-t(0.83+H/100)R)^2
    var d = this.spellMultiplicativeBonuses(
      spellName,
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
        (this.moonFuryBonus(spellName, moonFuryPoints) * spellBaseDamage +
          spellCoefficient * spellPower) *
        ((this.spellCritBonus(spellName, vengeancePoints) - 1) *
          this.spellCastTimeModified(
            spellName,
            spellCastTime,
            improvedWrathPoints
          ) +
          this.naturesGraceBonus(spellName, improvedWrathPoints, naturesGrace) *
            (0.83 + spellHit / 100))) /
      (100 *
        this.spellCastTimeModified(
          spellName,
          spellCastTime,
          improvedWrathPoints
        ) -
        this.naturesGraceBonus(spellName, improvedWrathPoints, naturesGrace) *
          (0.83 + spellHit / 100) *
          spellCrit) **
        2
    );
  }

  static spellHitToDamage(
    spellName: string,
    spellBaseDamage: number,
    spellCoefficient: number,
    spellCastTime: number,
    spellPower: number,
    spellCrit: number,
    spellHit: number,
    spellPenetration: number,
    enemySpellResistance: number,
    vengeancePoints: number,
    moonFuryPoints: number,
    improvedWrathPoints: number,
    naturesGrace: boolean,
    curseOfShadow: boolean,
    powerInfusion: boolean,
    saygesDarkFortune: boolean,
    tracesOfSilithyst: boolean,
    spellVuln: boolean,
    stormStrike: boolean
  ) {
    // v1 d(mB+cP)(100+xR) * (100^2 T)/((100^2 T - t(83+H)R)^2)
    var d = this.spellMultiplicativeBonuses(
      spellName,
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
        (this.moonFuryBonus(spellName, moonFuryPoints) * spellBaseDamage +
          spellCoefficient * spellPower) *
        (100 +
          (this.spellCritBonus(spellName, vengeancePoints) - 1) * spellCrit) *
        (100 ** 2 *
          this.spellCastTimeModified(
            spellName,
            spellCastTime,
            improvedWrathPoints
          ))) /
      (100 ** 2 *
        this.spellCastTimeModified(
          spellName,
          spellCastTime,
          improvedWrathPoints
        ) -
        this.naturesGraceBonus(spellName, improvedWrathPoints, naturesGrace) *
          (83 + spellHit) *
          spellCrit) **
        2
    );
  }

  static spellChanceToMiss(spellHit: number) {
    return 100 - (83 + Math.min(spellHit, this.globals.hitCap - 1));
  }

  static spellChanceToRegularHit(spellCrit: number, spellHit: number) {
    return (
      100 -
      this.spellChanceToMiss(spellHit) -
      this.spellChanceToCrit(spellCrit, spellHit)
    );
  }

  static spellChanceToCrit(spellCrit: number, spellHit: number) {
    return (1.8 + spellCrit) * ((100 - this.spellChanceToMiss(spellHit)) / 100);
  }

  static spellAverageNonCrit(
    spellName: string,
    spellBaseDamage: number,
    spellCoefficient: number,
    spellPower: number,
    moonFuryPoints: number
  ) {
    return (
      spellBaseDamage * this.moonFuryBonus(spellName, moonFuryPoints) +
      spellPower * spellCoefficient
    );
  }

  static spellCastTimeModified(
    spellName: string,
    spellCastTime: number,
    improvedWrathPoints: number
  ) {
    if (this.spellShortName(spellName) == "Wrath") {
      return spellCastTime - this.improvedWrathBonus(improvedWrathPoints);
    }
    return spellCastTime;
  }

  static spellEffectiveCastTime(
    spellName: string,
    spellCastTime: number,
    spellCrit: number,
    spellHit: number,
    improvedWrathPoints: number,
    naturesGrace: boolean
  ) {
    var x =
      this.spellCastTimeModified(
        spellName,
        spellCastTime,
        improvedWrathPoints
      ) -
      this.naturesGraceBonus(spellName, improvedWrathPoints, naturesGrace) *
        (this.spellChanceToCrit(spellCrit, spellHit) / 100) +
      this.globals.spellCastTimeHumanFactor;

    return Math.max(x, this.globals.globalCoolDown);
  }

  static spellPartialResistLossAverage(
    spellName: string,
    spellPenetration: number,
    enemySpellResistance: number
  ) {
    var br1 = Math.min(enemySpellResistance, 276);
    var br2 = Math.min(spellPenetration, br1);
    return ((br1 - br2 + 24) / 300) * 0.75;
  }

  static spellDPS(
    spellName: string,
    spellBaseDamage: number,
    spellCoefficient: number,
    spellCastTime: number,
    spellPower: number,
    spellCrit: number,
    spellHit: number,
    spellPenetration: number,
    enemySpellResistance: number,
    vengeancePoints: number,
    moonFuryPoints: number,
    improvedWrathPoints: number,
    naturesGrace: boolean,
    curseOfShadow: boolean,
    powerInfusion: boolean,
    saygesDarkFortune: boolean,
    tracesOfSilithyst: boolean,
    spellVuln: boolean,
    stormStrike: boolean
  ) {
    // =(($H$9*$H$13*$I$9+$H$9*$H$16)/100) / $I$18*$D$22*$D$23*$D$24*$D$25*$D$26*$D$27*(1-$H$20)
    var sanc = this.spellAverageNonCrit(
      spellName,
      spellBaseDamage,
      spellCoefficient,
      spellPower,
      moonFuryPoints
    );
    var sctc = this.spellChanceToCrit(spellCrit, spellHit);
    var vb = this.spellCritBonus(spellName, vengeancePoints);
    var sctrh = this.spellChanceToRegularHit(spellCrit, spellHit);
    var sect = this.spellEffectiveCastTime(
      spellName,
      spellCastTime,
      spellCrit,
      spellHit,
      improvedWrathPoints,
      naturesGrace
    );
    var d = this.spellMultiplicativeBonuses(
      spellName,
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
}
