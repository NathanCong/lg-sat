<template>
  <div class="options-selector">
    <!-- 年份选择 -->
    <YearSelector label="年份选择" @change="onYearChange" />
    <!-- 颜色1选择（法定节假日） -->
    <ColorSelector
      label="颜色1选择（法定节假日）"
      :colors="COLORS"
      @change="(value) => onColorChange(1, value)"
    />
    <!-- 颜色2选择（调休、补休、周末连休） -->
    <ColorSelector
      label="颜色2选择（调休、补休、周末连休）"
      :colors="COLORS"
      @change="(value) => onColorChange(2, value)"
    />
    <!-- 颜色3选择（补班） -->
    <ColorSelector
      label="颜色3选择（补班）"
      :colors="COLORS"
      @change="(value) => onColorChange(3, value)"
    />
    <div class="selector-buttons">
      <a-button type="primary" :disabled="isCreateDisabled" @click="onCreate">
        生成预览
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import YearSelector from './components/YearSelector.vue'
import ColorSelector from './components/ColorSelector.vue'
import { COLORS } from './constants/index'

const userOptions = reactive<UserOptions>({
  year: '',
  color1: '',
  color2: '',
  color3: ''
})

const isCreateDisabled = computed(() => {
  const { year, color1, color2, color3 } = userOptions
  return !(year && color1 && color2 && color3)
})

function onYearChange(value: Dayjs) {
  userOptions.year = value ? dayjs(value).format('YYYY') : ''
}

function onColorChange(type: number, value: string) {
  switch (type) {
    case 1:
      userOptions.color1 = value
      break
    case 2:
      userOptions.color2 = value
      break
    case 3:
      userOptions.color3 = value
      break
    default:
  }
}

const emit = defineEmits(['create'])

function onCreate() {
  emit('create', userOptions)
}
</script>

<style lang="less" scoped>
.options-selector {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 0 16px;
  display: flex;
  flex-direction: column;

  .selector-buttons {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
  }
}
</style>
