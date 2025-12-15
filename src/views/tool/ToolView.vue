<template>
  <div class="tool">
    <!-- 设置区域 -->
    <section class="settings-wrapper">
      <CommonCard mode="auto" title="用户设置" :show-footer="false">
        <div class="settings">
          <a-upload
            accept=".json"
            :before-upload="onBeforeUploadForJson"
            :max-count="1"
            :multiple="false"
            :show-upload-list="false"
          >
            <a-button type="primary" :disabled="userQuestions.length > 0">
              上传用户问题（.json）
            </a-button>
          </a-upload>
          <a-upload
            accept=".xls"
            :before-upload="onBeforeUploadForXls"
            :max-count="1"
            :multiple="false"
            :show-upload-list="false"
          >
            <a-button type="primary" :disabled="statisticalData.length > 0">
              上传统计数据（.xls）
            </a-button>
          </a-upload>
          <a-button
            type="primary"
            :disabled="!(statisticalData.length > 0)"
            @click="onAnalysis"
          >
            开始分析
          </a-button>
        </div>
      </CommonCard>
    </section>
    <section class="results-wrapper">
      <CommonLoading :is-loading="loading" mode="full">
        <CommonCard mode="full" title="分析结果" :show-footer="false">
          <div class="results">
            <template
              v-if="selectQuestions.length < 1 || textQuestions.length < 1"
            >
              <CommonEmpty />
            </template>
            <template v-else>
              <section class="result-row">
                <p class="result-title">统计人数</p>
                <p class="result-content">{{ total }}</p>
              </section>
              <section class="result-row">
                <p class="result-title">选择题统计</p>
                <p class="result-content">
                  <template v-for="q in selectQuestions" :key="q.content">
                    <span class="result-line blue">
                      {{ q.index }}.{{ q.content }}
                    </span>
                    <template v-for="o in q.options" :key="o.label">
                      <span class="result-line">
                        {{ o.value }}.{{ o.label }}
                        <strong>
                          {{ ((o.count / total) * 100).toFixed() }}%
                        </strong>
                      </span>
                    </template>
                  </template>
                </p>
              </section>
              <section class="result-row">
                <p class="result-title">描述题统计</p>
                <p class="result-content">
                  <template v-for="q in textQuestions" :key="q.content">
                    <span class="result-line blue">
                      {{ q.index }}.{{ q.content }}
                    </span>
                    <span class="result-line">
                      <MarkdownRender :content="q.analysis || ''" />
                    </span>
                  </template>
                </p>
              </section>
              <section class="result-row">
                <p class="result-title">整体分析结果</p>
                <p class="result-content">
                  <MarkdownRender :content="summary || ''" />
                </p>
              </section>
            </template>
          </div>
        </CommonCard>
      </CommonLoading>
    </section>
  </div>
</template>

<script lang="ts" setup>
import * as xlsx from 'xlsx'
import { computed, ref, watch } from 'vue'
import { CommonCard, CommonEmpty, CommonLoading } from '@/components/index'
import MarkdownRender from './MarkdownRender.vue'
import { qwen } from '@/apis/index'
import { USER_QUESTIONS } from './constants/index'

// 用户问题（上传的 json 文件）
const userQuestions = ref<UserQuestion[]>(USER_QUESTIONS)

function onBeforeUploadForJson(file: File) {
  console.log('file', file)
  return false
}

const questions = ref<Question[]>([])

watch(
  () => userQuestions.value,
  (newValue) => {
    questions.value = newValue.map((item, index) => {
      const { question, options } = item
      const newItem: Question = {
        index: index + 1,
        content: question,
        type: options ? 'select' : 'text'
      }
      if (options) {
        newItem.options = options.map((label, index) => ({
          label,
          value: String(index + 1),
          count: 0
        }))
      }
      return newItem
    })
  },
  { immediate: true }
)

// 统计数据（上传的 xls 文件）
const statisticalData = ref<Array<string[]>>([])

const columns = computed(() => statisticalData.value.slice(0, 1)[0])

const results = computed(() => statisticalData.value.slice(1))

// 参与统计总人数
const total = computed(() => results.value.length)

const questionStartIndex = ref(6)

function onBeforeUploadForXls(file: File) {
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
      statisticalData.value = xlsx.utils.sheet_to_json(sheet, {
        header: 1,
        raw: true,
        defval: ''
      })
    } catch (err) {
      console.error(err)
    }
  }
  reader.readAsArrayBuffer(file)
  return false
}

watch(
  () => results.value,
  (newValue) => {
    newValue.forEach((values) => {
      let qIndex = 0
      values.forEach((value, index) => {
        // 与问题答案无关的列
        if (index < questionStartIndex.value) {
          return
        }
        const questionKey = columns.value[index]
        // 当前列为上一道选项题目的其他
        if (questionKey === 'TextBox') {
          const { options } = questions.value[qIndex - 1]
          const target = options?.find((i) => i.value === value)
          if (target) {
            target.other = value
          }
          return
        }
        const currentQuestion = questions.value[qIndex]
        if (!currentQuestion) {
          return
        }
        const { type, options } = currentQuestion
        // 选项统计个数
        if (type === 'select') {
          const target = options?.find((i) => i.value === String(value))
          if (target) {
            target.count += 1
          }
        }
        // 描述统计答案
        if (type === 'text') {
          if (!currentQuestion.answers) {
            currentQuestion.answers = []
          }
          currentQuestion.answers.push(value)
        }
        qIndex += 1
      })
    })
  },
  { immediate: true }
)

watch(
  () => questions.value,
  (newValue) => {
    console.log('questions', newValue)
  },
  { immediate: true, deep: true }
)

const selectQuestions = ref<Question[]>([])

const textQuestions = ref<Question[]>([])

const loading = ref(false)

const summary = ref<string>('')

async function onAnalysis() {
  // 拆分选项分析
  selectQuestions.value = questions.value.filter((q) => q.type === 'select')
  // 拆分描述分析
  const tQuestions = questions.value.filter((q) => q.type === 'text')
  loading.value = true
  for (let i = 0; i < tQuestions.length; i += 1) {
    const { content, answers = [] } = tQuestions[i]
    try {
      const text = `我在做一个企业员工调查\n其中有一道问题：${content}\n员工们的回答是（已经使用、号分割用户答案）：${answers.join('、')} \n请帮我用最简短的语言统计员工对于这个问题的倾向`
      const { data } = await qwen([text])
      tQuestions[i].analysis = data.choices[0].message.content
      // console.log('text', text)
    } catch (err) {
      console.error(err)
    }
  }
  loading.value = false
  textQuestions.value = tQuestions
  // 拆分整体分析
  loading.value = true
  let text = '我在做一个企业员工调查\n我的调查问卷以及调查结果如下：\n'
  selectQuestions.value.forEach((item) => {
    const { content, options } = item
    text += `问题： ${content}\n结果：${options?.map((o) => `${o.label}(${((o.count / total.value) * 100).toFixed()}%)`).join(' ')}\n`
  })
  text += `请用相对简介的语言帮我整体总结一下，问卷调查的结果`
  // console.log('text', text)
  try {
    const { data } = await qwen([text])
    summary.value = data.choices[0].message.content
  } catch (err) {
    console.error(err)
  }
  loading.value = false
}
</script>

<style lang="less" scoped>
.tool {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: row;

  .settings-wrapper {
    width: 300px;
    height: auto;
    margin-right: 16px;

    .settings {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      padding: 0 16px;
      display: flex;
      flex-direction: column;

      :deep(.ant-upload-wrapper) {
        width: 100%;
      }

      :deep(.ant-upload) {
        width: 100%;
      }

      :deep(.ant-btn) {
        width: 100%;
        margin-bottom: 16px;
      }
    }
  }

  .results-wrapper {
    flex: 1;

    .results {
      width: 100%;
      min-width: 900px;
      height: 100%;
      box-sizing: border-box;
      padding: 0 16px;

      .result-row {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;

        .result-title {
          font-weight: bold;
          margin-bottom: 8px;
        }

        .result-content {
          display: flex;
          flex-direction: column;

          .result-line {
            margin-bottom: 4px;

            &.blue {
              color: blue;
            }
          }
        }
      }
    }
  }
}
</style>
