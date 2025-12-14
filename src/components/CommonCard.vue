<template>
  <div class="common-card" :class="{ full: isFullMode }">
    <section class="card-header">{{ title }}</section>
    <section class="card-mainer">
      <template v-if="isFullMode">
        <div class="card-scroll">
          <slot></slot>
        </div>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </section>
    <template v-if="showFooter">
      <section class="card-footer">
        <slot name="footer"></slot>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ mode?: string; title?: string; showFooter?: boolean }>(),
  {
    mode: 'auto',
    title: 'CommonCard',
    showFooter: true
  }
)

const isFullMode = computed(() => props.mode === 'full')
</script>

<style lang="less" scoped>
.common-card {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .card-header {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 16px;
    font-size: 16px;
    font-weight: bold;
  }

  .card-mainer {
    width: 100%;
    height: auto;
    box-sizing: border-box;
  }

  .card-footer {
    width: 100%;
    height: auto;
    box-sizing: border-box;
  }

  &.full {
    height: 100%;

    .card-mainer {
      flex: 1;
      position: relative;

      .card-scroll {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 16px;
        left: 0;
        overflow: auto;
      }
    }
  }
}
</style>
