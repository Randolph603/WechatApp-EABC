import { LoadAllActivitiesAsync } from "@API/activityService";
import { ActivityType } from "@Lib/types";
import { ExcuteWithLoadingAsync } from "@Lib/utils";

Page({
  data: {
    allActivity: [],
    loading: true,
    triggered: true,
  },

  onLoad: async function () {
    await this.loadAllActivityAsync();
  },

  async loadAllActivityAsync() {
    await ExcuteWithLoadingAsync(async () => {
      const activities = await LoadAllActivitiesAsync(30, ActivityType.Tournament.value, undefined);

      this.setData({
        allActivity: activities,
        loading: false,
        triggered: false,
      });
    });
  },
})