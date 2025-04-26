import wxPromisify from "@Lib/promisify";
import cloudbase from "@cloudbase/js-sdk"
import adapter from "@cloudbase/adapter-wx_mp";

// app.ts
App<IAppOption>({
  globalData: {},
  async onLaunch() {
    const LoginAsync = wxPromisify(wx.login);
    const res = await LoginAsync();
    console.log(res.code);

    cloudbase.useAdapters(adapter);

    //移动应用安全来源  from https://tcb.cloud.tencent.com/dev?envId=prod-4glz11qiccc892f2#/env/safety-source
    const app = cloudbase.init({
      env: "prod-4glz11qiccc892f2",
      clientId: "AAU5PwAB5WXwGEwSZjE",
    });

    const auth = app.auth();

    auth.signInAnonymously().then(r => {
      console.log(r)
      const user = auth.currentUser;
      console.log(user)
      const db = app.database();
      db.collection('Attendees')
        .get()
        .then(res => {
          console.log(res)
        });
    });

    // move to jscode2session on cloud function 
    // const requestAsync = wxPromisify(wx.request);
    // const secret = '';
    // const result = await requestAsync({
    //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx1d85f7df5bbea6d4&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code',
    //   method: 'GET'
    // });
    // console.log(result);

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
})