<template>
  <nav class="navbar">
    <div class="navbar_previous" @click="toPrevious">
      <img src="@/assets/images/icon/arror.png" alt="上一頁" />
    </div>
    <!-- 以slot的方式根據不同頁面接收不同內容 -->
    <slot></slot>
  </nav>
</template>
<script setup>
function toPrevious() {
  console.log("toPrevious");
  history.back();
}
</script>
<style lang="scss" scoped>
@use "@/assets/scss/colors";
.navbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  height: 55px;

  font-size: 21px;
  color: white;
  background-color: colors.$main-navbar;

  &_previous {
    display: flex;
  }
}
</style>
