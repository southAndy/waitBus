<template>
  <common-navbar>附近的公車站</common-navbar>
  <section id="map" class="station"></section>
  <div class="content" v-show="showContent">
    <h3 class="content_title">自強隧道(大宗教會)</h3>
    <div class="content_detail">
      <div v-for="data in 8" :key="data">
        <time class="">31分</time>
        <h4>{{ 28 }} - {{ "往市政府" }}</h4>
      </div>
    </div>
  </div>
</template>
<script>
import CommonNavbar from "@/components/CommonNavbar.vue";
import {
  onMounted,
  ref,
  // computed
} from "vue";
import leaflet from "leaflet";
import getBusApi from "@/service/getBusApi";
import getNearStation from "@/store/Bus/getNearStation";
export default {
  name: "BusView",
  components: { CommonNavbar },
  setup() {
    const store = getNearStation();
    store.getToken();

    let mapInstance = ref({});
    let apiCollection = ref([]);
    //預設中心
    let userPosition = ref({
      lat: "22.997593951648952",
      lng: "120.21265380386116",
    });

    //顯示站牌內容
    let showContent = ref(false);

    //掛載地圖
    onMounted(async () => {
      function geo_error() {
        alert("Sorry, no position available.");
      }
      function geo_success(position) {
        console.log("當前位置", position.coords);
        //取得值存入ref
        userPosition.value.lat = position.coords.latitude;
        userPosition.value.lng = position.coords.longitude;
      }
      //執行定位
      await navigator.geolocation.watchPosition(geo_success, geo_error);
      console.log(userPosition);
      mapInstance.value = leaflet
        .map("map", {
          // 解決縮放問題
          // https://salesforce.stackexchange.com/questions/180977/leaflet-error-when-zoom-after-close-popup-in-lightning-component
          zoomControl: true,
          zoom: 1,
          zoomAnimation: false,
          fadeAnimation: true,
          markerZoomAnimation: true,
        })
        .setView([userPosition.value.lat, userPosition.value.lng], 15);
      console.log("創造地圖實例", mapInstance);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          className: "map-tiles",
          attribution: "© OpenStreetMap",
        })
        .addTo(mapInstance.value);

      //顯示當前定位
      leaflet
        .marker([22.997593951648952, 120.21265380386116], {
          icon: store.centerIcon,
        })
        .addTo(mapInstance.value);
      //測試站牌座標
      // leaflet
      //   .marker([23.00227, 120.20899], { icon: store.pointedBusIcon })
      //   .bindPopup("hello wolrd")
      //   .addTo(mapInstance.value);

      //發API
      console.log(getBusApi);
      async function create() {
        let list = [];
        await getBusApi.station
          .getSpecificRange(userPosition.value.lat, userPosition.value.lng)
          .then((response) => {
            list.push(response.data);
            return response;
          });
        // await store
        //   .getSpecificRange(userPosition.value.lat, userPosition.value.lng)
        //   .then((response) => {
        //     list.push(response.data);
        //     return response;
        //   });
        console.log(list);
        //marker's content
        // function markerContent(apiData) {
        //   return `
        //   <section class="">
        //     <h3>${apiData.StopName.Zh_tw}</h3>
        //     <div>
        //       <p>有點難</p>
        //     </div>
        //   </section>`;
        // }
        //製作站牌座標
        let markers = [];
        //todo
        list[0].forEach((data) => {
          markers.push(
            leaflet
              .marker(
                [data.StopPosition.PositionLat, data.StopPosition.PositionLon],
                { icon: store.busIcon }
              )
              .bindPopup()
          );
        });
        console.log(markers);

        //添加事件
        let markerGroup = leaflet
          .featureGroup(markers)
          .addTo(mapInstance.value)
          .on("popupopen", async (e) => {
            e.layer.setIcon(store.pointedBusIcon);
            console.log(e);
            // await getBusApi.route
            //   .getArrivedTime(routeName, city)
            //   .then((response) => {
            //     console.log(response.data);
            //     arrivedApi.push(response.data);
            //   });
            //todo 點擊觸發站牌api
            showContent.value = true;
          })
          .on("popupclose", (e) => {
            e.layer.setIcon(store.busIcon);
            showContent.value = false;
          });
        return markerGroup;
      }
      create();

      //一次添加
      leaflet
        .featureGroup(apiCollection.value)
        .bindPopup("Hello world")
        .addTo(mapInstance.value);
    });
    return {
      showContent,
    };
  },
};
</script>
<style lang="scss" scoped>
.station {
  //地圖尺寸
  height: 100vh;
}
.map-tiles {
  filter: var(--map-tiles-filter, none);
}
.content {
  height: 200px;
  padding: 0 15px;
  position: fixed;
  bottom: 0px;
  z-index: 1000;
  width: 100vw;
  background: white;

  &_title {
    font-size: 20px;
    text-align: start;
    color: black;
    margin: 0;
  }

  &_detail {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 150px;
    overflow: scroll;

    div {
      display: flex;
      color: black;
      margin-right: 20px;
      time {
        align-self: center;
        width: 65px;
        padding: 5px 10px;
        margin-right: 5px;
        background: #f8f8f8;
        color: #438c6f;
        font-weight: 700;
        border: 1px solid #61a68a;
        border-radius: 2px 12px 12px 2px;
      }
      h4 {
        color: black;
        font-size: 12px;
        margin: 0;
        align-self: center;
      }
    }
  }
}
</style>
