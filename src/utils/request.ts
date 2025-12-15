import axios from 'axios'
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse
} from 'axios'
import { notification } from 'ant-design-vue'

/**
 * 创建公共 headers
 */
const commonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

/**
 * 创建 axios 实例
 */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 1000 * 100
})

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => {
    notification.error({ message: '网络请求错误', description: error.message })
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    let description = ''
    if (error.response?.status) {
      // 服务器返回了错误状态码
      const errorStatus = error.response?.status
      const errorMessageMap: Record<number, string> = {
        400: '客户端请求错误',
        401: '未授权，需要身份验证',
        403: '禁止访问，服务器拒绝请求',
        404: '请求的资源不存在',
        500: '服务器内部错误',
        502: '网关错误',
        503: '服务不可用'
      }
      description = errorMessageMap[errorStatus] || '未知错误'
    } else if (error.request) {
      // 请求已经发送，但没有收到响应
      description = '网络连接异常或服务器无响应'
    } else {
      // 其他未知错误
      description = error.message || '未知错误'
    }
    notification.error({ message: '服务响应异常', description })
    return Promise.reject(error)
  }
)

/**
 * GET 请求
 */
export function get(
  url: string,
  params?: unknown,
  headers?: Record<string, string>
) {
  return request.get(url, { params, headers: { ...commonHeaders, ...headers } })
}

/**
 * POST 请求
 */
export function post(
  url: string,
  data?: unknown,
  headers?: Record<string, string>
) {
  return request.post(url, data, { headers: { ...commonHeaders, ...headers } })
}
