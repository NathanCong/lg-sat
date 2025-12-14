<template>
  <div class="plan-detail">
    <section class="detail-header">
      <span class="header-month">{{ monthHolidayPlan.month }}月</span>
      <span class="header-desc">{{ monthHolidayPlan.planDesc }}</span>
    </section>
    <section class="detail-table">
      <!-- thead -->
      <template v-for="theadCell in theadCells" :key="theadCell.key">
        <span :class="theadCell.className">{{ theadCell.text }}</span>
      </template>
      <!-- tbody -->
      <template v-for="tbodyCell in tbodyCells" :key="tbodyCell.key">
        <span
          :class="tbodyCell.className"
          :style="{ backgroundColor: tbodyCell.bgColor }"
        >
          <span class="cell-text" :style="{ color: tbodyCell.textColor }">
            {{ tbodyCell.text }}
          </span>
          <span class="cell-desc">{{ tbodyCell.desc }}</span>
        </span>
      </template>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import dayjs from 'dayjs'

const props = withDefaults(
  defineProps<{
    userOptions: UserOptions
    monthHolidayPlan: MonthHolidayPlan
  }>(),
  {
    userOptions: () => ({
      year: '',
      color1: '',
      color2: '',
      color3: ''
    }),
    monthHolidayPlan: () => ({
      month: '',
      planDesc: '',
      planDays: []
    })
  }
)

const theadLabels = reactive<string[]>([
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日'
])

const theadCells = computed<TheadCell[]>(() => {
  return theadLabels.map((text, index) => {
    return { key: index, text, className: 'thead-cell' }
  })
})

function getTbodyCellBgColor(wage?: number, type?: number) {
  const { color1, color2, color3 } = props.userOptions
  // 法定节假日，3倍薪资，使用 color1
  if (wage === 3) {
    return color1
  }
  // 假期，2倍薪资，使用 color2
  if (wage === 2) {
    return color2
  }
  // 补班，1倍薪资，使用 color3
  if (type === 2) {
    return color3
  }
  // 其他，使用默认背景色
  return '#fafafa'
}

function isWeekend(week: number) {
  return week === 0 || week === 6
}

const tbodyCells = computed<TbodyCell[]>(() => {
  const cells: TbodyCell[] = []
  const { userOptions, monthHolidayPlan } = props
  const { year } = userOptions
  const { month, planDays } = monthHolidayPlan
  const firstDay = dayjs(`${year}-${month}-01`)
  const daysCount = firstDay.daysInMonth()
  // 填充日期
  for (let i = 1; i <= daysCount; i += 1) {
    const week = firstDay.date(i).day()
    const date = firstDay.date(i).format('YYYY-MM-DD')
    const planDay = planDays.find((item) => item.date === date)
    const { name, type, wage } = planDay || {}
    cells.push({
      key: i,
      text: String(i),
      className: 'tbody-cell',
      week: week === 0 ? 7 : week,
      desc: name || '',
      bgColor: getTbodyCellBgColor(wage, type),
      textColor: isWeekend(week) ? 'red' : '#333'
    })
  }
  // 填充头部空白
  const fIndex = 0
  const fCell = cells[fIndex]
  const bFillCount = fCell ? fCell.week - 1 : 0
  const bFillCells = new Array(bFillCount).fill(null).map((_, index) => ({
    key: 0 - index,
    text: '',
    className: 'tbody-cell',
    week: index + 1
  }))
  cells.unshift(...bFillCells)
  // 填充尾部空白
  const lIndex = cells.length - 1
  const aFillCount = 7 - cells[lIndex].week
  const aFillCells = new Array(aFillCount).fill(null).map((_, index) => ({
    key: lIndex + index + 1,
    text: '',
    className: 'tbody-cell',
    week: 7 - aFillCount + index + 1
  }))
  cells.push(...aFillCells)
  return cells
})
</script>

<style lang="less" scoped>
.plan-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .detail-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 8px;

    .header-month {
      width: auto;
      color: #b9000d;
      font-size: 20px;
      line-height: 20px;
      font-weight: bold;
      margin-right: 4px;
    }

    .header-desc {
      flex: 1;
    }
  }

  .detail-table {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto;
    grid-auto-rows: minmax(31px, auto);
    gap: 2px;
    background-color: #ddd;

    .thead-cell,
    .tbody-cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .thead-cell {
      background-color: #d6dded;
      font-size: 14px;
      font-weight: bold;
    }

    .tbody-cell {
      flex-direction: column;

      .cell-text {
        font-size: 14px;
        line-height: 14px;
      }

      .cell-desc {
        margin-top: 2px;
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
</style>
