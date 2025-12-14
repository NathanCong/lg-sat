<template>
  <a-config-provider :locale="zhCN">
    <div class="app app-font">
      <template v-if="isUseLayout">
        <component :is="layoutComponent">
          <router-view></router-view>
        </component>
      </template>
      <template v-else>
        <router-view></router-view>
      </template>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const route = useRoute()

const isUseLayout = computed(() => {
  return Boolean(route.meta.layoutComponent)
})

const layoutComponent = computed(() => {
  return route.meta.layoutComponent
})
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  height: 100vh;
  min-width: 1200px;
  min-height: 600px;
}

.app-font {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  color: #333;
}
</style>
