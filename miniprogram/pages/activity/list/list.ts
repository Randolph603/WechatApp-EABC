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
    allActivities: [],
    filterActivities: [],
    loadMore: 4,
  },

  async onLoad() {
    try {
      UpdateTabBarLaguage();
      await this.fetchAllDataAsync();
    } catch (error) {
      await HandleException('pages/activity/list/list - onLoad', error)
    }
  },

  onShareAppMessage() { },

  //#region private method
  async fetchAllDataAsync() {
    this.setData({ isLoaded: false });
    
    const activities = await LoadAllActivitiesAsync();

    this.setData({
      allActivities: activities,
      filterActivities: activities.slice(0, this.data.loadMore),
      isLoaded: true,
      triggered: false
    });
  },

  async handleScrollLower() {
    const loadMore = this.data.loadMore + 4;
    const loadAll = loadMore > this.data.allActivities.length
    this.setData({ isLoading: true });
    await this.sleep(500);

    this.setData({
      triggered: false,
      filterActivities: this.data.allActivities.slice(0, loadMore),
      isLoading: false,
      loadMore,
      loadAll,
    });
  },

  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //#endregion
})