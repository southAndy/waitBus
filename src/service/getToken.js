import qs from "qs";
import axios from "axios";
//? 拿token
const data = {
  grant_type: "client_credentials",
  client_id: "andyzeng900-3950bacb-5ef6-4a32",
  client_secret: "0a03591c-1c99-4e35-ac85-565609701952",
};
let config = {
  method: "post",
  url: "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  //!無法轉換request的body內容,有些值在url有別的意思,ex:%
  //?解決方法:axios官方:https://axios-http.com/docs/urlencoded,透過qs套件幫忙轉換,篩選
  data: qs.stringify(data),
};
//?token 壞掉時候使用
let backupToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJER2lKNFE5bFg4WldFajlNNEE2amFVNm9JOGJVQ3RYWGV6OFdZVzh3ZkhrIn0.eyJleHAiOjE2NTgyMTkyNDUsImlhdCI6MTY1ODEzMjg0NSwianRpIjoiYmQ2NTgzM2ItNDk5ZC00MGEwLWJmNDctNzViZTA2MzFhMDI3IiwiaXNzIjoiaHR0cHM6Ly90ZHgudHJhbnNwb3J0ZGF0YS50dy9hdXRoL3JlYWxtcy9URFhDb25uZWN0Iiwic3ViIjoiM2U1Yzk2ODQtODUyMi00ZjhkLWFjZGYtOTY5YWU0Y2E4NDQyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYW5keXplbmc5MDAtMzk1MGJhY2ItNWVmNi00YTMyIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJzdGF0aXN0aWMiLCJwcmVtaXVtIiwibWFhcyIsImFkdmFuY2VkIiwiaGlzdG9yaWNhbCIsImJhc2ljIl19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJ1c2VyIjoiY2FjYTk4NzUifQ.dWGgSVy7b3mzdUzbHYWE1_T_d-DZFLTOpazDQewne6baQToTAmG-kT_LWc2br0Ssff7-sVew7AOjX6yMIxkqbDFjNFqkdI7NuHlj8Wkh2SCim8Eoe5o7fIlDW19Cv4K397ZQDja_8V856p7ctKYfuQnemb4bbVnxabAn08IVDqZLZhYKklk0x8NZ2voEOB6HfdusWeLoq7PKZjnBycbvBEglPu4iB_Li7OGs4UUujfKHs7J-s9NVZPauNHEMjiYt9opSqLUOfFKnn9kWVkF2PlnbLc0_RQBzvvZM0bj3XP9DldOfpo02XLGjTdHNOmagqw36TSiorSB73sjg29vjsg";
const getToken = axios(config)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => console.log("error!", error));

export { backupToken, getToken };
