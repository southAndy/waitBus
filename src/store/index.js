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
      this.busBasicAPI = axios.create({
        baseURL: "https://tdx.transportdata.tw/api/basic/v2/Bus",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //TODO : token產生速度太慢,axios實例拿不到 -- promise / callback
          Authorization: `Bearer ${this.apiToken.access_token}`,
        },
      });
    },
    async getSpecificCity(cityName) {
      await this.getToken();
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
