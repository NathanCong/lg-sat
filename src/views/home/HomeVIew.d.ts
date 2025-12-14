/**
 * 假期安排中的某一天
 */
interface PlanDay {
  date: string // 具体日期
  type: number // 日期类型（1: 假期, 2: 补班）
  name: string // 假期名称
  week: number // 一周中的第几天（1 ~ 7: 周一 ~ 周日）
  wage: number // 薪资倍数
}

/**
 * 月份假期安排
 */
interface MonthHolidayPlan {
  month: string // 月份
  planDesc: string // 假期安排描述
  planDays: PlanDay[] // 假期安排涉及到的天
}

type HolidayNamesMap = Record<
  string,
  { holidayDates: string[]; workdayDates: string[] }
>

type HolidayMonthsMap = Record<string, { planDayDates: string[] }>
