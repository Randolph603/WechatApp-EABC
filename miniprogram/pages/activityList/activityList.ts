import { LoadAllActivitiesAsync } from "@API/activityService";
import { GetLaguageMap } from "@Language/languageUtils";
import { ToShortDateString, ToDayOfWeekString } from "@Lib/utils";

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList
  },

  async onLoad() {
    const activities = await LoadAllActivitiesAsync();
    for (const activity of activities) {
      activity.date = ToShortDateString(activity.startTime);
      activity.dayOfWeek = ToDayOfWeekString(activity.startTime);
    }

    this.setData({
      allActivities: activities,
    });
  },

  onShow() {

  },

  onShareAppMessage() {

  }
})