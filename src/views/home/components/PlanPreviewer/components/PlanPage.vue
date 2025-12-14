<template>
  <div class="plan-page">
    <section class="page-header">
      {{ userOptions.year }} 年 LG CNS 根据国家规定的节假日放假计划
    </section>
    <section class="page-mainer">
      <div class="page-tips">
        <span class="tip-colors">
          <template v-for="{ color, label } in colors" :key="color">
            <span class="color-wrapper">
              <span
                class="color-value"
                :style="{ backgroundColor: color }"
              ></span>
              <span class="color-label">{{ label }}</span>
            </span>
          </template>
        </span>
        <span class="tip-box">
          提示：因客户及业务实际状况，需要法定假日加班的，请提前在 U-HCI
          申请加班，并获得审批。
        </span>
      </div>
      <div class="page-plans">
        <template v-for="plan in monthHolidayPlans" :key="plan.month">
          <PlanDetail :user-options="userOptions" :month-holiday-plan="plan" />
        </template>
      </div>
    </section>
    <section class="page-footer">
      <img class="page-logo" :src="imgSrc" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import LogoPNG from '@/assets/images/logo.png'
import PlanDetail from './PlanDetail.vue'

const props = withDefaults(
  defineProps<{
    userOptions: UserOptions
    monthHolidayPlans: MonthHolidayPlan[]
  }>(),
  {
    userOptions: () => ({
      year: '',
      color1: '',
      color2: '',
      color3: ''
    }),
    monthHolidayPlans: () => []
  }
)

const colors = computed(() => {
  const { color1, color2, color3 } = props.userOptions
  return [
    { color: color1, label: '放假（法定节假日）' },
    { color: color2, label: '放假（调休、补休、周末连休）' },
    { color: color3, label: '上班（补班）' }
  ]
})

const imgSrc = ref(LogoPNG)
</script>

<style lang="less" scoped>
.plan-page {
  width: 960px;
  height: 720px;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  padding: 0 32px;
  display: flex;
  flex-direction: column;

  .page-header {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    font-size: 26px;
    line-height: 26px;
    padding-top: 24px;
    padding-bottom: 8px;
    font-weight: bold;
    border-bottom: 4px solid gray;
  }

  .page-mainer {
    flex: 1;
    display: flex;
    flex-direction: column;

    .page-tips {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;

      .tip-colors {
        display: flex;
        flex-direction: column;
        width: auto;
        height: 100%;

        .color-wrapper {
          flex: 1;
          display: flex;
          flex-direction: row;

          .color-value {
            width: 100px;
            margin-right: 16px;
          }

          .color-label {
            font-size: 14px;
            line-height: 14px;
            font-weight: normal;
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }
        }
      }

      .tip-box {
        width: 380px;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 4px solid #000;
        padding: 8px;
        font-size: 16px;
        line-height: 24px;
        font-weight: bold;
        color: #000;
      }
    }

    .page-plans {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }
  }

  .page-footer {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .page-logo {
      width: auto;
      height: 16px;
    }
  }
}
</style>
