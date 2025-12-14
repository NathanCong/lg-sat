import { BlankLayout, DefaultLayout } from '@/layouts/index'

export default [
  /**
   * 根路由
   */
  {
    path: '/',
    redirect: '/tool'
  },
  /**
   * 测试页
   */
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/TestView.vue'),
    meta: {
      layoutComponent: BlankLayout
    }
  },
  /**
   * 工具页
   */
  {
    path: '/tool',
    name: 'tool',
    component: () => import('@/views/tool/ToolView.vue'),
    meta: {
      layoutComponent: DefaultLayout
    }
  },
  /**
   * 通配符路由 - 匹配所有未找到的路由，默认跳转到首页
   */
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
