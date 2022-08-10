import { getToken } from "@/service/getToken";
import { defineStore } from "pinia";
import leaflet from "leaflet";
import axios from "axios";

const nearbyStore = defineStore("nearbyStore", {
  state: () => {
    return {
      //預設中心位置
      defaultCenterLatLon: "",
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
    getSpecificRange(lat, lng, distance = 500) {
      console.log("現在經緯", lat, lng);
      console.log("i am using pinia actions!");

      //tdx.transportdata.tw/api/advanced/v2/Bus/Stop/NearBy?%24top=30&%24spatialFilter=nearby%2822.999459%2C%20120.2129118%2C800%29&%24format=JSON
      console.log(
        `Stop/NearBy?%24top=500&%24spatialFilter=nearby%28${lat}%2C%20${lng}%2C${distance}%29&%24format=JSON`
      );
      //原始寫法
      // return busAPI.get(
      //   `/Stop/NearBy?%24top=100&%24spatialFilter=nearby%28${lat}%2C%20${lng}%2C${distance}%29&%24format=JSON`
      // );
      return this.axiosInstance.get(
        `/Stop/NearBy?%24top=500&%24spatialFilter=nearby%2822.999459%2C%20120.2129118%2C800%29&%24format=JSON`
      );
      // return busAPI.get("Stop/NearBy", {
      //   params: {
      //     $spatialFilter: `nearby(${lat},${lng},${distance})`,
      //     $top: 200,
      //     $format: JSON,
      //   },
      // });
    },
    async getToken() {
      this.apiToken = await getToken;
      console.log("get token", this.apiToken);
      this.axiosInstance = axios.create({
        baseURL: "https://tdx.transportdata.tw/api/advanced/v2/Bus",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //API認證token
          //todo token 產生速度太慢,axios實例拿不到 -- promise / callback
          Authorization: `Bearer ${this.apiToken.access_token}`,
          //舊版加密函式
          // ...getAuthorizationHeader(),
        },
      });
    },
    async getNearStation() {
      await this.getToken();
    },
    //取得使用者定位
  },
});

export default nearbyStore;
