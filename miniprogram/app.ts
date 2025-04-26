import wxPromisify from "@Lib/promisify";

// app.ts
App<IAppOption>({
  globalData: {},
  async onLaunch() {
    const LoginAsync = wxPromisify(wx.login);
    const res = await LoginAsync();
    console.log(res.code);

    const te = wxPromisify(wx.getUserInfo);
    const aa = await te();
    console.log(aa);

    const requestAsync = wxPromisify(wx.request);
    const secret = '';
    const result = await requestAsync({
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx1d85f7df5bbea6d4&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code',
      method: 'GET'
    });
    console.log(result);

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
})