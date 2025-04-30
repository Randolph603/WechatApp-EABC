import { WxLoginAsync } from "@Lib/promisify";
import cloudbase from "@cloudbase/js-sdk"
import adapter from "@cloudbase/adapter-wx_mp";

let App: cloudbase.app.App;

export const InitDatabaseAsync = async () => {
  cloudbase.useAdapters(adapter);
  //from https://tcb.cloud.tencent.com/dev?envId=prod-4glz11qiccc892f2#/env/safety-source
  App = cloudbase.init({
    env: "prod-4glz11qiccc892f2",
    clientId: "AAU5PwAB5WXwGEwSZjE",
  });

  const auth = App.auth();
  const loginState = auth.hasLoginState();
  if (loginState === null) {
    await auth.signInAnonymously();
  }
}

export const GetUnionIdAsync = async () => {
  let unionid = wx.getStorageSync('unionid');
  if (!unionid) {
    const { code } = await WxLoginAsync();
    console.log(code);
    var response = await App.callFunction({ name: 'jscode2session', data: { code: code } });
    console.log(response.result);
    unionid = response.result.unionid;
    wx.setStorageSync('unionid', unionid)
  }
  return unionid;
}

export const GetDatabaseAsync = async () => {
  if (App) {
    return App;
  } else {
    await InitDatabaseAsync();
    return App;
  }
};