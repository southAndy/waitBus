<template>
  <router-view />
</template>
<script>
export default {
  setup() {},
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  color: var(--background-color-primary);
}
:root {
  --background-color-primary: #f8f2e5;
  --home-logo-primary: black;
  --home-item-bg-primary: #f8f8f8;
  --home-item-font-primary: #373232;
  --home-select-bg-primary: linear-gradient(
      138.74deg,
      rgba(230, 206, 173, 0.3) 8.67%,
      rgba(242, 229, 210, 0.3) 11.9%,
      rgba(230, 206, 173, 0.3) 11.91%,
      rgba(230, 206, 173, 0.3) 13.34%,
      rgba(230, 206, 173, 0.3) 16.58%,
      rgba(242, 229, 210, 0.3) 17.66%,
      rgba(242, 229, 210, 0.3) 30.6%,
      rgba(230, 206, 173, 0.3) 30.61%,
      rgba(235, 211, 176, 0.3) 76.26%
    ),
    #f8f2e5;
  --home-select-font-primary: #373232;
  --navbar-bg: #61a68a;
  //laflet -- setting :https://gist.github.com/BrendonKoz/b1df234fe3ee388b402cd8e98f7eedbd
  --map-tiles-filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg)
    saturate(0.3) brightness(0.7);
}
:root.dark-theme {
  --background-color-primary: #676565;
  --home-logo-primary: white;
  --home-item-bg-primary: #373232;
  --home-item-font-primary: #f8f8f8;
  --home-select-bg-primary: #373232;
  --home-select-font-primary: #f8f8f8;
  --navbar-bg: #373232;
}
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    color: var(--background-color-primary);
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
