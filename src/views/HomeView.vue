<template>
  <section class="home">
    <header class="home_logo">
      <q-toggle v-model="first" color="green" class="mode" />
      <div>
        <img src="@/assets/images/LOGO-green.png" alt="logo" />
      </div>
      <h1>台灣搭公車</h1>
    </header>
    <div class="home_nearby">
      <router-link class="home_nearby-item" :to="{ name: 'NearbyStation' }">
        <div class="icon">
          <img src="@/assets/images/icon/map-mark.png" alt="附近站牌" />
        </div>
        <span>附近站牌</span>
      </router-link>
      <div class="home_nearby-item">
        <div class="icon">
          <img src="@/assets/images/icon/Vector.png" alt="附近單車" />
        </div>
        <span>附近單車</span>
      </div>
    </div>
    <footer class="home_select">
      <h3>查詢公車路線</h3>
      <div class="home_select-items">
        <router-link
          :to="{ name: 'BusRoute', params: { City: city.en } }"
          v-for="city in cityList"
          :key="city"
          >{{ city.zh }}
        </router-link>
      </div>
    </footer>
  </section>
</template>

<script>
// @ is an alias to /src
// import busApi from "@/service/getBusApi";
import { getToken } from "@/service/getToken";
import getNearStation from "@/store/Bus/getNearStation";
import {
  ref,
  // onMounted
} from "vue";

export default {
  name: "HomeView",
  components: {},
  setup() {
    //引入pinia
    const store = getNearStation();
    store.getToken();
    // quasar item
    let first = ref(true);

    let cityList = ref([
      { zh: "台北市", en: "Taipei" },
      { zh: "新北市", en: "NewTaipei" },
      { zh: "桃園市", en: "Taoyuan" },
      { zh: "台中市", en: "Taichung" },
      { zh: "臺南市", en: "Tainan" },
      { zh: "高雄市", en: "kaohsiung" },
      { zh: "公路客運", en: "Taipei" },
      { zh: "已儲存路線", en: "Taipei" },
    ]);
    let list = ref([]);
    let token = () => async () => {
      await getToken;
      return getToken.access_token;
    };
    //token 給 pinia

    return {
      first,
      cityList,
      list,
      token,
    };
  },
};
</script>
<style lang="scss" scoped>
@use "@/assets/scss/reset.scss";
.mode {
  margin-left: 300px;
}
.home {
  position: relative;
  //背景設定
  background-color: antiquewhite;
  background-repeat: no-repeat;
  background-position-y: 30%;
  background-image: url("@/assets/images/main-3\ 1.png");
  height: 100vh;

  //間距
  padding: 0 16px;

  &_logo {
    display: flex;
    flex-direction: column;
    font-size: 20px;
    align-items: center;
    margin: 0;

    h1 {
      font-size: 16px;
      font-weight: 400;
      line-height: 15px;

      margin: 0;
    }
  }
  &_nearby {
    //排序
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    //位置
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 37px;
      width: 167px;
      //樣式
      background-color: #f8f8f8;
      border-radius: 4px;

      .icon {
        display: flex;
        width: 25px;
        height: 25px;

        img {
          width: 100%;
          object-fit: contain;
        }
      }
    }
  }
  &_select {
    position: absolute;
    bottom: 15%;
    margin-top: 24px;

    h3 {
      font-size: 16px;
      margin: 0;
      text-align: start;
    }
    &-items {
      display: grid;
      grid-template-columns: 25% 25% 25% 25%;
      grid-template-rows: 78px 78px;
      gap: 4px;

      a {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;

        //style
        background: linear-gradient(
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
        /* light */

        border: 3px solid #ffffff;
        /* block-shadows */

        box-shadow: 0px 2px 1px 1px rgba(0, 0, 0, 0.15);
        border-radius: 6px;
      }
    }
  }
}
</style>
