<template>
  <div>
    <div class="gearSelect">
      <b-modal :active.sync="showItems" scroll="keep">
        <div class="container is-fluid">
          <b-table
            @select="selectItem"
            :data="item_data"
            :columns="item_columns"
            :paginated="paginated"
            :pagination-simple="true"
            per-page="5"
            sort-icon="arrow-up"
            sort-icon-size="is-small"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            default-sort-direction="desc"
            default-sort="['score', 'desc']"
            hoverable
          >
            <template slot="footer">
              <GearButtonBar :options="buttonBarOptions()" @unlock-gear="unlockItem" @unequip-gear="unequipItem" />
              <!--
              <div class="columns is-mobile">
                <div v-if="itemLocked()" class="column is-1">
                  <GearUnlockButton @click.native="unlockItem" />
                </div>
                <div v-if="itemEquipped()" class="column is-1">
                  <GearUnequipButton @click.native="unequipItem" />
                </div>
                <div class="column"></div>
              </div>
              -->
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

const GearItemSelectProps = Vue.extend({
  props: {
    options: Object,
    encounter: Object
  }
})

@Component({
  components: { GearButtonBar }
})
export default class GearItemSelect extends GearItemSelectProps {
  wow = wow
  paginated = true

  buttonBarOptions() {
    return {
      showShare: false,
      showUnlock: this.itemLocked(),
      showUnequip: this.itemEquipped()
    }
  }

  itemEquipped() {
    return wow.Locked.ItemEquipped(this.options.character.lockedItems, this.options.itemSearchSlot)
  }

  itemLocked() {
    return wow.Locked.ItemLocked(this.options.character.lockedItems, this.options.itemSearchSlot)
  }

  unlockItem() {
    wow.Locked.UnlockItem(this.options.character.lockedItems, this.options.itemSearchSlot)
    this.options.itemSearchSlot = ItemSlot.None
  }

  unequipItem() {
    wow.Locked.UnequipItem(this.options.character.lockedItems, this.options.itemSearchSlot)
    this.options.itemSearchSlot = ItemSlot.None
  }

  selectItem(obj1: any, obj2: any) {
    wow.Locked.SetItem(this.options.character.lockedItems, this.options.itemSearchSlot, obj1.customId)
    this.options.itemSearchSlot = ItemSlot.None
  }

  get showItems() {
    if (this.options.itemSearchSlot !== ItemSlot.None) {
      return true
    }
    return false
  }

  set showItems(slot) {
    this.options.itemSearchSlot = ItemSlot.None
  }

  get item_data() {
    let myItems = this.encounter.items
    myItems.sort(wow.Item.sortScoreDes)
    return myItems
  }

  get item_columns() {
    return [
      {
        field: 'name',
        label: '',
        width: '300',
        numeric: false,
        sortable: true,
        searchable: true
      },
      {
        field: 'spellDamage',
        label: 'Spell Dmg',
        width: '10',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'arcaneDamage',
        label: 'Arcane Dmg',
        width: '10',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'natureDamage',
        label: 'Nature Dmg',
        width: '10',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'spellHit',
        label: 'Spell Hit',
        width: '10',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'spellCrit',
        label: 'Spell Crit',
        width: '10',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'intellect',
        label: 'Intellect',
        width: '10',
        numeric: true,
        sortable: true,
        searchable: false
      },
      {
        field: 'score',
        label: 'Score',
        width: '10',
        numeric: true,
        sortable: true,
        searchable: false
      }
    ]
  }
}
</script>
