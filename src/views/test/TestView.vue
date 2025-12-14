<template>
  <div class="test">
    <!-- 测试 CommonHeader -->
    <section class="test-header">
      <CommonHeader
        :show-logo="true"
        :logo-src="LogoSVG"
        :show-title="true"
        title="慧恩齐家医疗科技"
        :show-sub-title="true"
        sub-title="HR系统"
        :show-actions="true"
      >
        <template #actions>
          <a-button type="primary">测试</a-button>
        </template>
      </CommonHeader>
    </section>
    <!-- 测试 CommonLoading -->
    <section class="test-loading">
      <CommonLoading
        mode="auto"
        :is-loading="true"
        size="default"
        tip="加载中..."
      >
        <div class="loading-inner"></div>
      </CommonLoading>
    </section>
    <!-- 测试 CommonEmpty -->
    <section class="test-empty">
      <CommonEmpty />
    </section>
    <!-- 测试 CommonForm -->
    <section class="test-form">
      <CommonForm
        layout="vertical"
        :colon="true"
        :col-number="3"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :fields="FORM_FIELDS"
        ref="commonFormRef"
      >
        <template #actions>
          <a-button type="default" style="margin-left: 8px" @click="onReset">
            重置
          </a-button>
          <a-button type="primary" style="margin-left: 8px" @click="onSubmit">
            提交
          </a-button>
        </template>
      </CommonForm>
    </section>
    <!-- 测试 CommonTable -->
    <section class="test-table">
      <CommonTable
        title="测试表格"
        :columns="TABLE_COLUMNS"
        :data-source="dataSource"
        :pagination="pagination"
        :is-loading="loading"
        @page-change="onPageChange"
      >
        <template #header-actions>
          <a-button type="primary" style="margin-left: 8px" :disabled="loading"
            >刷新列表</a-button
          >
          <a-button type="primary" style="margin-left: 8px" :disabled="loading"
            >新增项目</a-button
          >
        </template>
        <template #thead-cell="{ title }">
          <span class="thead-cell">{{ title }}</span>
        </template>
        <template #tbody-cell="{ column, text }">
          <span class="tbody-cell">
            <template v-if="column.key === 'actions'">
              <a-button type="link">查看</a-button>
              <a-button type="link">编辑</a-button>
              <a-button type="link">删除</a-button>
            </template>
            <template v-else-if="column.key === 'column5'">
              {{ dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-else>{{ text }}</template>
          </span>
        </template>
      </CommonTable>
    </section>
    <!-- 测试 CommonCard -->
    <section class="test-card">
      <CommonCard title="测试卡片">
        <div>这里是 CommonCard 的内容</div>
      </CommonCard>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import CommonHeader from '@/components/CommonHeader.vue'
import CommonLoading from '@/components/CommonLoading.vue'
import CommonEmpty from '@/components/CommonEmpty.vue'
import CommonForm from '@/components/CommonForm.vue'
import CommonTable from '@/components/CommonTable.vue'
import CommonCard from '@/components/CommonCard.vue'
import LogoSVG from './assets/images/logo.svg'
import { FORM_FIELDS, TABLE_COLUMNS } from './constants/index'

const commonFormRef = ref()

const loading = ref(false)

const pagination = ref({
  pageNum: 1,
  pageSize: 20,
  total: 0
})

const dataSource = ref<unknown[]>([])

function getDataSource(
  pageNum: number,
  pageSize: number
): Promise<{
  pageNum: number
  pageSize: number
  list: unknown[]
  total: number
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = new Array(pageSize).fill(null).map((_, index) => {
        const newItem: { [key: string]: unknown } = {}
        TABLE_COLUMNS.forEach((item: ColumnItem) => {
          if (typeof item.dataIndex === 'string') {
            if (item.dataIndex === 'column0') {
              newItem[item.dataIndex] = (pageNum - 1) * pageSize + index + 1
            } else if (item.dataIndex === 'column5') {
              newItem[item.dataIndex] = dayjs()
            } else {
              newItem[item.dataIndex] = item.key
            }
          }
        })
        return newItem
      })
      resolve({
        pageNum,
        pageSize,
        total: 100,
        list
      })
    }, 1000)
  })
}

async function onPageChange(pageNum: number) {
  loading.value = true
  // dataSource.value = []
  try {
    const { pageSize } = pagination.value
    const { list, total } = await getDataSource(pageNum, pageSize)
    pagination.value = Object.assign({}, pagination.value, { pageNum, total })
    dataSource.value = list
  } catch (err) {
    console.warn(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  onPageChange(1)
})

function onReset() {
  commonFormRef.value.resetFields()
}

function onSubmit() {
  commonFormRef.value
    .submit()
    .then((res: unknown) => {
      console.log(res)
    })
    .catch((err: unknown) => {
      console.warn(err)
    })
}
</script>

<style lang="less" scoped>
.test {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px;

  .test-header {
    width: 100%;
    height: 60px;
  }

  .test-loading {
    margin-top: 16px;

    .loading-inner {
      width: 100%;
      height: 200px;
      background-color: #fff;
    }
  }

  .test-empty {
    width: 100%;
    height: 200px;
    background-color: #fff;
    margin-top: 16px;
  }

  .test-form {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
  }

  .test-table {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    height: 500px;
    background-color: #fff;
    margin-top: 16px;

    .thead-cell,
    .tbody-cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .test-card {
    width: 100%;
    height: auto;
    margin-top: 16px;
  }
}
</style>
