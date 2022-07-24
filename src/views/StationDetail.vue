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
    <div class="detail_direction">
      <span
        @click="switchPage(index)"
        :class="[{ active: currentSelect === index }]"
        v-for="(select, index) in 2"
        :key="select"
        >{{ "往台北車站" }}</span
      >
    </div>
    <section v-show="!isMapMode" class="detail_timetable">
      <time class="detail_timetable-update">{{ "10秒前更新" }}</time>
      <div>
        <div class="detail_timetable-list">
          <time class="detail_timetable-in">{{ "4分" }}</time>
          <span class="detail_timetable-station">{{ "永春高中" }}</span>
        </div>
        <div class="detail_timetable-list">
          <time class="detail_timetable-in">{{ "4分" }}</time>
          <span class="detail_timetable-station">{{ "永春高中" }}</span>
        </div>
        <div class="detail_timetable-list">
          <time class="detail_timetable-in">{{ "4分" }}</time>
          <span class="detail_timetable-station">{{ "永春高中" }}</span>
        </div>
        <div class="detail_timetable-list">
          <time class="detail_timetable-in">{{ "4分" }}</time>
          <span class="detail_timetable-station">{{ "永春高中" }}</span>
        </div>
        <div class="detail_timetable-list">
          <time class="detail_timetable-in">{{ "4分" }}</time>
          <span class="detail_timetable-station">{{ "永春高中" }}</span>
        </div>
        <div class="detail_timetable-list">
          <time class="detail_timetable-in">{{ "4分" }}</time>
          <span class="detail_timetable-station">{{ "永春高中" }}</span>
        </div>
        <div class="detail_timetable-list">
          <time :class="['detail_timetable-in', { arrived: true }]">{{
            "coming!"
          }}</time>
          <span class="detail_timetable-station">{{ "101" }}</span>
        </div>
      </div>
    </section>
    <section v-show="isMapMode" id="map" class="map_setting"></section>
  </main>
</template>
<script>
//元件
import CommonNavbar from "@/components/CommonNavbar.vue";
//vue lifecycle
import { onMounted } from "vue";
//vue syntax
import { ref } from "vue";
import { useRoute } from "vue-router";

//leaflet
import L from "leaflet";
export default {
  name: "StationDeatil",
  components: { CommonNavbar },
  setup() {
    // router
    const router = useRoute();
    console.log("get UID", router.params.UID);
    let currentSelect = ref(0);

    //利用params參數 --- 發API,並且篩選

    function switchMode() {
      console.log("switch mode --- ");
      isMapMode.value = !isMapMode.value;
    }
    function switchPage(index) {
      currentSelect.value = index;
    }

    let isMapMode = ref(false);
    let mapContainer = ref({});
    onMounted(() => {
      let mapInstance = {};
      console.log("onMounting");
      mapInstance = L.map("map", {
        // 解決縮放問題
        // https://salesforce.stackexchange.com/questions/180977/leaflet-error-when-zoom-after-close-popup-in-lightning-component
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true,
      }).setView([22.997593951648952, 120.21265380386116], 15);
      console.log("創造地圖實例", mapInstance);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(mapInstance);
      mapContainer.value = mapInstance;
    });
    return {
      switchMode,
      switchPage,
      isMapMode,
      currentSelect,
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
  background-color: colors.$main-bg;

  &_direction {
  }
}
.detail_direction {
  display: flex;
  justify-content: space-around;
  align-items: center;

  background-color: colors.$main-hover;

  height: 35px;

  span {
    display: block;
    cursor: pointer;
    color: colors.$detail_font;
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
  background-color: colors.$main-bg;
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
  &-in {
    background: #f8f8f8;
    border: 1px solid #61a68a;
    border-radius: 2px 12px 12px 2px;
    color: green;
    width: 75px;
    line-height: 28px;
    margin-right: 10px;
  }
  &-station {
    align-self: center;
  }
}
</style>
