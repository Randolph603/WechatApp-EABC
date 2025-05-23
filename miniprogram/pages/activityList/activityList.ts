import { LoadAllActivitiesAsync } from "@API/activityService";
import { GetLaguageMap } from "@Language/languageUtils";

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList
  },

  async onLoad() {
    const activities = await LoadAllActivitiesAsync();
    this.setData({
      allActivities: activities,
    });
  },

  onShow() {

  },

  onShareAppMessage() {

  }
})