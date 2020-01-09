var jsonQuery = require("json-query");
var druidSpells = require("./db/spells/druid.yaml");
var allGear = require("./db/gear/all.yaml");

const useBadBaseDmg = false;

class Gear {
  constructor(gearName) {
    this.gear = jsonQuery(`[name=${gearName}]`, { data: allGear }).value;
  }

  static getGearNames() {
    return(jsonQuery('.name', { data: allGear }).value);
  }

  get name() {
    console.log("hello gear.name: " + this.gear.name)
    return(this.gear.name);
  }

  get quality() {
    return(this.gear.quality);
  }

  /*
  findByName(name) {
    return(jsonQuery(`[name=${name}]`, { data: allGear }).value);
  }
  */
}

class SpellCast {
  constructor(character, spell, target) {
    this.character = character;
    this.spell = spell;
    this.target = target; 
  }  
}

class Spell {
  constructor(name) {
    this.name = name;
    this.spell = jsonQuery(`[name=${name}]`, { data: druidSpells }).value;
  }
  static getSpellNames() {
    return(jsonQuery('.name', { data: druidSpells }).value);
  }
  get baseDmg() {
    if (useBadBaseDmg) {
      return(this.spell.badBaseDmg);
    }
    return((this.spell.minDmg + this.spell.maxDmg) / 2);
  }
  get coefficient() {
    let baseCoefficient = this.spell.castTime / 3.5;
    if (this.spell.level < 20) {
      let subLevelPenalty = 1 - (20 - this.spell.level) * 0.0375;
      let effectiveCoefficient = baseCoefficient * (1 - subLevelPenalty);
      return(effectiveCoefficient);
    }
    return(baseCoefficient);
  }
  get baseName() {
    return(this.spell.baseName);   
  }
  get rank() {
    return(this.spell.rank);
  }
  get minDmg() {
    return(this.spell.minDmg);
  }
  get maxDmg() {
    return(this.spell.maxDmg);
  }
  get badBaseDmg() {
    return(this.spell.badBaseDmg);
  }
  get school() {
    return(this.spell.school);   
  }
  get castTime() {
    return(this.spell.castTime);   
  }
  get manaCost() {
    return(this.spell.manaCost);   
  }
  get level() {
    return(this.spell.level);   
  }
  get range() {
    return(this.spell.range);   
  }
}

class Character {
  constructor(level, race, className, gender) {
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
  constructor(name) {
    this.name = name;  
  }  
}

export default {
  Gear,
  Character,
  Target,
  Spell,
  Cast
};