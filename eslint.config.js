import typescriptParser from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript'
import vuePrettierConfig from '@vue/eslint-config-prettier'

export default defineConfigWithVueTs(
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        project: ['./tsconfig.json']
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },
  // Vue 3 推荐规则
  pluginVue.configs['flat/essential'],
  // Vue TypeScript 配置
  vueTsConfigs.recommended,
  // Vue Prettier 配置
  vuePrettierConfig,
  // 自定义配置
  {
    ignores: ['.husky/', 'dist/', 'node_modules/'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
)
