<template>
  <div>
    <div class="enchantSelect">
      <b-modal :active.sync="showEnchants" scroll="keep">
        <div class="container is-fluid">
          <b-table
            @select="selectEnchant"
            :data="enchant_data"
            :columns="enchant_columns"
            :paginated="paginated"
            :pagination-simple="true"
            per-page="5"
            sort-icon="arrow-up"
            sort-icon-size="is-small"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            default-sort="['score', 'desc']"
            hoverable
          >
            <template slot="footer">
              <GearButtonBar
                :options="buttonBarOptions()"
                @unlock-gear="unlockEnchant"
                @unequip-gear="unequipEnchant"
              />
            </template>
          </b-table>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'

import GearButtonBar from './GearButtonBar.vue'
import ItemSlot from '../wow/enum/ItemSlot'

const GearEnchantSelectProps = Vue.extend({
  props: {
    options: Object,
    encounter: Object
  }
})

@Component({
  components: { GearButtonBar }
})
export default class GearEnchantSelect extends GearEnchantSelectProps {
  wow = wow
  paginated = true

  buttonBarOptions() {
    return {
      showShare: false,
      showUnlock: this.enchantLocked(),
      showUnequip: this.enchantEquipped()
    }
  }

  enchantEquipped() {
    return wow.Locked.EnchantEquipped(this.options.character.lockedEnchants, this.options.enchantSearchSlot)
  }

  enchantLocked() {
    return wow.Locked.EnchantLocked(this.options.character.lockedEnchants, this.options.enchantSearchSlot)
  }

  unequipEnchant() {
    wow.Locked.UnequipEnchant(this.options.character.lockedEnchants, this.options.enchantSearchSlot)
    this.options.enchantSearchSlot = ItemSlot.None
  }

  unlockEnchant() {
    wow.Locked.UnlockEnchant(this.options.character.lockedEnchants, this.options.enchantSearchSlot)
    this.options.enchantSearchSlot = ItemSlot.None
  }

  selectEnchant(obj1: any, obj2: any) {
    wow.Locked.SetEnchant(this.options.character.lockedEnchants, this.options.enchantSearchSlot, obj1.customId)
    this.options.enchantSearchSlot = ItemSlot.None
  }

  get showEnchants() {
    if (this.options.enchantSearchSlot !== ItemSlot.None) {
      return true
    }
    return false
  }

  set showEnchants(slot) {
    this.options.enchantSearchSlot = ItemSlot.None
  }

  get enchant_data() {
    return this.encounter.enchants
  }

  get enchant_columns() {
    return [
      {
        field: 'name',
        label: 'name',
        width: '300',
        numeric: false,
        sortable: true,
        searchable: true
      },
      {
        field: 'spellDamage',
        label: 'Spell Dmg',
        width: '20',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'arcaneDamage',
        label: 'Arcane Dmg',
        width: '20',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'natureDamage',
        label: 'Nature Dmg',
        width: '20',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'spellCrit',
        label: 'Spell Crit',
        width: '20',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'spellHit',
        label: 'Spell Hit',
        width: '20',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'score',
        label: 'score',
        width: '20',
        numeric: true,
        sortable: true,
        searchable: false
      }
    ]
  }
}
</script>
