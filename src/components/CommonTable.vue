<template>
  <div class="common-table">
    <!-- 表格头部 -->
    <section class="table-header">
      <span class="header-title">{{ title }}</span>
      <span class="header-actions">
        <slot name="header-actions"></slot>
      </span>
    </section>
    <!-- 表格主体 -->
    <section class="table-wrapper" ref="tableWrapperRef">
      <CommonLoading :is-loading="isLoading" size="default">
        <div class="loading-inner">
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :scroll="{ x: tableScrollX, y: tableScrollY }"
            :pagination="false"
            ref="tableRef"
          >
            <!-- 表头单元格 -->
            <template #headerCell="{ title, column }">
              <slot name="thead-cell" :title="title" :column="column"></slot>
            </template>
            <!-- 列表单元格 -->
            <template #bodyCell="{ text, value, record, index, column }">
              <slot
                name="tbody-cell"
                :text="text"
                :value="value"
                :record="record"
                :index="index"
                :column="column"
              ></slot>
            </template>
          </a-table>
          <!-- 表格分页 -->
          <template v-if="dataSource.length > 0">
            <section class="table-pagination">
              <a-pagination
                :current="pagination.pageNum"
                :page-size="pagination.pageSize"
                :show-quick-jumper="false"
                :show-size-changer="false"
                :show-total="(total: number) => `共 ${total} 条`"
                :total="pagination.total"
                @change="onChange"
              />
            </section>
          </template>
          <!-- 数据空状态 -->
          <template v-else>
            <section class="table-empty">
              <CommonEmpty />
            </section>
          </template>
        </div>
      </CommonLoading>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import CommonEmpty from './CommonEmpty.vue'
import {
  getElementWidth,
  getElementHeight,
  getElementByClassName
} from '@/utils/element'

const props = withDefaults(
  defineProps<{
    title?: string
    columns?: ColumnItem[]
    dataSource?: unknown[]
    pagination?: Pagination
    isLoading?: boolean
  }>(),
  {
    title: 'CommonTable',
    columns: () => [],
    dataSource: () => [],
    pagination: () => ({ pageNum: 1, pageSize: 20, total: 0 }),
    isLoading: false
  }
)

const tableWrapperRef = ref<HTMLElement | null>(null)

const tableScrollX = ref(0)

watch(
  () => props.columns,
  (newColumns) => {
    let fixedWidth = 0
    newColumns.forEach((column) => {
      if (column.fixed) {
        fixedWidth += column.width || 0
      }
    })
    // 没有固定列，不处理
    if (fixedWidth < 1) {
      tableScrollX.value = 0
      return
    }
    // 有固定列，计算滚动宽度（总宽 + 固定列宽度）
    nextTick(() => {
      // 获取 tableWrapper 元素宽度
      const tableWrapperWidth = getElementWidth(tableWrapperRef.value)
      // 设置 tableScrollX
      tableScrollX.value = tableWrapperWidth + fixedWidth
    })
  },
  { immediate: true }
)

const tableScrollY = ref(0)

watch(
  () => props.dataSource,
  (newDataSource) => {
    // 没数据，不处理
    if (newDataSource.length < 1) {
      tableScrollY.value = 0
      return
    }
    // 有数据，计算滚动高度（总高 - 表头高度 - 分页高度）
    nextTick(() => {
      // 获取 tableWrapper 元素高度
      const tableWrapperHeight = getElementHeight(tableWrapperRef.value)
      // 获取 tableThead 元素高度
      const tableTheadElement = getElementByClassName('ant-table-thead')
      const tableTheadHeight = getElementHeight(tableTheadElement)
      // 获取 tablePagination 元素高度
      const tablePaginationElement = getElementByClassName('table-pagination')
      const tablePaginationHeight = getElementHeight(tablePaginationElement)
      // 设置 tableScrollY
      tableScrollY.value =
        tableWrapperHeight - tableTheadHeight - tablePaginationHeight
      // 自动滚动到顶部
      const tableBodyElement = getElementByClassName('ant-table-body')
      if (tableBodyElement) {
        tableBodyElement.scrollTop = 0
      }
    })
  },
  { immediate: true }
)

const tableRef = ref(null)

const emit = defineEmits(['pageChange'])

function onChange(pageNum: number) {
  emit('pageChange', pageNum)
}
</script>

<style lang="less" scoped>
.common-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 16px 0;

    .header-title {
      font-size: 16px;
      line-height: 16px;
      font-weight: bold;
    }
  }

  .table-wrapper {
    flex: 1;

    .loading-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .table-empty {
        flex: 1;
      }

      .table-pagination {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 16px 0;
      }
    }
  }
}
</style>
