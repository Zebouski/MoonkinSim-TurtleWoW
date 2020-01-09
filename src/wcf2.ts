var jsonQuery = require("json-query");
var druidSpells = require("./db/spells/druid.yaml");
//var allGear = require("./db/gear/all.yaml");

const useBadBaseDmg = false;

interface SpellJSON {
  name: string;
  baseName: string;
  rank: number;
  minDmg: number;
  maxDmg: number;
  badBaseDmg: number;
  school: string;
  castTime: number;
  manaCost: number;
  level: number;
  range: number;
}

class SpellCast {
  character: Character;
  spell: Spell;
  target: Target;
  constructor(character: Character, spell: Spell, target: Target) {
    this.character = character;
    this.spell = spell;
    this.target = target;
  }

  /*
    spellName: string,
    spellCoefficient: number,
    spellCastTime: number,
    spellCrit: number,
    spellHit: number,
    improvedWrathPoints: number,
    naturesGrace: boolean
  get spellPowerToDamage() {
    // v1 dc(0.83+H/100)(1+xR/100)/(T-t(0.83+H/100)(R/100))
    // v2 dc(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
    // [beefbroc] v3 c(0.83+H/100)(1+R/100)/(T-t(0.83+H/100)(R/100))
    var x = this.spell.coefficient * (0.83 + spellHit / 100) * (1 + spellCrit / 100);
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
  */
}

class Spell {
  name: string;
  spellJSON: SpellJSON;
  constructor(name: string) {
    this.name = name;
    this.spellJSON = jsonQuery(`[name=${name}]`, { data: druidSpells }).value;
  }
  static getSpellNames() {
    return jsonQuery(".name", { data: druidSpells }).value;
  }
  get baseDmg() {
    if (useBadBaseDmg) {
      return this.spellJSON.badBaseDmg;
    }
    return (this.spellJSON.minDmg + this.spellJSON.maxDmg) / 2;
  }
  get coefficient() {
    let baseCoefficient = this.spellJSON.castTime / 3.5;
    if (this.spellJSON.level < 20) {
      let subLevelPenalty = 1 - (20 - this.spellJSON.level) * 0.0375;
      let effectiveCoefficient = baseCoefficient * (1 - subLevelPenalty);
      return effectiveCoefficient;
    }
    return baseCoefficient;
  }
  get baseName() {
    return this.spellJSON.baseName;
  }
  get rank() {
    return this.spellJSON.rank;
  }
  get minDmg() {
    return this.spellJSON.minDmg;
  }
  get maxDmg() {
    return this.spellJSON.maxDmg;
  }
  get badBaseDmg() {
    return this.spellJSON.badBaseDmg;
  }
  get school() {
    return this.spellJSON.school;
  }
  get castTime() {
    return this.spellJSON.castTime;
  }
  get manaCost() {
    return this.spellJSON.manaCost;
  }
  get level() {
    return this.spellJSON.level;
  }
  get range() {
    return this.spellJSON.range;
  }
}

class Character {
  level: number;
  race: string;
  className: string;
  gender: string;
  constructor(level: number, race: string, className: string, gender: string) {
    this.level = level;
    this.race = race.toUpperCase();
    this.gender = gender.toUpperCase();
    this.className = className.toUpperCase();
  }

  get faction() {
    switch (this.race) {
      case "TAUREN":
      case "ORC":
      case "UNDEAD":
      case "TROLL":
        return "Horde";
    }
    return "Alliance";
  }
}

class Target {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export default {
  Character,
  Target,
  Spell,
  SpellCast
};
