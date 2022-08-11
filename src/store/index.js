import { defineStore } from "pinia";
import { getToken } from "@/service/getToken";
import axios from "axios";

let useStore = defineStore("store", {
  state: () => {
    return {
      apiToken: {},
      busBasicAPI: {},
      list: [],
    };
  },
  getters: {},
  actions: {
    async getToken() {
      this.apiToken = await getToken;
      console.log("get token", this.apiToken.access_token);
      this.busBasicAPI = axios.create({
        baseURL: "https://tdx.transportdata.tw/api/basic/v2/Bus",
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
      //   return this.busBasicAPI
      //     .get(
      //       `Route/City/Taipei?%24top=500&%24format=JSON
      //   `
      //     )
      //     .then((res) => this.list.push(res));
    },
    async getSpecificCity(cityName) {
      await this.getToken();
      // return busAPI.get("StopOfRoute/City/Taipei", {
      //   // params: {
      //   //   $top: 30,
      //   //   $format: JSON,
      //   // },
      // });
      return this.busBasicAPI
        .get(
          `Route/City/${cityName}?%24top=500&%24format=JSON
        `
        )
        .then((res) => (this.list = res));
    },
  },
});

export default useStore;
