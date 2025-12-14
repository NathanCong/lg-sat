<template>
  <div
    class="common-loading"
    :style="{
      width: mode === 'full' ? '100%' : 'auto',
      height: mode === 'full' ? '100%' : 'auto'
    }"
  >
    <template v-if="isLoading">
      <section class="loading-mask">
        <a-spin :spinning="isLoading" :size="size" :tip="tip"></a-spin>
      </section>
    </template>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    mode?: 'full' | 'auto'
    isLoading?: boolean
    size?: 'default' | 'small' | 'large'
    tip?: string
  }>(),
  {
    mode: 'full',
    isLoading: false,
    size: 'default'
  }
)
</script>

<style lang="less" scoped>
.common-loading {
  position: relative;

  .loading-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.5);
  }
}
</style>
