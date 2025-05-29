import { GetUserByUnionId } from '@API/userService';
import { GetLaguageMap, GetCurrentLanguage, LanguageArray, ChangeLanguage } from '@Language/languageUtils';
import { LevelArray, UserRoleArray } from '@Lib/types';
import { ConvertFileIdToHttps, GetNavBarHeight } from '@Lib/utils';

const Mottos = [
  "球伴技术好，你赢球的可能性就大.",
  "不管你多棒，一定会有人比你更棒.",
  "面对误判，要尽快忘记不快，放眼后边的比赛.",
  "场上风向会吹歪你的球，也会吹歪对手的球.",
  "输球后不论感觉多窝囊多难受，都别忘了和对方握手，并笑一下.",
  "要想赢球，就得直面你的对手.",
  "紧要关头，先吸口气，慢下来，再决定下个球怎么打.",
];

Page({
  data: {
    // Static
    _lang: GetLaguageMap().my,
    year: new Date().getFullYear(),
    version: '',
    navBarHeight: GetNavBarHeight(),
    // Status:
    isLoaded: false,
    hasAuth: false,
    triggered: false,
    // Variables   
    currentLanguage: {},
    userProfile: {memberId: 0},
    languageArray: LanguageArray,
    motto: Mottos[Math.floor(Math.random() * Mottos.length)]
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

      const index = Math.floor(Math.random() * Mottos.length);
      this.setData({
        isLoaded: true,
        triggered: false,
        hasAuth: true,
        userProfile: user,
        motto: Mottos[index]
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