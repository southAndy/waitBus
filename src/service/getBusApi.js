import axios from "axios";
import { getToken } from "@/service/getToken.js";

async function getAPIS() {
  await getToken();
  console.log(getToken());
  //產生發API實例
  const busAdvancedAPI = axios.create({
    baseURL: "https://tdx.transportdata.tw/api/advanced/v2/Bus",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",

      //API認證token
      Authorization: `Bearer ${getToken()}`,
      //舊版加密函式
      // ...getAuthorizationHeader(),
    },
  });
  console.log(busAdvancedAPI);
}
getAPIS();

let diedToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJER2lKNFE5bFg4WldFajlNNEE2amFVNm9JOGJVQ3RYWGV6OFdZVzh3ZkhrIn0.eyJleHAiOjE2NjAyNzM2OTQsImlhdCI6MTY2MDE4NzI5NCwianRpIjoiY2M2MjExMzEtYzBmZi00MDQ0LThlYTktMjRlZjk2MmNjN2M1IiwiaXNzIjoiaHR0cHM6Ly90ZHgudHJhbnNwb3J0ZGF0YS50dy9hdXRoL3JlYWxtcy9URFhDb25uZWN0Iiwic3ViIjoiM2U1Yzk2ODQtODUyMi00ZjhkLWFjZGYtOTY5YWU0Y2E4NDQyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYW5keXplbmc5MDAtMzk1MGJhY2ItNWVmNi00YTMyIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJzdGF0aXN0aWMiLCJwcmVtaXVtIiwibWFhcyIsImFkdmFuY2VkIiwiaGlzdG9yaWNhbCIsImJhc2ljIl19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJ1c2VyIjoiY2FjYTk4NzUifQ.YZuFWafJgpFatu8CEbC_lWYpVoxqV8wXGACHfTrd5xU29mariVmSXY1UHfAgYpp5uLXUwjOsVHpGiMrXpN9uejnshdgeXwMsqoS-1HjzAxiDGhXF81G74DDQj8-uV_kZfiKet9q-bEIq-n10WqXdnoJ-74DEBmAb1X7bUqVD1uRvykt3ik3JpGoYTJB8tgzZ1TUfLiOxOhOL1CBrhijIF-eCfn5_Wg1vHjExw8NbeVjlNOJDDMXVT8C13Myz591P3gbyBWlsAWmUqpbGtcvxNL-z59LhF1gwS68--FLYibmTcnyhpgHLYbNZZhvl9tq0DhFGGHinhsKo9t-v_ruKiA";

const busAdvancedAPI = axios.create({
  baseURL: "https://tdx.transportdata.tw/api/advanced/v2/Bus",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",

    //API認證token
    Authorization: `Bearer ${diedToken}`,
    //舊版加密函式
    // ...getAuthorizationHeader(),
  },
});

const busAPI = axios.create({
  baseURL: "https://tdx.transportdata.tw/api/basic/v2/Bus",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",

    //API認證token
    //todo token 產生速度太慢,axios實例拿不到 -- promise / callback
    Authorization: `Bearer ${diedToken}`,
    //舊版加密函式
    // ...getAuthorizationHeader(),
  },
});

//? output API
export default {
  station: {
    getSpecificRange(lat, lng, distance = 500) {
      console.log("現在經緯", lat, lng);
      //tdx.transportdata.tw/api/advanced/v2/Bus/Stop/NearBy?%24top=30&%24spatialFilter=nearby%2822.999459%2C%20120.2129118%2C800%29&%24format=JSON
      console.log(
        `Stop/NearBy?%24top=500&%24spatialFilter=nearby%28${lat}%2C%20${lng}%2C${distance}%29&%24format=JSON`
      );
      //原始寫法
      // return busAPI.get(
      //   `/Stop/NearBy?%24top=100&%24spatialFilter=nearby%28${lat}%2C%20${lng}%2C${distance}%29&%24format=JSON`
      // );
      return busAdvancedAPI.get(
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
  },
  route: {
    getSpecificCity(cityName) {
      // return busAPI.get("StopOfRoute/City/Taipei", {
      //   // params: {
      //   //   $top: 30,
      //   //   $format: JSON,
      //   // },
      // });
      return busAPI.get(`Route/City/${cityName}?%24top=500&%24format=JSON
      `);
    },
    getRouteStation(routeName, city) {
      return busAPI.get(
        `/StopOfRoute/City/${city}/${routeName}?%24top=100&%24format=JSON`
      );
    },
    getArrivedTime(routeName, city) {
      return busAPI.get(
        `/EstimatedTimeOfArrival/City/${city}/${routeName}?%24top=100&%24format=JSON`
      );
    },
    getRouteMap(city) {
      return busAPI.get(`/Route/City/${city}?%24top=100&%24format=JSON`);
    },
    //todo 要有城市作為參數
    getRouteLatLng(city) {
      return busAPI.get(`/RealTimeByFrequency/City/${city}?%24&%24format=JSON`);
      // return busAPI.get(`/Station/City/Taipei?%24&%24format=JSON`);
    },
  },
  city: {},
  schcdule: {},
  news: {},
};

// function getAuthorizationHeader() {
//   //  填入自己 ID、KEY 開始
//   let AppID = "12efae2e62544e008e3edb1edfc82542";
//   let AppKey = "SLIpweeVUHAwlA3-4jmwbHH0ryg";
//   // let AppID = "67ca61f151194b25961f0d05b4a60f4c";
//   // let AppKey = "uN5SH5ngYqGh8ooA1Hmz1CEKO7o";
//   // let AppID = "andyzeng900-e5cf8a3e-d0e1-4268";
//   // let AppKey = "66189553-7211-4882-8154-505f6f0d7f99";
//   //  填入自己 ID、KEY 結束
//   let GMTString = new Date().toGMTString();
//   let ShaObj = new jsSHA("SHA-1", "TEXT");
//   ShaObj.setHMACKey(AppKey, "TEXT");
//   ShaObj.update("x-date: " + GMTString);
//   let HMAC = ShaObj.getHMAC("B64");
//   let Authorization =
//     'hmac username="' +
//     AppID +
//     '", algorithm="hmac-sha1", headers="x-date", signature="' +
//     HMAC +
//     '"';
//   return { Authorization: Authorization, "X-Date": GMTString };
// }
