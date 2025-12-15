import { post } from '@/utils/request'

export function qwen(contents: string[]) {
  return post(
    'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    {
      model: 'qwen-plus',
      messages: contents.map((content) => ({ role: 'user', content }))
    },
    {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
  )
}
