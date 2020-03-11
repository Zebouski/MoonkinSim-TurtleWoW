<template>
  <div>
    <section class="section has-background-black-bis">
      <div class="container is-fluid">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <b-tabs class="block">
                <b-tab-item label="Gear">
                  <Gear :options="options" :gearData="bisGear" />
                </b-tab-item>
                <b-tab-item label="Talents">
                  <Talents :options="options" />
                </b-tab-item>
                <b-tab-item label="Buffs">
                  <Buffs :options="options" />
                </b-tab-item>
                <b-tab-item label="Target">
                  <Target :options="options" />
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box has-background-black-ter has-text-white">
              <b-tabs class="block">
                <b-tab-item label="Summary">
                  <Summary :data="spellCast" />
                </b-tab-item>
                <b-tab-item label="Damage">
                  <Damage :data="spellCast" />
                </b-tab-item>
              </b-tabs>
            </article>
          </div>
        </div>
      </div>
    </section>

    <Debug v-bind:class="{ 'is-hidden': !options.debug }" :data="debugObj" />
  </div>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

import Gear from './Gear.vue'
import Talents from './Talents.vue'
import Buffs from './Buffs.vue'
import Target from './Target.vue'
import Summary from './Summary.vue'
import Damage from './Damage.vue'
import Debug from './Debug.vue'

import Equipment from '../wow/class/Equipment'
import TargetType from '../wow/enum/TargetType'

const Props = Vue.extend({
  props: {
    options: Object
  }
})

@Component({
  components: { Gear, Talents, Buffs, Target, Summary, Damage, Debug }
})
export default class Content extends Props {
  wow = wow

  get debugObj() {
    return {
      itemSet: wow.Database.itemSet('Bloodvine Vest'),
      spellCast: this.spellCast
    }
  }

  calcBisGear(
    phase: number,
    faction: number,
    pvpRank: number,
    worldBosses: boolean,
    magicSchool: number,
    targetType: TargetType,
    spellHitWeight: number,
    spellCritWeight: number
  ): Equipment {
    let _bis = (slot: number) => {
      return wow.Database.getBestInSlotItemWithEnchant(
        slot,
        phase,
        faction,
        pvpRank,
        worldBosses,
        magicSchool,
        targetType,
        spellHitWeight,
        spellCritWeight
      )
    }

    let bisTrinkets = wow.Database.getBestInSlotTrinkets(
      phase,
      faction,
      pvpRank,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight
    )

    let bisRings = wow.Database.getBestInSlotRings(
      phase,
      faction,
      pvpRank,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight
    )

    let bisWeaponCombo = wow.Database.getBestInSlotWeaponCombo(
      phase,
      faction,
      pvpRank,
      worldBosses,
      magicSchool,
      targetType,
      spellHitWeight,
      spellCritWeight
    )

    // return new wow.Equipment()
    return new wow.Equipment(
      _bis(wow.ItemSlot.Head),
      _bis(wow.ItemSlot.Hands),
      _bis(wow.ItemSlot.Neck),
      _bis(wow.ItemSlot.Waist),
      _bis(wow.ItemSlot.Shoulder),
      _bis(wow.ItemSlot.Legs),
      _bis(wow.ItemSlot.Back),
      _bis(wow.ItemSlot.Feet),
      _bis(wow.ItemSlot.Chest),
      new wow.Item(wow.ItemSlot.Finger, bisRings.finger),
      _bis(wow.ItemSlot.Wrist),
      new wow.Item(wow.ItemSlot.Finger2, bisRings.finger2),
      new wow.Item(wow.ItemSlot.Mainhand, bisWeaponCombo.mainHand, bisWeaponCombo.enchant),
      new wow.Item(wow.ItemSlot.Trinket, bisTrinkets.trinket),
      bisWeaponCombo.offHand ? new wow.Item(wow.ItemSlot.Offhand, bisWeaponCombo.offHand) : undefined,
      new wow.Item(wow.ItemSlot.Trinket2, bisTrinkets.trinket2),
      _bis(wow.ItemSlot.Relic)
    )
  }

  get bisGear() {
    let spell = new wow.Spell(this.options.spellName)
    return this.calcBisGear(
      this.options.phase,
      wow.Character.factionFromRace(this.options.faction),
      this.options.pvpRank,
      this.options.worldBosses,
      spell.magicSchool,
      this.options.target.type,
      15,
      10
    )
  }

  get spellCast() {
    let bis = this.bisGear

    return new wow.Cast(
      new wow.Character(
        wow.constants.playerLevelCap,
        this.options.race,
        wow.PlayableClass.Druid,
        wow.Gender.Male,
        new wow.Talents(
          this.options.talents.naturesGraceRank,
          this.options.talents.moonFuryRank,
          this.options.talents.vengeanceRank,
          this.options.talents.improvedWrathRank,
          this.options.talents.improvedStarfireRank,
          this.options.talents.improvedMoonfireRank
        ),
        new wow.Gear(
          bis.stamina,
          bis.intellect,
          bis.spirit,
          bis.mp5,
          bis.spellPenetration,
          bis.spellHit,
          bis.spellCrit,
          bis.spellDamage,
          bis.arcaneDamage,
          bis.natureDamage
        ),
        wow.Character.buffListToFlags(this.options.buffs)
      ),
      new wow.Spell(this.options.spellName),
      new wow.Target(
        this.options.target.type,
        this.options.target.spellResistance,
        this.options.target.shimmer,
        wow.Character.buffListToFlags(this.options.target.debuffs)
      )
    )
  }
}
</script>
