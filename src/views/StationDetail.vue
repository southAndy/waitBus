<template>
  <main class="detail">
    <common-navbar>
      <div @click="switchMode" class="mode">
        <img src="@/assets/images/icon/to-map-light.png" alt="切換顯示地圖" />
      </div>
      <div class="select">
        <img src="@/assets/images/icon/Group.png" alt="更多資訊" />
      </div>
    </common-navbar>
    <div v-if="busRouteDirection" class="detail_direction">
      <SelectButton
        @click="switchDirection(0)"
        :class="[{ active: currDirection === 0 }]"
      >
        {{ busRouteDirection[0].DepartureStopNameZh }}
      </SelectButton>
      <SelectButton
        @click="switchDirection(1)"
        :class="[{ active: currDirection === 1 }]"
      >
        {{ busRouteDirection[0].DestinationStopNameZh }}
      </SelectButton>
    </div>
    <div v-if="busStationInfo">
      <section v-show="!isMapMode" class="detail_timetable">
        <DataUpdateBar
          class="detail_timetable-update"
          :update="busStationInfo[0]?.UpdateTime"
        />
        <div>
          <!-- todo fix  報錯造成leaflet無法持續更新-->
          <div
            class="detail_timetable-list"
            v-for="timetable in currentDirectionAPIs"
            :key="timetable.RouteUID"
          >
            <!-- ? time ->對應車班的時間 status ->公車是否發車 -->
            <TimeListVue
              :time="timetable.EstimateTime"
              :status="timetable.StopStatus"
            />
            <span class="detail_timetable-station">{{
              timetable.StopName.Zh_tw
            }}</span>
          </div>
        </div>
      </section>
      <section v-show="isMapMode" id="map" class="map_setting"></section>
    </div>
  </main>
</template>
<script>
//vue
// --元件
import CommonNavbar from "@/components/CommonNavbar.vue";
import TimeListVue from "@/components/TimeList.vue";
import DataUpdateBar from "@/components/DataUpdateBar.vue";

//-- vue lifecycle
import { onMounted } from "vue";
//-- vue syntax
import { ref } from "vue";
//router
import { useRoute } from "vue-router";

//leaflet
import L from "leaflet";
//api
import getBusApi from "@/service/getBusApi";
import SelectButton from "@/components/SelectButton.vue";
import { computed } from "@vue/reactivity";
export default {
  name: "StationDeatil",
  components: {
    CommonNavbar,
    TimeListVue,
    DataUpdateBar,
    SelectButton,
  },
  setup() {
    // router
    const router = useRoute();

    //判斷公車方向
    let currentDirection = ref(0);

    let busStationInfo = ref([]);

    let busRouteName = ref(router.query.routeName);
    let busCity = ref(router.query.city);
    let busRouteDirection = ref();

    //利用params參數 --- 發API,並且篩選
    async function getRouteDetails(routeName, city) {
      let directionApiList = [];
      let arrivedApi = [];
      //站牌順序api
      await getBusApi.route.getRouteMap(city).then((response) => {
        directionApiList.push(response.data);
      });
      //解構
      let [x] = directionApiList;
      let y = x.filter((data) => data.RouteName.Zh_tw === busRouteName.value);
      busRouteDirection.value = y;
      //拆分兩個方向 -- api

      //到站時間api
      await getBusApi.route.getArrivedTime(routeName, city).then((response) => {
        //todo 在這邊分流
        arrivedApi.push(response.data);
      });
      //按照到站時間排列(estimate small 》 big)
      arrivedApi[0].sort((a, b) => a.EstimateTime - b.EstimateTime);

      //存入ref
      busStationInfo.value = arrivedApi[0];
    }
    getRouteDetails(busRouteName.value, busCity.value);

    //動態判斷現在行駛方向
    let currDirection = ref(0);
    let currentDirectionAPIs = computed(() =>
      busStationInfo.value.filter(
        (data) => data.Direction === currDirection.value
      )
    );

    function switchMode() {
      ("switch mode --- ");
      isMapMode.value = !isMapMode.value;
    }
    function switchDirection(index) {
      currDirection.value = index;
    }
    //控制顯示模式
    let isMapMode = ref(false);

    //leaflet instance
    let mapContainer = ref({});
    onMounted(() => {
      let mapInstance = {};
      ("onMounting");
      mapInstance = L.map("map", {
        // 解決縮放問題
        // https://salesforce.stackexchange.com/questions/180977/leaflet-error-when-zoom-after-close-popup-in-lightning-component
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true,
      }).setView([22.997593951648952, 120.21265380386116], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(mapInstance);
      mapContainer.value = mapInstance;
    });
    return {
      switchMode,
      switchDirection,
      getRouteDetails,
      isMapMode,
      currentDirection,
      busStationInfo,
      currentDirectionAPIs,
      busRouteDirection,
      currDirection,
    };
  },
};
</script>
<style lang="scss" scoped>
@use "@/assets/scss/colors";
// header
.mode,
.select {
  display: flex;
}
.mode {
  margin-left: 75%;
  margin-right: 3%;
}

// map
.map_setting {
  height: 1000px;
  width: 100%;
}
.detail {
  background-color: var(--background-color-primary);

  &_direction {
    background-color: var(--navbar-bg);
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 35px;

    button {
      background-color: var(--navbar-bg);
      display: block;
      cursor: pointer;
      border: none;

      color: colors.$detail_font;
    }
  }
}
// .detail_direction {
//   display: flex;
//   justify-content: space-around;
//   align-items: center;

//   background-color: colors.$main-hover;

//   height: 35px;

//   span {
//     display: block;
//     cursor: pointer;
//     color: colors.$detail_font;
//   }
// }
.active {
  color: white !important;
}
.arrived {
  background-color: colors.$main-navbar !important;
  color: white !important;
}

// content
.detail_timetable {
  background-color: var(--background-color-primary);
  min-height: 100vh;
  padding: 0 15px;
  margin-top: 15px;
  &-update {
    display: block;
    text-align: end;
  }
  &-list {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #cccccc;
  }
  // &-in {
  //   background: #f8f8f8;
  //   border: 1px solid #61a68a;
  //   border-radius: 2px 12px 12px 2px;
  //   color: green;
  //   width: 75px;
  //   line-height: 28px;
  //   margin-right: 10px;
  // }
  &-station {
    align-self: center;
    color: var(--home-select-font-primary);
  }
}
</style>
