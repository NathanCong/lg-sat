<template>
  <div class="markdown-render" v-html="parsedMarkdown"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { marked } from 'marked'

interface Props {
  content: string
}

const props = defineProps<Props>()

const parsedMarkdown = computed(() => {
  return marked(props.content || '')
})
</script>

<style lang="less">
.markdown-render {
  width: 100%;
  height: auto;
  line-height: 1.5;

  li {
    margin-left: 16px;
  }
}
</style>
