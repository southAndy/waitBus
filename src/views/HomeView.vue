<template>
  <section class="home">
    <header class="home_logo">
      <q-toggle
        v-model="isDailyMode"
        color="green"
        class="mode"
        @click="switchThemeMode"
      />
      <div>
        <img :src="image" alt="logo" />
      </div>
      <h1>台灣搭公車</h1>
    </header>
    <main>
      <div class="home_nearby">
        <h3 class="home_nearby-title">查詢附近</h3>
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
        <!-- <p>使用查詢附近服務需先打開定位服務 讓本網站取用您的位置</p> -->
      </div>
      <section class="home_select">
        <h3>查詢公車路線</h3>
        <div class="home_select-items">
          <router-link
            :to="{ name: 'BusRoute', params: { City: city.en } }"
            v-for="city in cityList"
            :key="city"
            >{{ city.zh }}
          </router-link>
        </div>
      </section>
    </main>
    <footer>
      <p>
        © Bus Taking 台灣搭公車 - Design by Jujubeleven Liao, For THE F2E 2021
        week 3
      </p>
    </footer>
  </section>
</template>

<script>
// import getNearStation from "@/store/Bus/getNearStation";
import useStore from "@/store/index";
// import getBusApi from "@/service/getBusApi";
import { ref } from "vue";

export default {
  name: "HomeView",
  components: {},
  setup() {
    //引入pinia
    const store = useStore();
    //在進入首頁時就發API取token
    store.getSpecificCity("Taipei");

    // quasar item : 控制日夜間模式
    let isDailyMode = ref(true);
    let image = ref(require("@/assets/images/LOGO-green.png"));
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
    function switchThemeMode() {
      document.documentElement.classList.toggle("dark-theme");
    }

    return {
      isDailyMode,
      cityList,
      switchThemeMode,
      image,
    };
  },
};
</script>
<style lang="scss" scoped>
@use "@/assets/scss/reset.scss";
@use "@/assets/scss/breakpoints";
.home {
  position: relative;
  //背景設定
  background-color: var(--background-color-primary);
  background-repeat: no-repeat;
  background-position-y: 30%;
  background-image: url("@/assets/images/main-3\ 1.png");
  height: 100vh;
  //間距
  padding: 0 16px;

  @include breakpoints.tablet {
    background-position-y: 23%;
    background-position-x: 35%;
    background-image: url("@/assets/images/main\ 1.png");
    padding: 0 70px;
  }
  @include breakpoints.desktop {
    background-position-y: 55%;
    background-position-x: 10%;
  }

  &_logo {
    display: flex;
    flex-direction: column;
    font-size: 20px;
    align-items: center;
    margin: 0;

    @include breakpoints.desktop {
      position: absolute;
      left: 23%;
      top: 15%;
    }

    h1 {
      color: var(--home-logo-primary);
      font-size: 16px;
      font-weight: 400;
      line-height: 15px;

      margin: 0;
    }
    .mode {
      margin-left: 300px;
      @include breakpoints.tablet {
        margin-left: 80%;
      }
      @include breakpoints.desktop {
        margin: 0 auto;
      }
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
    top: 55%;
    right: 0;
    left: 0;

    @include breakpoints.tablet {
      flex-wrap: wrap;
      justify-content: start;
      left: 10%;
      right: unset;
      top: 50%;
    }
    @include breakpoints.desktop {
      left: 50%;
      top: 20%;
    }

    &-title {
      display: none;
      @include breakpoints.tablet {
        display: block;
        flex-basis: 100%;
        color: var(--home-item-font-primary);
        font-size: 22px;
        text-align: start;
        // background-image: url("@/assets/images/icon/Rectangle\ 34.png");
        background-repeat: no-repeat;
      }
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 37px;
      width: 167px;
      //樣式
      background-color: var(--home-item-bg-primary);
      border-radius: 4px;
      @include breakpoints.tablet {
        flex-direction: column;
        height: 75px;
      }

      .icon {
        display: flex;
        width: 25px;
        height: 25px;

        img {
          width: 100%;
          object-fit: contain;
        }
      }
      span {
        color: var(--home-item-font-primary);

        @include breakpoints.tablet {
          font-size: 20px;
        }
      }
    }
  }
  &_select {
    position: absolute;
    bottom: 5%;
    margin-top: 24px;

    @include breakpoints.tablet {
      bottom: 3%;
    }
    @include breakpoints.desktop {
      left: 50%;
      top: 40%;
    }

    h3 {
      color: var(--home-item-font-primary);
      font-size: 16px;
      margin: 0;
      text-align: start;

      @include breakpoints.tablet {
        font-size: 22px;
      }
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
        background: var(--home-select-bg-primary);
        color: var(--home-select-font-primary);
        border: 3px solid #ffffff;
        /* block-shadows */

        box-shadow: 0px 2px 1px 1px rgba(0, 0, 0, 0.15);
        border-radius: 6px;
        @include breakpoints.tablet {
          width: 150px;
        }
      }
    }
  }
  footer {
    display: none;

    @include breakpoints.desktop {
      background-color: var(--navbar-bg);
    }
  }
}
</style>
