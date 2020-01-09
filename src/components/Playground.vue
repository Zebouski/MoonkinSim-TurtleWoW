<template>
  <div>
    <section class="section has-background-grey-darker ">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article
              class="tile is-child box has-background-black-ter has-text-white"
            >
              <div class="content">
                <b-tabs position="is-centered" class="block" >
                  <b-tab-item label="Character"></b-tab-item>
                  <b-tab-item label="Spell"></b-tab-item>
                  <b-tab-item label="Enemy"></b-tab-item>
                </b-tabs>
                <div class="select">
                  <select v-model="spellName">
                    <option v-for="name in spellNames" :key="name" v-bind:value="name">
                      {{ name }}
                    </option>
                  </select>
                </div>
                <div class="select">
                  <select v-model="gearName">
                    <option v-for="name in gearNames" :key="name" v-bind:value="name">
                      {{ name }}
                    </option>
                  </select>
                </div>
              </div>
            </article>
          </div>
          <div class="tile is-parent">
            <article
              class="tile is-child box has-background-black-ter has-text-white"
            >
              <p class="subtitle has-text-white"></p>
              <div class="content">
                <p>Name: {{ druidSpell.name }}</p>
                <p>BaseName: {{ druidSpell.baseName }}</p>
                <p>Rank: {{ druidSpell.rank }}</p>
                <p>minDmg: {{ druidSpell.minDmg }}</p>
                <p>maxDmg: {{ druidSpell.maxDmg }}</p>
                <p>BadBaseDamage: {{ druidSpell.badBaseDamage }}</p>
                <p>School: {{ druidSpell.school }}</p>
                <p>CastTime: {{ druidSpell.castTime }}</p>
                <p>ManaCost: {{ druidSpell.manaCost }}</p>
                <p>Level: {{ druidSpell.level }}</p>
                <p>Range: {{ druidSpell.range }}</p>
                <p>------------------------</p>
                <p>BaseDamage: {{ druidSpell.baseDmg }}</p>
                <p>Coefficient: {{ druidSpell.coefficient }}</p>
                <p>------------------------</p>
                <p>headGear.name: {{ headGear.name }}</p>
                <p>headGear.quality: {{ headGear.quality }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>

<script>
import wcf2 from "../wcf2.js";

const myCharacter= new wcf2.Character(60, "Tauren", "Druid", "Male");
const myTarget = new wcf2.Target("Ragnaros");
const mySpell = new wcf2.Spell("Starfire Rank 1");
const myCast = new wcf2.Cast(myCharacter, mySpell, myTarget);

export default {
  data() {
    return {
      showPlayground: true,
      spellNames: wcf2.Spell.getSpellNames(),
      spellName: "Starfire Rank 6",
      gearNames: wcf2.Gear.getGearNames(),
      gearName: "Dire Nail of Arcane Wrath"
    };
  },
  computed: {
    druidSpell: function() {
      return(new wcf2.Spell(this.spellName));
    },
    headGear: function() {
      return(new wcf2.Gear(this.gearName));
    }
  }
};
</script>