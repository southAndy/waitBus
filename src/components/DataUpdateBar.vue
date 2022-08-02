<template>
  <time>{{ busDrivingUpdate + "秒鐘前更新" }}</time>
</template>
<script>
import dayjs from "dayjs";
import { computed } from "vue";
export default {
  props: { update: String },
  setup(props) {
    // let x = computed(() => 1);
    let busDrivingUpdate = computed(() => dayjs(props.update).$m);
    return {
      props,
      busDrivingUpdate,
    };
  },
};
</script>
