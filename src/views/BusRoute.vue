<template>
  <section>
    <common-navbar-vue>
      <input
        @change="searchBusRoute"
        class="search_input"
        type="text"
        :placeholder="inputHolder"
      />
    </common-navbar-vue>
    <section class="search_content">
      <h3>{{ title }}</h3>
      <router-link
        :to="{
          name: 'StationDeatil',
          params: {
            UID: station.RouteUID,
          },
          query: {
            routeName: station.RouteName.Zh_tw,
            city: city,
          },
        }"
        class="search_card"
        v-for="station in apiCollection"
        :key="station"
      >
        <div>
          <h4>{{ station.RouteName.Zh_tw }}</h4>
          <span
            >{{ station.DepartureStopNameZh }} -
            {{ station.DestinationStopNameZh }}</span
          >
        </div>
        <div @click="storeBusRoute(station.RouteUID)">
          <font-awesome-icon
            icon="fa-solid fa-heart"
            :class="[
              { stored: isStoreRoute === station.RouteUID },
              'search_store',
            ]"
          />
        </div>
      </router-link>
    </section>
    <div class="search_keyboard">
      <div v-for="item in keyboard" :key="item" @click="getUserPress">
        {{ item.key }}
      </div>
    </div>
  </section>
</template>
<script>
import CommonNavbarVue from "@/components/CommonNavbar.vue";
import getBusApi from "@/service/getBusApi";
import { ref } from "vue";
import { useRoute } from "vue-router";
export default {
  components: { CommonNavbarVue },
  setup(props) {
    let router = useRoute();
    let apiCollection = ref([]);
    //下方鍵盤參數
    let keyboard = ref([
      { key: "紅" },
      { key: "藍" },
      { key: 1 },
      { key: 2 },
      { key: 3 },
      { key: "綠" },
      { key: "綠" },
      { key: 4 },
      { key: 5 },
      { key: 6 },
      { key: "橘" },
      { key: "小" },
      { key: 7 },
      { key: 8 },
      { key: 9 },
      { key: "其他" },
      { key: "幹線" },
      { key: "重設" },
      { key: "0" },
      { key: "delet" },
    ]);
    let isStoreRoute = ref(false);
    async function searchBusRoute(e) {
      let api;
      //將params作為參數
      await getBusApi.route
        .getSpecificCity(router.params.City)
        .then((response) => {
          api = response.data;
        });
      //篩選對應關鍵字
      apiCollection.value = api.filter((data) =>
        data?.RouteName.Zh_tw.includes(e.target.value)
      );
    }
    let city = router.params.City;
    let inputHolder = `${router.params.City}公車查詢`;
    let title = `${router.params.City}中已存路線`;

    function storeBusRoute(id) {
      isStoreRoute.value = id;
    }

    //下方鍵盤
    function getUserPress() {
      console.log("word");
    }

    return {
      searchBusRoute,
      storeBusRoute,
      getUserPress,
      props,
      inputHolder,
      title,
      apiCollection,
      isStoreRoute,
      keyboard,
      city,
    };
  },
};
</script>
<style lang="scss" scoped>
@use "@/assets/scss/colors";
@use "@/assets/scss/reset";
.search_input {
  height: 37px;
  width: 273px;

  font-size: 16px;

  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  background-color: #f8f8f8;
  //   background: url(@/assets/images/icon/Vector-search.png) #f8f8f8 no-repeat 5%;
}
.search_content {
  background: colors.$main_bg;
  background: var(--background-color-primary);
  padding: 0 15px;
  // 沒有資料的預設高
  min-height: 1000px;

  h3 {
    font-size: 16px;
    text-align: start;
  }
}
.search_card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  margin-bottom: 10px;

  //style
  background: #f8f8f8;
  /* block-shadows */
  box-shadow: 0px 2px 1px 1px rgba(0, 0, 0, 0.15);
  border-radius: 4px;

  h4 {
    font-size: 18px;
    text-align: start;
  }

  span {
    display: block;
    text-align: start;
    font-size: 14px;
  }
}
.search_store {
  width: 25px;
  height: 25px;
}
.stored {
  color: #b96c58;
}

.search_keyboard {
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  grid-template-rows: 25% 25% 25% 25%;

  //鍵盤定位
  position: fixed;
  bottom: 0%;
  width: 100%;
  height: 30%;
  div {
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--home-select-bg-primary);
    color: var(--home-item-font-primary);
    /* light */

    border: 3px solid #ffffff;
    /* block-shadows */

    box-shadow: 0px 2px 1px 1px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
  }
}
</style>
