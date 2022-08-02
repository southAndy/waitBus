<template>
  <time>{{ props.update + "秒鐘前更新" }}</time>
</template>
<script>
export default {
  props: { update: String },
  setup(props) {
    return {
      props,
    };
  },
};
</script>
