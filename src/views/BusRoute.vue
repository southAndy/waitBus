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
      <div
        class="search_card"
        v-for="station in apiCollection[0]"
        :key="station"
      >
        <div>
          <h4>{{ station.RouteName.Zh_tw }}</h4>
          <span
            >{{ station.DepartureStopNameZh }} -
            {{ station.DestinationStopNameZh }}</span
          >
        </div>
        <div>
          <img src="@/assets/images/icon/Vector-like.png" alt="收藏按鈕" />
        </div>
      </div>
    </section>
    <div class="search_keyboard">
      <div v-for="button in 20" :key="button" @click="getUserPress">紅</div>
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
  props: { city: String },
  setup(props) {
    let router = useRoute();
    console.log(router.params.City);
    let apiCollection = ref([]);
    function searchBusRoute() {
      //將params作為參數
      getBusApi.route.getSpecificCity(router.params.City).then((response) => {
        apiCollection.value.push(response.data);
      });
      console.log(apiCollection);
    }
    let inputHolder = `${router.params.City}公車查詢`;
    let title = `${router.params.City}中已存路線`;

    function getUserPress() {
      console.log("word");
    }

    return {
      searchBusRoute,
      props,
      inputHolder,
      title,
      getUserPress,
      apiCollection,
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
  padding: 0 15px;

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
    font-size: 14px;
  }
}

.search_keyboard {
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  grid-template-rows: 25% 25% 25% 25%;

  div {
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
</style>
