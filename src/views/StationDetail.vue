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
    <div v-if="busStationInfo" class="detail_content">
      <section v-show="isMapMode" id="map" class="map_setting"></section>
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

    let busRouteLatLngList = ref();

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
    onMounted(async () => {
      let routeLatLngList = [];
      //呼叫行駛路線座標資料的api
      //todo:載入完成 -- 解除載入效果
      await getBusApi.route
        .getRouteLatLng(busCity.value)
        .then((response) => routeLatLngList.push(response.data));
      //根據對應路線篩選api資料
      busRouteLatLngList.value = routeLatLngList[0].filter((data) => {
        return data.RouteName.Zh_tw === busRouteName.value;
      });
      //打包ＡＰＩ資料的經緯：作為地圖方法的參數
      let latList = busRouteLatLngList.value.map((data) => [
        data.BusPosition.PositionLat,
        data.BusPosition.PositionLon,
      ]);
      let lonList = busRouteLatLngList.value.map(
        (data) => data.BusPosition.PositionLon
      );
      console.log(latList, lonList);
      //產生地圖實例
      let mapInstance = {};
      mapInstance = L.map("map", {
        // 地圖縮放報錯問題
        // https://salesforce.stackexchange.com/questions/180977/leaflet-error-when-zoom-after-close-popup-in-lightning-component
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true,
      }).setView(
        [
          busRouteLatLngList.value[0]?.BusPosition.PositionLat,
          busRouteLatLngList.value[0]?.BusPosition.PositionLon,
        ],
        12
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(mapInstance);

      // let apiRouteList = [];
      //產生路線線型
      var polyline = L.polyline(latList, { color: "purple" }).addTo(
        mapInstance
      );
      console.log(polyline);

      //產生路線座標、顯示資訊
      //產生對應的公車站位

      //公車資訊模板
      function busRouteContent(api) {
        return `
        <div>
          <h3>站名:${api}</h3>
          <span>公車狀態：${"進站中"}</span>
        </div>`;
      }
      let busRouteMarkers = latList.map((route, index) => {
        //way1: 座標要以圖片形式載入
        // let stopIcon = L.icon({
        //   iconUrl: require("@/assets/images/icon/Component 4.png"),
        //   iconSize: [60, 60],
        // });
        //way2：客製化座標 -- 不同架構
        let stopIcon = L.divIcon({
          className: "map_setting-icon",
          html: `
          <div class="map_setting-icon">
            <h4>1</h4>
          </div>`,
          //todo 調整樣式樣式
          iconUrl: require("@/assets/images/icon/Component 4.png"),
        });
        return L.marker([route[0], route[1]], { icon: stopIcon }).bindPopup(
          busRouteContent(index)
        );
      });
      console.log(busRouteMarkers);
      L.featureGroup(busRouteMarkers)
        .addTo(mapInstance)
        .on("popupopen", () => console.log("hi"));

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
@use "@/assets/scss/breakpoints";
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

  @include breakpoints.tablet {
    height: 500px;
    display: block !important;
  }
  @include breakpoints.desktop {
    height: 100vh;
  }

  &-icon {
    height: 15px;
    color: black !important;
    font-size: 25px !important;
    background-image: require("@/assets/images/icon/Component 4.png");
  }
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
  &_content {
    @include breakpoints.desktop {
      display: flex;
    }
  }
}

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
  @include breakpoints.desktop {
    height: 100vh;
    overflow: scroll;
  }
  &-update {
    display: block;
    text-align: end;
    color: var(--home-select-font-primary);
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
