<template>
  <div class="year-selector">
    <section class="selector-label">{{ label }}</section>
    <section class="selector-wrapper">
      <a-date-picker
        :value="value"
        style="width: 100%"
        placeholder="请选择年份"
        :allow-clear="true"
        picker="year"
        @change="onChange"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Dayjs } from 'dayjs'

withDefaults(defineProps<{ label?: string; value?: Dayjs }>(), {
  label: 'YearSelector'
})

const emit = defineEmits(['change'])

function onChange(value: unknown) {
  emit('change', value)
}
</script>

<style lang="less" scoped>
.year-selector {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  .selector-label {
    font-size: 14px;
    font-weight: normal;
    line-height: 32px;
  }

  .selector-wrapper {
    flex: 1;
  }
}
</style>
