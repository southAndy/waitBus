import { getToken } from "@/service/getToken";
import { defineStore } from "pinia";
import leaflet from "leaflet";

const nearbyStore = defineStore("nearbyStore", {
  state: () => {
    return {
      apiToken: "",
      //中心樣式
      centerIcon: leaflet.icon({
        iconUrl: require("@/assets/images/user-set.png"),
        iconSize: [60, 60],
      }),
      //站牌icon
      busIcon: leaflet.icon({
        iconUrl: require("@/assets/images/icon/Component 4.png"),
        iconSize: [25, 35],
      }),
      //站牌icon -clicked
      pointedBusIcon: leaflet.icon({
        iconUrl: require("@/assets/images/icon/Component 3.png"),
        iconSize: [25, 35],
      }),
    };
  },
  getters: () => {},
  actions: {
    async getToken() {
      this.apiToken = await getToken;
      console.log("get token", this.apiToken);
    },
    async getNearStation() {
      await this.getToken();
    },
    //取得使用者定位
  },
});

export default nearbyStore;
