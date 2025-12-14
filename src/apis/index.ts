import { get } from '@/utils/request'

export function getHolidaysFromYear(year: string) {
  /**
   * API 官网：https://github.com/NateScarlet/holiday-cn
   */
  return get(
    `https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master/${year}.json`
  )
}

/**
 * 批量查询指定日期节假日信息
 */
export function getHolidaysFromDates(dates: string[]) {
  /**
   * API 官网：https://timor.tech/api/holiday/
   */
  const dateParams = dates.map((date) => `d=${date}`).join('&')
  return get(`http://timor.tech/api/holiday/batch?${dateParams}`)
}
