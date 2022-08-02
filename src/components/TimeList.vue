<template>
  <time
    v-if="busStatus"
    :class="['detail_timetable-in', { 'detail_timetable-last': isLastBus }]"
    >{{ busStatus }}</time
  >
  <time v-else-if="arrivedMinute > 1" class="detail_timetable-in">{{
    arrivedMinute + "分鐘"
  }}</time>
  <time v-else class="detail_timetable-in">{{ "進站中" }}</time>
</template>
<script>
import { computed, toRef, watchEffect, ref } from "vue";
export default {
  props: { time: Number, status: Number },
  setup(props) {
    // 讓props維持reactive

    let apiEstimateTime = toRef(props, "time");
    let apiBusStatus = toRef(props, "status");

    //檢查是否為末班車
    let isLastBus = ref(false);
    watchEffect(() => {
      if (apiBusStatus.value === 3) {
        console.log("是末班車");
        isLastBus.value = true;
      }
    });
    let arrivedMinute = computed(() => Math.floor(apiEstimateTime.value / 60));
    let busStatus = computed(() => {
      let statusList = {
        0: "",
        1: "尚未發車",
        2: "交管不停靠",
        3: "末班車已過",
        4: "今日未營運",
      };
      return statusList[apiBusStatus.value];
    });
    return {
      arrivedMinute,
      busStatus,
      isLastBus,
    };
  },
};
</script>
<style lang="scss" scoped>
.detail_timetable-in {
  background: var(--timelist-bg);
  border: var(--timelist-border);
  border-radius: 2px 12px 12px 2px;
  color: var(--timelist-font);
  width: 75px;
  line-height: 28px;
  margin-right: 10px;
  font-weight: 700;
}
//todo animate -- 進站效果
// @keyframes bus-coming {
//     0%{},
//     50%{

//     },
// }
</style>
