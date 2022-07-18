import axios from "axios";
import jsSHA from "jssha";
const bikeAPI = axios.create({
  // baseURL: "https://tdx.transportdata.tw/api/basic/v2/Bus",
  headers: {
    Accept: "application/json",
    //加密函式
    ...getAuthorizationHeader(),
  },
});
function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  let AppID = "67ca61f151194b25961f0d05b4a60f4c";
  let AppKey = "uN5SH5ngYqGh8ooA1Hmz1CEKO7o";
  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  let HMAC = ShaObj.getHMAC("B64");
  let Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';
  return { Authorization: Authorization, "X-Date": GMTString };
}

export { bikeAPI };
