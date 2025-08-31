import { LoadAllActivitiesAsync } from "@API/activityService";
import { HandleException } from "@API/commonHelper";
import { GetLaguageMap } from "@Language/languageUtils";
import { ActivityType } from "@Lib/types";
import { GetNavBarHeight } from "@Lib/utils";

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList,
    navBarHeight: GetNavBarHeight() + 10,
    // Status:
    isLoaded: false,
    triggered: false,
    // Variables   
    tabs: [
      { type: undefined, display: GetLaguageMap().activityList.tabs.all },
      { type: ActivityType.Section.value, display: ActivityType.Section.name },
      { type: ActivityType.Rank.value, display: ActivityType.Rank.name },
      { type: ActivityType.Tournament.value, display: ActivityType.Tournament.name },
      // { type: 'my', display: GetLaguageMap().activityList.tabs.my },
    ],
    selectedTabType: undefined,
    allActivities: [],
    filterActivities: [],
    loadMore: 8,
  },

  async onLoad() {
    try {
      await this.fetchAllDataAsync();
    } catch (error) {
      await HandleException('onLoad', error)
    }
  },

  onShareAppMessage() { },

  //#region private method

  navigateHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  async tabClick(option: { currentTarget: { dataset: { selected: any; }; }; }) {
    const selected = option.currentTarget.dataset.selected;
    this.setData({ selectedTabType: selected });
    await this.fetchAllDataAsync();
  },

  async fetchAllDataAsync() {
    this.setData({ isLoaded: false });
    const type = this.data.selectedTabType;
    const activities = await LoadAllActivitiesAsync(20, type, true);

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