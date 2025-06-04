import { GetUserByUnionId } from "@API/userService";
import { GetLaguageMap } from "@Language/languageUtils";

export const ConvertFileIdToHttps = (fileId: string) => {
  const regex = /cloud:\/\/(.+)\.([^\/]+)\/(.+)/;
  const match = fileId.match(regex);
  if (!match) {
    return '无法兑换成https链接';
  }
  // const envId = match[1];
  const customId = match[2];
  const path = match[3];
  return `https://${customId}.tcb.qcloud.la/${path}`;
}

export const GetNavBarHeight = () => {
  const rect = wx.getMenuButtonBoundingClientRect();
  const statusBarHeight = wx.getWindowInfo().statusBarHeight;
  const navBarHeight = rect.bottom + rect.top - statusBarHeight;
  return navBarHeight;
}


export const UpdateTabBarLaguage = () => {
  GetLaguageMap()["tabbar"].list.forEach(({ text }, i) => {
    if (i === 2) return;
    wx.setTabBarItem({
      index: i,
      text: text
    })
  });
}

export const CheckUserExistsAsync = async () => {
  const user = await GetUserByUnionId();
  if (!user) {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const currentUrl = currentPage.route;
    wx.navigateTo({
      url: '/pages/user/profile/profile?callbackUrl=' + currentUrl,
    });
  }
  return user;
}

// this is for all tab page.
export const InitialiseTabPageAndCheckUser = async () => {
  UpdateTabBarLaguage();
  await CheckUserExistsAsync();
}

export const ExcuteWithProcessingAsync = async (actionAsync: Function) => {
  var lang = GetLaguageMap().utils;
  try {
    wx.showLoading({ title: lang.processing, mask: true });
    await actionAsync();
    wx.hideLoading();

    wx.showToast({ title: lang.success, icon: 'success' });
  } catch (error) {
    wx.hideLoading();
    wx.showToast({ title: lang.failed, icon: 'none' });
  }
}

export const ExcuteWithLoadingAsync = async (actionAsync: Function) => {
  var lang = GetLaguageMap().utils;
  try {
    wx.showLoading({ title: lang.loading, mask: true });
    await actionAsync();
    wx.hideLoading();
  } catch (error) {
    wx.hideLoading();
    wx.showToast({ title: lang.failed, icon: 'none' });
  }
}