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
              <img :src="itemData.iconFullPath" style="zIndex: 1" />
            </figure>
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
    if (this.options.experimental) {
      this.options.itemSearchSlot = this.itemSlot
    }
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
