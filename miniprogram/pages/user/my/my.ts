import { HandleException } from '@API/commonHelper';
import { CheckUserExistsAsync } from '@API/userService';
import { GetLaguageMap, GetCurrentLanguage, LanguageArray, ChangeLanguage } from '@Language/languageUtils';
import { UserRole } from '@Lib/types';
import { GetCurrentUrl, GetNavBarHeight, UpdateTabBarLaguage } from '@Lib/utils';
import { IOption } from '@Model/index';

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
    version: wx.getAccountInfoSync().miniProgram.version,
    navBarHeight: GetNavBarHeight() + 110,
    // Status:
    isLoaded: false,
    myMemberId: 0,
    myProfile: {},
    hasAuth: false,
    dialogShow: false,
    triggered: false,
    // Variables   
    currentLanguage: GetCurrentLanguage(),
    languageArray: LanguageArray,
    motto: Mottos[Math.floor(Math.random() * Mottos.length)],
    // Security
    isAdmin: false,
  },

  async onLoad() {
    try {
      await this.LoadUser();
    } catch (error) {
      await HandleException('onLoad', error)
    }
  },

  async onShow() {
    this.setData({
      // When change language current page need reset to refresh
      _lang: GetLaguageMap().my,
      currentLanguage: GetCurrentLanguage(),
    });

    UpdateTabBarLaguage();
  },

  //#region private method
  async LoadUser() {
    const myProfile = await CheckUserExistsAsync();
    if (myProfile) {
      const index = Math.floor(Math.random() * Mottos.length);
      this.setData({
        isLoaded: true,
        triggered: false,
        hasAuth: true,
        myMemberId: myProfile.memberId,
        myProfile: myProfile,
        motto: Mottos[index],
        isAdmin: myProfile.userRole === UserRole.Admin.value
      });
    } else {
      this.setData({
        isLoaded: true,
        triggered: false,
        hasAuth: false,
      });
    }
  },

  register() {
    const currentUrl = GetCurrentUrl();
    wx.redirectTo({
      url: `/pages/user/profile/profile?callbackUrl=${currentUrl}`,
    });
  },

  editProfile() {
    const currentUrl = GetCurrentUrl();
    wx.navigateTo({
      url: `/pages/user/profile/profile?memberId=${this.data.myMemberId}&callbackUrl=${currentUrl}`
    })
  },

  tapMemberId() {
    wx.setClipboardData({ data: this.data.myMemberId.toString() });
  },

  async tapDialog(event: IOption) {
    if (event.detail.index === 1) {
      wx.setClipboardData({ data: '06-0869-0723571-05' })
    }
    this.setData({
      dialogShow: !this.data.dialogShow
    });
  },

  languagePickerChange(e: { detail: { value: string } }) {
    const index = Number(e.detail.value);
    ChangeLanguage(index);
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    wx.reLaunch({ url: `/${currentPage.route}` })
  },
  //#endregion

})