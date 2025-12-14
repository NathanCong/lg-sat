<template>
  <div class="blank-layout">
    <!-- 布局内容主体 -->
    <section class="layout-mainer">
      <slot></slot>
    </section>
  </div>
</template>

<style lang="less" scoped>
.blank-layout {
  width: 100%;
  height: 100%;
  display: flex;

  .layout-mainer {
    flex: 1;
    overflow-x: hidden;
  }
}
</style>
