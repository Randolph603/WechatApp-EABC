import { LoadAllActivitiesAsync } from "@API/activityService";
import { GetLaguageMap } from "@Language/languageUtils";
import { ToShortDateString, ToDayOfWeekString, GetNavBarHeight } from "@Lib/utils";

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList,
    navBarHeight: GetNavBarHeight() + 10,
     // Status:
     isLoaded: false,
  },

  async onLoad() {
    wx.showLoading({
      title: GetLaguageMap().utils.loading,
    });
    const activities = await LoadAllActivitiesAsync();
    for (const activity of activities) {
      activity.date = ToShortDateString(activity.startTime);
      activity.dayOfWeek = ToDayOfWeekString(activity.startTime);
    }

    this.setData({
      allActivities: activities,
      isLoaded: true
    });

    wx.hideLoading();
  },

  onShow() {

  },

  onShareAppMessage() {

  }
})