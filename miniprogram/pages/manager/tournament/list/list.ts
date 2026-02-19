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
      const activities1 = await LoadAllActivitiesAsync(30, ActivityType.Tournament.value, undefined);
      const activities2 = await LoadAllActivitiesAsync(10, ActivityType.Rank.value, undefined);

      const activities = activities1.concat(activities2);

      this.setData({
        allActivity: activities,
        loading: false,
        triggered: false,
      });
    });
  },
})