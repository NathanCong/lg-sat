interface Question {
  index: number // 问题序号
  content: string // 问题内容
  type: 'select' | 'text' // 问题类型（select: 选择题，text: 文本描述题）
  options?: Array<{
    label: string
    value: string
    count?: number
    total?: number
  }>
}

interface UserAnswer {
  questionIndex: number // 问题序号
  answer: string // 答案
  others?: string // 补充答案（TextBox 内容）
}

interface StatisticalResult {
  userInfo: Record<string, string> // 用户信息
  userAnswers: UserAnswer[] // 用户答案
}

// interface AnalysisResult {
//   questionIndex: number // 问题序号
//   questionContent: string // 问题内容
//   questionType: string // 问题类型

// }
