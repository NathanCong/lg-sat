<template>
  <div class="default-layout">
    <!-- 布局顶部导航 -->
    <section class="layout-header">
      <CommonHeader
        :show-logo="true"
        :logo-src="LogoPNG"
        :show-title="false"
        :show-sub-title="true"
        sub-title="问卷调查分析工具"
      ></CommonHeader>
    </section>
    <!-- 布局内容主体 -->
    <section class="layout-mainer">
      <slot></slot>
    </section>
  </div>
</template>

<script lang="ts" setup>
import CommonHeader from '@/components/CommonHeader.vue'
import LogoPNG from '@/assets/images/logo.png'
</script>

<style lang="less" scoped>
.default-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .layout-header {
    width: 100%;
    height: 60px;
  }

  .layout-mainer {
    flex: 1;
    overflow-x: hidden;
  }
}
</style>
