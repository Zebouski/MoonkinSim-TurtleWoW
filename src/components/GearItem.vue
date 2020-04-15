<template>
  <div>
    <template v-if="isLeftColumn">
      <div class="gear-item">
        <div class="gear-item-image">
          <div
            class="image-wrapper"
            @click="mouseClick"
            @mouseenter="mouseEnter(itemSlot)"
            @mousemove="mouseMove"
            @mouseleave="mouseLeave"
          >
            <figure class="image is-48x48">
              <img :src="itemData.iconFullPath" style="zIndex: 3" />
            </figure>
            <font-awesome-icon
              v-if="isLocked"
              class="is-overlay"
              :icon="['fas', 'lock']"
              :style="{ padding: '2px', color: 'white' }"
            />
          </div>
        </div>
        <div class="gear-item-text">
          <p
            :class="itemData.qualityName.toLowerCase()"
            class="gear-item-text-name left-text has-text-left is-size-7-mobile"
          >
            {{ itemData.name }}
          </p>
          <p
            v-if="!itemData.isEmpty()"
            :class="itemData.enchantClass"
            class="gear-item-text-enchant left-text has-text-left is-size-7"
            @click="enchantClick"
          >
            {{ itemData.enchantText }}
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="gear-item gear-item-right">
        <div class="gear-item-text">
          <p
            :class="itemData.qualityName.toLowerCase()"
            class="gear-item-text-name right-text has-text-right is-size-7-mobile"
          >
            {{ itemData.name }}
          </p>
          <p
            v-if="!itemData.isEmpty()"
            :class="itemData.enchantClass"
            class="gear-item-text-enchant right-text has-text-right is-size-7"
            @click="enchantClick"
          >
            {{ itemData.enchantText }}
          </p>
        </div>
        <div class="gear-item-image">
          <div
            class="image-wrapper"
            @click="mouseClick"
            @mouseenter="mouseEnter(itemSlot)"
            @mousemove="mouseMove"
            @mouseleave="mouseLeave"
          >
            <figure class="image is-48x48">
              <img :src="itemData.iconFullPath" style="zIndex: 1" />
            </figure>
            <font-awesome-icon
              v-if="isLocked"
              class="is-overlay"
              :icon="['fas', 'lock']"
              :style="{ padding: '2px', color: 'white' }"
            />
          </div>
        </div>
      </div>
    </template>
    <GearItemTooltip :class="{ hidden: !showToolTip }" :style="toolTipStyle" :itemData="itemData" />
  </div>
</template>

<style scoped>
.gear-item-right {
  text-align: right;
  justify-content: flex-end;
}
.gear-item {
  display: flex;
  width: 100%;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
}

.gear-item-image {
  display: block;
  position: relative;
  flex-shrink: 0;
  padding: 2px;
}

.gear-item-text {
  overflow: hidden;
}

.right-text {
  margin-right: 0.625rem;
}

.left-text {
  margin-left: 0.625rem;
}

.gear-item-text-name {
  margin-bottom: 0.25rem;

  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.gear-item-text-enchant {
  margin-bottom: 0.25rem;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.image-wrapper {
  border: 0.0625rem solid #595959;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { default as wow } from '../wow'
import GearItemTooltip from './GearItemTooltip.vue'

const Props = Vue.extend({
  props: {
    options: Object,
    itemSlot: Number,
    itemData: Object
  }
})

@Component({
  components: { GearItemTooltip }
})
export default class GearItem extends Props {
  wow = wow
  showToolTip = false
  toolTipStyle = {
    zIndex: 999,
    position: 'fixed',
    top: '0px',
    left: '0px'
  }

  get isLocked() {
    switch (this.itemSlot) {
      case wow.ItemSlot.Head:
        return this.options.character.lockedItems.head ? true : false
      case wow.ItemSlot.Hands:
        return this.options.character.lockedItems.hands ? true : false
      case wow.ItemSlot.Neck:
        return this.options.character.lockedItems.neck ? true : false
      case wow.ItemSlot.Waist:
        return this.options.character.lockedItems.waist ? true : false
      case wow.ItemSlot.Shoulder:
        return this.options.character.lockedItems.shoulder ? true : false
      case wow.ItemSlot.Legs:
        return this.options.character.lockedItems.legs ? true : false
      case wow.ItemSlot.Back:
        return this.options.character.lockedItems.back ? true : false
      case wow.ItemSlot.Feet:
        return this.options.character.lockedItems.feet ? true : false
      case wow.ItemSlot.Chest:
        return this.options.character.lockedItems.chest ? true : false
      case wow.ItemSlot.Wrist:
        return this.options.character.lockedItems.wrist ? true : false
      case wow.ItemSlot.Finger:
        return this.options.character.lockedItems.finger ? true : false
      case wow.ItemSlot.Finger2:
        return this.options.character.lockedItems.finger2 ? true : false
      case wow.ItemSlot.Mainhand:
        return this.options.character.lockedItems.mainhand ? true : false
      case wow.ItemSlot.Offhand:
        return this.options.character.lockedItems.offhand ? true : false
      case wow.ItemSlot.Trinket:
        return this.options.character.lockedItems.trinket ? true : false
      case wow.ItemSlot.Trinket2:
        return this.options.character.lockedItems.trinket2 ? true : false
      case wow.ItemSlot.Relic:
        return this.options.character.lockedItems.idol ? true : false
      default:
        return false
    }
  }

  get isLeftColumn() {
    switch (this.itemSlot) {
      case wow.ItemSlot.Head:
      case wow.ItemSlot.Neck:
      case wow.ItemSlot.Shoulder:
      case wow.ItemSlot.Back:
      case wow.ItemSlot.Chest:
      case wow.ItemSlot.Wrist:
      case wow.ItemSlot.Mainhand:
      case wow.ItemSlot.Offhand:
      case wow.ItemSlot.Ranged:
        return true
      default:
        return false
    }
  }

  mouseClick(): void {
    this.options.itemSearchSlot = this.itemSlot
  }

  enchantClick(): void {
    this.options.enchantSearchSlot = this.itemSlot
  }

  mouseEnter(slot: number): void {
    if (!this.itemData.isEmpty()) {
      this.showToolTip = true
    }
  }

  mouseMove(event: any): void {
    if (this.isLeftColumn) {
      this.toolTipStyle.left = event.clientX + 40 + 'px'
      this.toolTipStyle.top = event.clientY - 30 + 'px'
    } else {
      this.toolTipStyle.left = event.clientX - 300 + 'px'
      this.toolTipStyle.top = event.clientY - 30 + 'px'
    }
  }

  mouseLeave(event: any): void {
    this.showToolTip = false
  }
}
</script>
