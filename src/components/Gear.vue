<template>
  <div>
    <div class="gear">
      <div class="gear-left">
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Head" :itemData="equipment.head" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Neck" :itemData="equipment.neck" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Shoulder" :itemData="equipment.shoulder" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Back" :itemData="equipment.back" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Chest" :itemData="equipment.chest" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Wrist" :itemData="equipment.wrist" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Mainhand" :itemData="equipment.mainhand" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Offhand" :itemData="equipment.offhand" />
      </div>
      <div class="gear-center"></div>
      <div class="gear-right">
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Hands" :itemData="equipment.hands" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Waist" :itemData="equipment.waist" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Legs" :itemData="equipment.legs" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Feet" :itemData="equipment.feet" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Finger" :itemData="equipment.finger" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Finger2" :itemData="equipment.finger2" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Trinket" :itemData="equipment.trinket" />
        <GearItem :options="options" :itemSlot="wow.ItemSlot.Trinket2" :itemData="equipment.trinket2" />
      </div>
    </div>
    <div class="links">
      <div class="columns is-mobile">
        <div class="column"></div>
        <div class="column is-1">
          <b-button @click="shareLink" type="is-link"> <font-awesome-icon :icon="['fas', 'link']"/></b-button>
        </div>
        <div class="column is-1">
          <b-button @click="resetGear" type="is-link"> <font-awesome-icon :icon="['fas', 'redo']"/></b-button>
        </div>
        <div class="column"></div>
      </div>
    </div>
    <div class="publicLinkModal">
      <b-modal :active.sync="showPublicLinkModal" scroll="keep">
        <p>Copy the link below to share this gear set</p>
        <div class="content">
          <b-field>
            <input class="input is-size-7-mobile" size="50" v-model="publicLink" />
          </b-field>
        </div>
      </b-modal>
    </div>
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
          ></b-table>
        </div>
      </b-modal>
    </div>
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
          ></b-table>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<style scoped>
.gear {
  position: relative;
  display: flex;
  padding: 1.25rem;
}

.gear-left {
  max-width: calc(50% - 0.625rem);
  overflow: hidden;
}

.gear-right {
  max-width: calc(50% - 0.625rem);
  overflow: hidden;
}

.gear-center {
  flex-grow: 1;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'
import GearItem from './GearItem.vue'
import ItemSlot from '../wow/enum/ItemSlot'

const GearProps = Vue.extend({
  props: {
    options: Object,
    encounter: Object
  }
})

@Component({
  components: { GearItem }
})
export default class Gear extends GearProps {
  wow = wow
  paginated = true
  selected = null

  showPublicLinkModal = false

  get equipment() {
    return this.encounter.equipment
  }

  get publicLink() {
    let url = wow.Tools.publicUrl(this.equipment)
    return url
  }

  shareLink() {
    this.showPublicLinkModal = true
  }

  resetGear() {
    this.options.character.lockedItems.head = ''
    this.options.character.lockedItems.hands = ''
    this.options.character.lockedItems.neck = ''
    this.options.character.lockedItems.waist = ''
    this.options.character.lockedItems.shoulder = ''
    this.options.character.lockedItems.legs = ''
    this.options.character.lockedItems.back = ''
    this.options.character.lockedItems.feet = ''
    this.options.character.lockedItems.chest = ''
    this.options.character.lockedItems.wrist = ''
    this.options.character.lockedItems.finger = ''
    this.options.character.lockedItems.finger2 = ''
    this.options.character.lockedItems.mainhand = ''
    this.options.character.lockedItems.offhand = ''
    this.options.character.lockedItems.trinket = ''
    this.options.character.lockedItems.trinket2 = ''
    this.options.character.lockedItems.idol = ''

    this.options.character.lockedEnchants.head = 0
    this.options.character.lockedEnchants.hands = 0
    this.options.character.lockedEnchants.shoulder = 0
    this.options.character.lockedEnchants.legs = 0
    this.options.character.lockedEnchants.back = 0
    this.options.character.lockedEnchants.feet = 0
    this.options.character.lockedEnchants.chest = 0
    this.options.character.lockedEnchants.wrist = 0
    this.options.character.lockedEnchants.mainhand = 0
  }

  selectItem(obj1: any, obj2: any) {
    console.log('hello, an item was selectd')
    console.log(obj1)
    console.log(obj2)
    let slot = this.options.itemSearchSlot
    this.options.itemSearchSlot = ItemSlot.None
    switch (slot) {
      case ItemSlot.Head:
        this.options.character.lockedItems.head = obj1.customId
        break
      case ItemSlot.Hands:
        this.options.character.lockedItems.hands = obj1.customId
        break
      case ItemSlot.Neck:
        this.options.character.lockedItems.neck = obj1.customId
        break
      case ItemSlot.Waist:
        this.options.character.lockedItems.waist = obj1.customId
        break
      case ItemSlot.Shoulder:
        this.options.character.lockedItems.shoulder = obj1.customId
        break
      case ItemSlot.Legs:
        this.options.character.lockedItems.legs = obj1.customId
        break
      case ItemSlot.Back:
        this.options.character.lockedItems.back = obj1.customId
        break
      case ItemSlot.Feet:
        this.options.character.lockedItems.feet = obj1.customId
        break
      case ItemSlot.Chest:
        this.options.character.lockedItems.chest = obj1.customId
        break
      case ItemSlot.Wrist:
        this.options.character.lockedItems.wrist = obj1.customId
        break
      case ItemSlot.Finger:
        this.options.character.lockedItems.finger = obj1.customId
        break
      case ItemSlot.Finger2:
        this.options.character.lockedItems.finger2 = obj1.customId
        break
      case ItemSlot.Mainhand:
        this.options.character.lockedItems.mainhand = obj1.customId
        break
      case ItemSlot.Offhand:
        this.options.character.lockedItems.offhand = obj1.customId
        break
      case ItemSlot.Trinket:
        this.options.character.lockedItems.trinket = obj1.customId
        break
      case ItemSlot.Trinket2:
        this.options.character.lockedItems.trinket2 = obj1.customId
        break
      case ItemSlot.Relic:
        this.options.character.lockedItems.idol = obj1.customId
        break
      default:
        break
    }
  }

  selectEnchant(obj1: any, obj2: any) {
    console.log('hello, an enchant was selectd')
    console.log(obj1)
    console.log(obj2)
    let slot = this.options.enchantSearchSlot
    this.options.enchantSearchSlot = ItemSlot.None
    switch (slot) {
      case ItemSlot.Head:
        this.options.character.lockedEnchants.head = obj1.id
        break
      case ItemSlot.Hands:
        this.options.character.lockedEnchants.hands = obj1.id
        break
      case ItemSlot.Shoulder:
        this.options.character.lockedEnchants.shoulder = obj1.id
        break
      case ItemSlot.Legs:
        this.options.character.lockedEnchants.legs = obj1.id
        break
      case ItemSlot.Back:
        this.options.character.lockedEnchants.back = obj1.id
        break
      case ItemSlot.Feet:
        this.options.character.lockedEnchants.feet = obj1.id
        break
      case ItemSlot.Chest:
        this.options.character.lockedEnchants.chest = obj1.id
        break
      case ItemSlot.Wrist:
        this.options.character.lockedEnchants.wrist = obj1.id
        break
      case ItemSlot.Mainhand:
        this.options.character.lockedEnchants.mainhand = obj1.id
        break
      default:
        break
    }
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

  get showEnchants() {
    if (this.options.enchantSearchSlot !== ItemSlot.None) {
      return true
    }
    return false
  }

  set showEnchants(slot) {
    this.options.enchantSearchSlot = ItemSlot.None
  }

  get item_data() {
    let myItems = this.encounter.items
    myItems.sort(wow.Item.sortScoreDes)
    return myItems
  }

  get enchant_data() {
    let myEnchants = this.encounter.enchants
    myEnchants.sort(wow.Item.sortScoreDes)
    return myEnchants
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
