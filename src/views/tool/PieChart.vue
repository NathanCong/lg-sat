<template>
  <div class="pie-chart" ref="pieChart"></div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import { Chart } from '@antv/g2'

type PieChartData = {
  label: string
  count: number
  percent: number
}

const props = withDefaults(
  defineProps<{
    data?: Array<PieChartData>
  }>(),
  {
    data: () => []
  }
)

const pieChart = ref<HTMLElement | null>(null)

watch(
  () => props,
  (newProps) => {
    const { data } = newProps
    nextTick().then(() => {
      if (!pieChart.value) {
        return
      }
      const chart = new Chart({ container: pieChart.value, autoFit: true })
      chart.coordinate({ type: 'theta', outerRadius: 0.8 })
      chart
        .interval()
        .data(data)
        .transform({ type: 'stackY' })
        .encode('y', 'percent')
        .encode('color', 'label')
        .legend('color', {
          position: 'bottom',
          layout: { justifyContent: 'center' }
        })
        .label({
          position: 'outside',
          text: (data: PieChartData) =>
            `${data.label.length > 5 ? data.label.substring(0, 5) + '...' : data.label}: ${data.percent}%`
        })
        .tooltip((data: PieChartData) => ({
          name: data.label,
          value: `${data.percent}%`
        }))
      chart.render()
    })
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
.pie-chart {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
