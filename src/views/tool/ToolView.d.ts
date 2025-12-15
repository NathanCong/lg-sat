/**
 * 用户问题
 */
interface UserQuestion {
  question: string // 问题内容
  options?: string[] // 问题选项
}

/**
 * 根据用户问题生成的数据（用于统计）
 */
interface Question {
  index: number // 问题序号
  content: string // 问题内容
  type: 'select' | 'text' // 问题类型（select: 选择题，text: 文本描述题）
  options?: Array<{
    label: string
    value: string
    count: number
    other?: string
  }>
  answers?: string[]
  analysis?: string
}
