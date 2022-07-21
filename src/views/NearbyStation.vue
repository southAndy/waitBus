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
        .map("map")
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
      getBusApi.station
        .getSpecificRange(userPosition.value.lat, userPosition.value.lng)
        .then((response) => {
          console.log(response.data);
          apiCollection.value = response.data;
          return response;
        });
      //製作站牌座標
      // let markerCollection = apiCollection.value.map((data,index)=>{
      //   return leaflet.marker([data.,data.],{icon:busIcon})
      // })
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
</style>
