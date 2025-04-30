import { GetUserByUnionId } from '@API/userService';
import { GetLaguageMap } from '@Language/languageUtils';
import { ConvertFileIdToHttps } from '@Lib/util';

Page({
  data: {
    _lang: GetLaguageMap().my,
    version: '',
    currentLanguage: '',
    userProfile: {},
  },

  async onLoad() {
    const user = await GetUserByUnionId();
    console.log(user);
    if (user.avatarUrl.startsWith('cloud')) {
      user.avatarUrl = ConvertFileIdToHttps(user.avatarUrl);
    }

    this.setData({
      hasAuth: true,
      userProfile: user,
      triggered: false
    });
  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})