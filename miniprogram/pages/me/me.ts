import { GetUserByUnionId } from '@API/userService';
import { GetLaguageMap, GetCurrentLanguage, LanguageArray, ChangeLanguage } from '@Language/languageUtils';
import { LevelArray, UserRoleArray } from '@Lib/types';
import { ConvertFileIdToHttps } from '@Lib/utils';

Page({
  data: {
    // Static
    _lang: GetLaguageMap().my,
    year: new Date().getFullYear(),
    version: '',
    // Status:
    isLoaded: false,
    hasAuth: false,
    triggered: false,
    // Variables   
    currentLanguage: {},
    userProfile: {memberId: 0},
    languageArray: LanguageArray
  },

  async onLoad() {
    await this.LoadUser();
  },

  async onShow() {
    const version = wx.getAccountInfoSync().miniProgram.version;
    this.setData({
      _lang: GetLaguageMap().my,
      version: version,
      currentLanguage: GetCurrentLanguage()
    });

    GetLaguageMap()["tabbar"].list.forEach(({ text }, i) => {
      wx.setTabBarItem({
        index: i,
        text: text
      })
    });
  },

  //#region private method
  async LoadUser() {
    const user = await GetUserByUnionId();
    if (user) {
      if (user.avatarUrl.startsWith('cloud')) {
        user.avatarUrl = ConvertFileIdToHttps(user.avatarUrl);
      }
      user.userRoleName = UserRoleArray.find(u => u.value === user.userRole)?.name ?? 'Unknown';
      user.userLevelName = LevelArray[user.userLevel].displayName ?? 'Unknown';

      this.setData({
        isLoaded: true,
        triggered: false,
        hasAuth: true,
        userProfile: user,
      });
    } else {
      this.setData({
        isLoaded: true,
        triggered: false,
        hasAuth: false,
      });
    }
  },

  tapMemberId() {
    wx.setClipboardData({ data: this.data.userProfile.memberId.toString()  });
  },

  languagePickerChange(e: { detail: { value: string; }; }) {
    const index = Number(e.detail.value);
    ChangeLanguage(index);
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    wx.reLaunch({ url: `/${currentPage.route}` })
  },
  //#endregion

})