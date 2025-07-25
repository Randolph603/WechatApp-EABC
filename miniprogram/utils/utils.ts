import { HandleException } from "@API/commonHelper";
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
    wx.setTabBarItem({
      index: i,
      text: text
    })
  });
}

export const GetCurrentUrl = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const currentUrl = currentPage.route;
  return currentUrl;
}

export const ExcuteWithProcessingAsync = async (actionAsync: Function, showToast: boolean = true) => {
  var lang = GetLaguageMap().utils;
  try {
    wx.showLoading({ title: lang.processing, mask: true });
    await actionAsync();
    wx.hideLoading();

    if (showToast) {
      wx.showToast({ title: lang.success, icon: 'success' });
    }
  } catch (error) {
    wx.hideLoading();
    wx.showToast({ title: lang.failed, icon: 'none' });
    await HandleException('ExcuteWithProcessingAsync-' + actionAsync.name, error);
    console.log(error);
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
    await HandleException('ExcuteWithLoadingAsync-' + actionAsync.name, error);
  }
}