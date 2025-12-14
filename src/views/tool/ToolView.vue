<template>
  <div class="tool">
    <a-upload
      accept=".xls"
      :before-upload="onBeforeUpload"
      :max-count="1"
      :multiple="false"
      :show-upload-list="false"
    >
      <a-button type="primary">Excel 导入</a-button>
    </a-upload>
    <section style="margin-top: 16px">
      <CommonCard mode="auto" title="分析结果" :show-footer="false">
        <template v-for="question in questions" :key="question.index">
          <p>{{ question.content }}</p>
          <ul>
            <template v-for="option in question.options" :key="option.label">
              <template v-if="option.count && option.total">
                <li>
                  {{ option.value }}.{{ option.label }}（{{
                    ((option.count / option.total) * 100).toFixed()
                  }}%）
                </li>
              </template>
            </template>
          </ul>
        </template>
      </CommonCard>
    </section>
  </div>
</template>

<script lang="ts" setup>
import * as xlsx from 'xlsx'
import { QUESTIONS } from './constants/index'
import { ref } from 'vue'
import { CommonCard } from '@/components/index'

// 问题
const questions = ref<Question[]>(QUESTIONS)
// 统计结果
const statisticalResults = ref<StatisticalResult[]>([])

function onBeforeUpload(file: File) {
  console.log('file', file)
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const worksheet = xlsx.read(data, {
        type: 'array',
        cellDates: false,
        cellNF: false,
        cellText: false
      })
      const sheetNames = worksheet.SheetNames
      const sheet = worksheet.Sheets[sheetNames[0]]
      const jsonData = xlsx.utils.sheet_to_json(sheet, {
        header: 1,
        raw: true,
        defval: ''
      })
      // console.log('jsonData', jsonData)
      const columns: string[] = jsonData.slice(0, 1)[0] as string[]
      // console.log('columns', columns)
      // 收集问题
      const questionContents = columns.slice(6)
      // console.log('questionContents', questionContents)
      let qIndex = 0
      questionContents.forEach((content: string) => {
        if (content !== 'TextBox') {
          questions.value[qIndex].content = content
          qIndex += 1
        }
      })
      console.log('questions', questions.value)
      // 生成统计
      const keys = columns.slice(0, 6)
      const results: string[][] = jsonData.slice(1) as string[][]
      results.forEach((result: unknown[]) => {
        const userInfo: Record<string, string> = {}
        const userAnswers: UserAnswer[] = []
        let answerIndex = 0
        result.forEach((value: unknown, index: number) => {
          if (index < 6) {
            userInfo[keys[index]] = String(value)
            return
          }
          if (questionContents[index - 6] === 'TextBox') {
            userAnswers[answerIndex - 1].others = String(value)
            return
          }
          userAnswers.push({
            questionIndex: answerIndex + 1,
            answer: String(value)
          })
          answerIndex += 1
        })
        statisticalResults.value.push({ userInfo, userAnswers })
      })
      console.log('statisticalResults', statisticalResults.value)
      // 进行分析
      const analysisResults = []
      statisticalResults.value.forEach((result: StatisticalResult) => {
        const { userAnswers } = result
        userAnswers.forEach((userAnswer: UserAnswer) => {
          const { questionIndex, answer } = userAnswer
          const question = questions.value.find(
            (i) => i.index === questionIndex
          )
          const { type } = question || {}
          if (type !== 'select') {
            return
          }
          const target = analysisResults.find(
            (i) => i.questionIndex === questionIndex
          )
          if (target) {
            if (target[answer]) {
              target[answer] += 1
            } else {
              target[answer] = 1
            }
          } else {
            analysisResults.push({ questionIndex, [answer]: 1 })
          }
        })
      })
      console.log('analysisResults', analysisResults)
      questions.value.forEach((question: Question) => {
        const { index, type, options } = question
        const target = analysisResults.find((i) => i.questionIndex === index)
        if (type === 'select' && options && target) {
          let total = 0
          options.forEach((option) => {
            const { value } = option
            option.count = target[value]
            total += target[value]
          })
          options.forEach((option) => {
            option.total = total
          })
        }
      })
      console.log('questions', questions.value)
    } catch (err) {
      console.error(err)
    }
  }
  reader.readAsArrayBuffer(file)
  return false
}
</script>

<style lang="less" scoped>
.tool {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
</style>
