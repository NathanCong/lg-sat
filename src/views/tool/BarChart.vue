<template>
  <div class="bar-chart" ref="barChart"></div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import { Chart } from '@antv/g2'

const props = withDefaults(
  defineProps<{
    xKey?: string
    xValues?: string[]
    yKey?: string
    yValues?: number[]
  }>(),
  {
    xKey: 'x',
    xValues: () => [],
    yKey: 'y',
    yValues: () => []
  }
)

const barChart = ref<HTMLElement | null>(null)

watch(
  () => props,
  (newProps) => {
    const { xKey, xValues, yKey, yValues } = newProps
    nextTick().then(() => {
      if (!barChart.value) {
        return
      }
      const chart = new Chart({ container: barChart.value, autoFit: true })
      const data = xValues.map((xValue, index) => ({
        [xKey]: xValue,
        [yKey]: yValues[index]
      }))
      chart
        .interval()
        .data(data)
        .encode('x', xKey)
        .encode('y', yKey)
        .encode('color', xKey)
        .axis('x', {
          labelFormatter: (text: string) => {
            return text.length > 7 ? text.substring(0, 7) + '...' : text
          }
        })
      chart.render()
    })
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
.bar-chart {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
