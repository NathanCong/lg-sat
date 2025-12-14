<template>
  <div class="home">
    <section class="options-wrapper">
      <CommonCard title="配置选项" :show-footer="false">
        <OptionsSelector @create="onCreate" />
      </CommonCard>
    </section>
    <section class="preview-wrapper">
      <CommonCard mode="full" title="预览计划" :show-footer="true">
        <CommonLoading :is-loading="requestLoading">
          <PlanPreviewer
            :user-options="userOptions"
            :month-holiday-plans="monthHolidayPlans"
            ref="planPreviewerRef"
          />
        </CommonLoading>
        <template #footer>
          <div class="preview-footer">
            <a-button
              type="primary"
              style="margin-left: 8px"
              :disabled="isExportDisabled"
              @click="onExportPNG"
            >
              导出 PNG
            </a-button>
            <a-button
              type="primary"
              style="margin-left: 8px"
              :disabled="isExportDisabled"
              @click="onExportPDF"
            >
              导出 PDF
            </a-button>
          </div>
        </template>
      </CommonCard>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { CommonCard, CommonLoading } from '@/components/index'
import { OptionsSelector, PlanPreviewer } from './components/index'
import { getHolidaysFromYear, getHolidaysFromDates } from '@/apis'
import dayjs from 'dayjs'
import { getHolidayNameAndMultiple } from '@/utils/common'

const requestLoading = ref(false)

/**
 * 获取星期名称
 */
function getWeekName(date: string) {
  const week = dayjs(date).day()
  return `星期${['日', '一', '二', '三', '四', '五', '六'][week]}`
}

/**
 * 获取中秋节日期
 */
function getMoonFestivalDate(dates: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    if (dates.length < 1) {
      resolve('')
      return
    }
    getHolidaysFromDates(dates)
      .then((response) => {
        const { holiday } = response.data
        let moonFestivalDate = ''
        Object.keys(holiday).forEach((date: string) => {
          const { name } = holiday[date]
          if (name.includes('中秋')) {
            moonFestivalDate = date
          }
        })
        resolve(moonFestivalDate)
      })
      .catch((error) => reject(error))
  })
}

/**
 * 获取假期安排描述
 */
function getPlanDesc(
  holidayName: string,
  holidayDates: string[],
  workdayDates: string[]
) {
  const sHDate = holidayDates[0] // 假期开始日期
  const sHDateName = dayjs(sHDate).format('MM月DD日')
  const sHWeekName = getWeekName(sHDate) // 假期开始周
  const eHDate = holidayDates[holidayDates.length - 1] // 假期结束日期
  const eHDateName = dayjs(eHDate).format('MM月DD日')
  const eHWeekName = getWeekName(eHDate) // 假期结束周
  const hCount = holidayDates.length // 假期天数
  const planDescs: string[] = []
  if (hCount === 1) {
    planDescs.push(`${holidayName}: ${sHDateName} (${sHWeekName}) 休假，共1天`)
  }
  if (hCount > 1) {
    planDescs.push(
      `${holidayName}: ${sHDateName} (${sHWeekName}) ~ ${eHDateName} (${eHWeekName}) 休假，共${hCount}天`
    )
  }
  if (workdayDates.length > 0) {
    const workdayNames = workdayDates.map(
      (date) => `${dayjs(date).format('MM月DD日')} (${getWeekName(date)})`
    )
    planDescs.push(`${workdayNames.join('，')} 上班`)
  }
  return planDescs.join('；')
}

/**
 * 获取 planDescsMap 和 planDatesMap
 */
function getPlanMaps(
  holidayNamesMap: HolidayNamesMap,
  moonFestivalDate: string
) {
  const planDescsMap: Record<string, string> = {}
  const planDatesMap: Record<string, PlanDay> = {}
  Object.keys(holidayNamesMap).forEach((name) => {
    // 生成 planDescsMap
    const { holidayDates, workdayDates } = holidayNamesMap[name]
    const month = holidayDates[holidayDates.length - 1].split('-')[1]
    planDescsMap[month] = getPlanDesc(name, holidayDates, workdayDates)
    // 生成 planDatesMap
    holidayDates.forEach((date, index) => {
      const { holidayName, wage } = getHolidayNameAndMultiple(
        name,
        date,
        index,
        moonFestivalDate
      )
      const week = dayjs(date).day()
      planDatesMap[date] = {
        date,
        type: 1,
        name: holidayName,
        week: week === 0 ? 7 : week,
        wage
      }
    })
    workdayDates.forEach((date) => {
      const week = dayjs(date).day()
      planDatesMap[date] = {
        date,
        type: 2,
        name: '补班',
        week: week === 0 ? 7 : week,
        wage: 1
      }
    })
  })
  return { planDescsMap, planDatesMap }
}

/**
 * 获取 monthHolidayPlans
 */
async function getMonthHolidayPlans(year: string) {
  requestLoading.value = true
  try {
    const response = await getHolidaysFromYear(year)
    const { days } = response.data
    const holidayNamesMap: HolidayNamesMap = {}
    const holidayMonthsMap: HolidayMonthsMap = {}
    const searchDates: string[] = []
    days.forEach((day: { name: string; date: string; isOffDay: boolean }) => {
      const { name, date, isOffDay } = day
      // 生成 holidayNamesMap
      if (!holidayNamesMap[name]) {
        holidayNamesMap[name] = { holidayDates: [], workdayDates: [] }
      }
      if (isOffDay) {
        holidayNamesMap[name].holidayDates.push(date)
      } else {
        holidayNamesMap[name].workdayDates.push(date)
      }
      // 生成 holidayMonthsMap
      const month = date.split('-')[1]
      if (!holidayMonthsMap[month]) {
        holidayMonthsMap[month] = { planDayDates: [] }
      }
      holidayMonthsMap[month].planDayDates.push(date)
      // 生成 searchDates
      if (name.includes('国庆') && name.includes('中秋')) {
        searchDates.push(date)
      }
    })
    const moonFestivalDate = await getMoonFestivalDate(searchDates)
    const { planDescsMap, planDatesMap } = getPlanMaps(
      holidayNamesMap,
      moonFestivalDate
    )
    // 生成 monthHolidayPlans
    const monthHolidayPlans: MonthHolidayPlan[] = []
    Object.keys(holidayMonthsMap).forEach((month) => {
      let planDesc = planDescsMap[month]
      if (!planDesc) {
        const holidayNames: string[] = []
        const holidayDates: string[] = []
        const workdayDates: string[] = []
        holidayMonthsMap[month].planDayDates.forEach((d) => {
          const { date, name, type } = planDatesMap[d]
          if (name) {
            holidayNames.push(name)
          }
          if (type === 1) {
            holidayDates.push(date)
          }
          if (type === 2) {
            workdayDates.push(date)
          }
        })
        const holidayName = holidayNames.join('、')
        planDesc = getPlanDesc(holidayName, holidayDates, workdayDates)
      }
      monthHolidayPlans.push({
        month,
        planDesc,
        planDays: holidayMonthsMap[month].planDayDates.map(
          (date) => planDatesMap[date]
        )
      })
    })
    return monthHolidayPlans.sort(
      (a: MonthHolidayPlan, b: MonthHolidayPlan) =>
        Number(a.month) - Number(b.month)
    )
  } catch (error) {
    console.error(error)
  } finally {
    requestLoading.value = false
  }
}

const userOptions = reactive<UserOptions>({
  year: '',
  color1: '',
  color2: '',
  color3: ''
})

const monthHolidayPlans = ref<MonthHolidayPlan[]>([])

async function onCreate({ year, color1, color2, color3 }: UserOptions) {
  try {
    // 请求新数据之前必须先清空，否则样式会错乱
    monthHolidayPlans.value = []
    monthHolidayPlans.value = (await getMonthHolidayPlans(year)) || []
    userOptions.year = year
    userOptions.color1 = color1
    userOptions.color2 = color2
    userOptions.color3 = color3
  } catch (error) {
    console.error(error)
  }
}

const isEmpty = computed(() => monthHolidayPlans.value.length < 1)

const isExportDisabled = computed(() => requestLoading.value || isEmpty.value)

const planPreviewerRef = ref<InstanceType<typeof PlanPreviewer> | null>(null)

function onExportPNG() {
  planPreviewerRef.value?.exportPNG()
}

function onExportPDF() {
  planPreviewerRef.value?.exportPDF()
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  background-color: #ddd;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: row;

  .options-wrapper {
    width: 300px;
    height: 100%;
    margin-right: 16px;
  }

  .preview-wrapper {
    flex: 1;

    .preview-footer {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      padding: 16px;
      padding-top: 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
