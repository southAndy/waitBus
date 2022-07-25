<template>
  <common-navbar>附近的公車站</common-navbar>
  <section id="map" class="station"></section>
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
    console.log(store.apiToken);
    store.getToken();

    let mapInstance = ref({});
    let apiCollection = ref([]);
    //預設中心
    let userPosition = ref({
      lat: "22.997593951648952",
      lng: "120.21265380386116",
    });

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
    navigator.geolocation.watchPosition(geo_success, geo_error);
    console.log(userPosition);

    //掛載地圖
    onMounted(() => {
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
        .setView([22.997593951648952, 120.21265380386116], 15);
      console.log("創造地圖實例", mapInstance);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
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
      leaflet
        .marker([23.00227, 120.20899], { icon: store.pointedBusIcon })
        .bindPopup("hello wolrd")
        .addTo(mapInstance.value);

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
              .bindPopup("testing")
          );
        });
        console.log(markers);

        //添加事件
        let markerGroup = leaflet
          .featureGroup(markers)
          .addTo(mapInstance.value)
          .on("popupopen", (e) => {
            e.layer.setIcon(store.pointedBusIcon);
            console.log(e);
            //todo 點擊觸發站牌api
          })
          .on("popupclose", (e) => e.layer.setIcon(store.busIcon));
        return markerGroup;
      }
      create();

      //一次添加
      leaflet
        .featureGroup(apiCollection.value)
        .bindPopup("Hello world")
        .addTo(mapInstance.value);
    });
  },
};
</script>
<style lang="scss" scoped>
.station {
  //地圖尺寸
  height: 800px;
}
:root {
  --map-tiles-filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg)
    saturate(0.3) brightness(0.7);
}

@media (prefers-color-scheme: dark) {
  .map-tiles {
    filter: var(--map-tiles-filter, none);
  }
}
</style>
