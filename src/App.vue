<template>
  <div id="app">
    <Header :options="options" />
    <Content :options="options" />
    <Footer :options="options" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from './wow'

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Content from './components/Content.vue'

@Component({
  components: {
    Header,
    Footer,
    Content
  }
})
export default class App extends Vue {
  options = {
    debug: false,
    phase: 3,
    pvpRank: 1,
    race: wow.PlayableRace.Tauren,
    spellName: 'Starfire Rank 6',

    talents: {
      naturesGraceRank: 1,
      moonFuryRank: 5,
      vengeanceRank: 5,
      improvedWrathRank: 5,
      improvedStarfireRank: 5,
      improvedMoonfireRank: 5
    },
    buffs: [
      'MoonkinAura',
      'FlaskOfSupremePower',
      'GreaterArcaneElixir',
      'CerebralCortexCompound',
      'RunnTumTuberSurprise',
      'RallyingCryOfTheDragonSlayer',
      'SlipkiksSavvy',
      'ArcaneBrilliance',
      'SongflowerSerenade',
      'BlessingOfKings',
      'ImprovedGiftOfTheWild'
    ],
    target: {
      type: wow.TargetType.Elemental,
      spellResistance: 75,
      debuffs: ['CurseOfShadow']
    }
  }
}
</script>
