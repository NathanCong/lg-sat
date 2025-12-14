<template>
  <div class="common-header" :style="{ backgroundColor: bgColor }">
    <section class="header-left">
      <template v-if="showLogo && logoSrc">
        <img class="header-logo" :src="logoSrc" />
      </template>
      <template v-if="showTitle">
        <span class="header-title">{{ title }}</span>
      </template>
      <template v-if="showSubTitle">
        <span class="header-divider"></span>
        <span class="header-subtitle">{{ subTitle }}</span>
      </template>
    </section>
    <section class="header-right">
      <template v-if="showActions">
        <slot name="actions"></slot>
      </template>
    </section>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    bgColor?: string
    showLogo?: boolean
    logoSrc?: string
    showTitle?: boolean
    title?: string
    showSubTitle?: boolean
    subTitle?: string
    showActions?: boolean
  }>(),
  {
    bgColor: '#fff',
    showLogo: true,
    logoSrc: '',
    showTitle: true,
    title: '测试标题',
    showSubTitle: true,
    subTitle: '测试副标题',
    showActions: true
  }
)
</script>

<style lang="less" scoped>
.common-header {
  width: 100%;
  height: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 20px;

  .header-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: 30px;

    .header-logo {
      width: auto;
      height: 100%;
      margin-right: 6px;
    }

    .header-title {
      font-weight: bold;
      font-size: 18px;
      line-height: 18px;
    }

    .header-divider {
      height: 18px;
      border-left: 1px solid #333;
      margin: 0 10px;
      align-self: center;
    }

    .header-subtitle {
      font-weight: normal;
      font-size: 16px;
      line-height: 16px;
    }
  }
}
</style>
