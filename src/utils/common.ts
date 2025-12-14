/**
 * 获取节日名称和薪资倍数（参考文件：https://www.gov.cn/zhengce/content/202411/content_6986380.htm）
 * @param name 节日名称
 * @param date 节日日期
 * @param index 节日第几天
 * @param moonFestivalDate 中秋节日期
 */
export function getHolidayNameAndMultiple(
  name: string,
  date: string,
  index: number,
  moonFestivalDate: string
): { holidayName: string; wage: number } {
  /**
   * 1. 元旦，放假1天（1月1日）
   */
  if (name.includes('元旦')) {
    if (date.includes('01-01')) {
      return { holidayName: '元旦', wage: 3 }
    }
    return { holidayName: '', wage: 2 }
  }
  /**
   * 2. 春节，放假4天（农历除夕、正月初一至初三）
   */
  if (name.includes('春节')) {
    if (index === 0) {
      return { holidayName: '除夕', wage: 3 }
    }
    if (index === 1) {
      return { holidayName: '春节', wage: 3 }
    }
    if (index === 2) {
      return { holidayName: '初二', wage: 3 }
    }
    if (index === 3) {
      return { holidayName: '初三', wage: 3 }
    }
    return { holidayName: '', wage: 2 }
  }
  /**
   * 3. 清明节，放假1天（农历清明当日）
   */
  if (name.includes('清明')) {
    if (index === 0) {
      return { holidayName: '清明', wage: 3 }
    }
    return { holidayName: '', wage: 2 }
  }
  /**
   * 4. 劳动节，放假2天（5月1日、2日）
   */
  if (name.includes('劳动')) {
    if (date.includes('05-01')) {
      return { holidayName: '劳动节', wage: 3 }
    }
    if (date.includes('05-02')) {
      return { holidayName: '', wage: 3 }
    }
    if (date.includes('05-04')) {
      return { holidayName: '青年节', wage: 2 }
    }
    return { holidayName: '', wage: 2 }
  }
  /**
   * 5. 端午节，放假1天（农历端午当日）
   */
  if (name.includes('端午')) {
    if (index === 0) {
      return { holidayName: '端午', wage: 3 }
    }
    return { holidayName: '', wage: 2 }
  }
  /**
   * 特殊情况: 国庆、中秋连休
   */
  if (name.includes('中秋') && name.includes('国庆')) {
    // 国庆节（10月1日至3日）
    if (date.includes('10-01')) {
      return { holidayName: '国庆', wage: 3 }
    }
    if (date.includes('10-02') || date.includes('10-03')) {
      return { holidayName: '', wage: 3 }
    }
    // 中秋节（农历中秋当日）
    if (date === moonFestivalDate) {
      return { holidayName: '中秋', wage: 3 }
    }
    return { holidayName: '', wage: 2 }
  }
  /**
   * 6. 中秋节，放假1天（农历中秋当日）
   */
  if (name.includes('中秋')) {
    if (index === 0) {
      return { holidayName: '中秋', wage: 3 }
    }
    return { holidayName: '', wage: 2 }
  }
  /**
   * 7. 国庆节，放假3天（10月1日至3日）
   */
  if (name.includes('国庆')) {
    if (date.includes('10-01')) {
      return { holidayName: '国庆', wage: 3 }
    }
    if (date.includes('10-02') || date.includes('10-03')) {
      return { holidayName: '', wage: 3 }
    }
    return { holidayName: '', wage: 2 }
  }
  /**
   * 其他情况
   */
  return { holidayName: '', wage: 2 }
}
