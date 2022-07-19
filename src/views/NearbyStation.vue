<template>
  <common-navbar>附近的公車站</common-navbar>
  <section id="map" class="station"></section>
</template>
<script>
import CommonNavbar from "@/components/CommonNavbar.vue";
import { onMounted, ref } from "vue";
import leaflet from "leaflet";
export default {
  name: "BusView",
  component: { CommonNavbar },
  setup() {
    console.log("now in busview");
    let mapInstance = ref({});
    let centerIcon = leaflet.icon({
      iconUrl: require("@/assets/images/user-set.png"),
      iconSize: [70, 70],
    });
    onMounted(() => {
      mapInstance.value = leaflet.map("map").setView([51.505, -0.09], 15);
      console.log("創造地圖實例", mapInstance);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
        })
        .addTo(mapInstance.value);

      //顯示當前定位
      leaflet
        .marker([51.505, -0.09], { icon: centerIcon })
        .addTo(mapInstance.value);
    });
  },
  components: { CommonNavbar },
};
</script>
<style lang="scss" scoped>
.station {
  //地圖尺寸
  height: 800px;
}
</style>
