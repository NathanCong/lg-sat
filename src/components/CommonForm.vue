<template>
  <div class="common-form">
    <a-form
      :layout="layout"
      :colon="colon"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="formState"
      ref="commonFormRef"
    >
      <template v-for="fieldRow in formFieldRows" :key="fieldRow.rowKey">
        <a-row :gutter="24">
          <template v-for="fieldCol in fieldRow.fieldCols" :key="fieldCol.key">
            <a-col :span="colSpan">
              <a-form-item
                :label="fieldCol.label"
                :name="fieldCol.name"
                :rules="fieldCol.rules"
              >
                <!-- Input 组件 -->
                <template v-if="fieldCol.type === 'input'">
                  <a-input
                    v-model:value="formState[fieldCol.name]"
                    :placeholder="fieldCol.options?.placeholder"
                    :style="{
                      width: fieldCol.options?.width || '100%',
                      height: fieldCol.options?.height || 'auto'
                    }"
                    :addon-before="fieldCol.options?.addonBefore"
                    :allow-clear="fieldCol.options?.allowClear"
                    :disabled="fieldCol.options?.disabled"
                  />
                </template>
                <!-- Textarea 组件 -->
                <template v-if="fieldCol.type === 'textarea'">
                  <a-textarea
                    v-model:value="formState[fieldCol.name]"
                    :placeholder="fieldCol.options?.placeholder"
                    :style="{
                      width: fieldCol.options?.width || '100%',
                      height: fieldCol.options?.height || 'auto'
                    }"
                    :allow-clear="fieldCol.options?.allowClear"
                    :disabled="fieldCol.options?.disabled"
                  />
                </template>
                <!-- Date 组件 -->
                <template v-if="fieldCol.type === 'date'">
                  <a-date-picker
                    v-model:value="formState[fieldCol.name]"
                    :placeholder="fieldCol.options?.placeholder"
                    :style="{
                      width: fieldCol.options?.width || '100%',
                      height: fieldCol.options?.height || 'auto'
                    }"
                    :allow-clear="fieldCol.options?.allowClear"
                    :disabled="fieldCol.options?.disabled"
                  />
                </template>
                <!-- DateRange 组件 -->
                <template v-if="fieldCol.type === 'dateRange'">
                  <a-range-picker
                    v-model:value="formState[fieldCol.name]"
                    :style="{
                      width: fieldCol.options?.width || '100%',
                      height: fieldCol.options?.height || 'auto'
                    }"
                    :allow-clear="fieldCol.options?.allowClear"
                    :disabled="fieldCol.options?.disabled"
                  />
                </template>
                <!-- Select 组件 -->
                <template v-if="fieldCol.type === 'select'">
                  <a-select
                    v-model:value="formState[fieldCol.name]"
                    :placeholder="fieldCol.options?.placeholder"
                    :style="{
                      width: fieldCol.options?.width || '100%',
                      height: fieldCol.options?.height || 'auto'
                    }"
                    :options="fieldCol.options?.options"
                    :allow-clear="fieldCol.options?.allowClear"
                    :disabled="fieldCol.options?.disabled"
                  >
                  </a-select>
                </template>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </template>
    </a-form>
    <section class="form-actions">
      <slot name="actions"></slot>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, computed, ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'

const props = withDefaults(
  defineProps<{
    layout?: 'horizontal' | 'vertical'
    colon?: boolean
    colNumber?: number
    labelCol?: { span: number }
    wrapperCol?: { span: number }
    fields?: FieldItem[]
  }>(),
  {
    layout: 'horizontal',
    colon: false,
    colNumber: 1,
    labelCol: () => ({ span: 24 }),
    wrapperCol: () => ({ span: 24 }),
    fields: () => []
  }
)

const formState = reactive<FormState>({})

watch(
  () => props.fields,
  (newFields) => {
    newFields.forEach((field) => {
      formState[field.name] = field.value || field.defaultValue
    })
  },
  { immediate: true }
)

const formFieldRows = computed(() => {
  const newFieldRows: FieldRow[] = []
  let rowIndex = 0
  props.fields.forEach((field, index) => {
    if (index % props.colNumber === 0) {
      rowIndex += 1
      newFieldRows.push({ rowKey: String(rowIndex), fieldCols: [field] })
    } else {
      newFieldRows
        .find((i) => i.rowKey === String(rowIndex))
        ?.fieldCols.push(field)
    }
  })
  return newFieldRows
})

const colSpan = computed(() => {
  if (formFieldRows.value[0]) {
    return 24 / formFieldRows.value[0].fieldCols.length
  }
  return 24
})

const commonFormRef = ref<FormInstance>()

defineExpose({
  getFields: () => formState,
  setFields: (data: FormState) => {
    Object.assign(formState, data)
  },
  resetFields: () => {
    commonFormRef.value?.resetFields()
  },
  submit: () => commonFormRef.value?.validateFields()
})
</script>

<style lang="less" scoped>
.common-form {
  width: 100%;
  height: 100%;

  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
