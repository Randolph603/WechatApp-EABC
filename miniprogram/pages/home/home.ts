import { LoadAllActivitiesAsync } from "@API/activityService";
import { HandleException } from "@API/commonHelper";
import { GetLaguageMap } from "@Language/languageUtils";
import { GetNavBarHeight, UpdateTabBarLaguage } from "@Lib/utils";

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList,
    navBarHeight: GetNavBarHeight() + 10,
    // Status:
    isLoaded: false,
    triggered: false,
    // Variables   
    activities: [],
  },

  async onLoad() {
    UpdateTabBarLaguage();

    try {
      if (this.data.activities.length === 0) {
        await this.fetchAllDataAsync();
      }
    } catch (error) {

      await HandleException('onLoad', error)
    }
  },

  onShareAppMessage() { },

  //#region private method

  async fetchAllDataAsync() {
    this.setData({ isLoaded: false });
    const activities = await LoadAllActivitiesAsync(6, undefined, true);
    this.setData({
      activities: activities,
      isLoaded: true,
      triggered: false
    });
  },

  //#endregion
})