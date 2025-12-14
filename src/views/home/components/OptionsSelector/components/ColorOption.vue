<template>
  <span class="color-option">
    <span class="option-color" :style="{ backgroundColor: color }"></span>
    <span class="option-label">{{ label }}</span>
  </span>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ color: string; label: string }>(), {
  color: '',
  label: ''
})
</script>

<style lang="less" scoped>
.color-option {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .option-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  .option-label {
    font-size: 14px;
    font-weight: normal;
    margin-left: 6px;
  }
}
</style>
