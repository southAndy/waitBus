import axios from "axios";
// import { getToken } from "./getToken";

// const busAdvancedAPI = async () => {
//   console.log("hi");
//   await getToken;
//   return axios.create({
//     baseURL: "https://tdx.transportdata.tw/api/advanced/v2/Bus",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",

//       //API認證token
//       //todo token 產生速度太慢,axios實例拿不到 -- promise / callback
//       Authorization: `Bearer ${getToken.access_token}`,
//       //舊版加密函式
//       // ...getAuthorizationHeader(),
//     },
//   });
// };
// busAdvancedAPI()
let diedToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJER2lKNFE5bFg4WldFajlNNEE2amFVNm9JOGJVQ3RYWGV6OFdZVzh3ZkhrIn0.eyJleHAiOjE2NjAxMDAzMDcsImlhdCI6MTY2MDAxMzkwNywianRpIjoiMDg0ZjJmMzAtZmY3Yy00ZjI1LWFlYjYtNzUyOTVhMzIxNDA1IiwiaXNzIjoiaHR0cHM6Ly90ZHgudHJhbnNwb3J0ZGF0YS50dy9hdXRoL3JlYWxtcy9URFhDb25uZWN0Iiwic3ViIjoiM2U1Yzk2ODQtODUyMi00ZjhkLWFjZGYtOTY5YWU0Y2E4NDQyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYW5keXplbmc5MDAtMzk1MGJhY2ItNWVmNi00YTMyIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJzdGF0aXN0aWMiLCJwcmVtaXVtIiwibWFhcyIsImFkdmFuY2VkIiwiaGlzdG9yaWNhbCIsImJhc2ljIl19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJ1c2VyIjoiY2FjYTk4NzUifQ.XDcb6dRMlrfESwiOKptKBlWv5EVU-kRCEDdh-EuYvhbQ3_j9M7kQpo12Gte48kef5nRMOCXQemSrGmjNpTvDGmcGQZIMhs-N1qwrGUKjrHmwS71L8vXgeoReZlN8PnRNMr9Jd_C-jzA6p4BROkI5Ab4lxr6MGLVK0shWQ3fxSyy7miCV2Bbr1-8UbU7X2XXO53CQA2NSAi7-tpJHxD7C5ffvYs9IxP0_b9_H99uCWeS_eNbgEPNEiE2KziaOTKu6b4Mf3N189M7QzomQXWqX7dPF5x7X7_7fsE79zIZmKtFF6TeHyaIWUzXW0ikx53ZIOGQmq589MoHykoFfxFofAg";

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
