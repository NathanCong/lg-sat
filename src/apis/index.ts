import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
})

export function qwen(contents: string[]) {
  return new Promise((resolve, reject) => {
    openai.chat.completions
      .create({
        model: 'qwen-plus',
        messages: contents.map((i) => ({ role: 'user', content: i }))
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}
