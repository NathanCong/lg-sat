<template>
  <div class="color-selector">
    <section class="selector-label">{{ label }}</section>
    <section class="selector-wrapper">
      <a-select
        :value="value"
        style="width: 100%"
        placeholder="请选择颜色"
        :allow-clear="true"
        :options="options"
        @change="onChange"
      >
        <template #option="{ value, label }">
          <ColorOption :color="value" :label="label" />
        </template>
        <template #optionLabel="{ value, label }">
          <ColorOption :color="value" :label="label" />
        </template>
      </a-select>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ColorOption from './ColorOption.vue'

const props = withDefaults(
  defineProps<{ label?: string; colors?: string[]; value?: string }>(),
  {
    label: 'ColorSelector',
    colors: () => [
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#FF00FF',
      '#00FFFF'
    ]
  }
)

const options = computed(() =>
  props.colors.map((color) => ({ label: color, value: color }))
)

const emit = defineEmits(['change'])

function onChange(value: unknown) {
  emit('change', value)
}
</script>

<style lang="less" scoped>
.color-selector {
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
