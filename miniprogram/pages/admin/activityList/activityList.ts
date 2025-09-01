import { LoadAllActivitiesAsync } from "@API/activityService";
import { ExcuteWithLoadingAsync } from "@Lib/utils";
import { IOption } from "@Model/iOption";

Page({
  data: {
    searchTerm: '',
    allActivity: [],
    filterActivity: [],
    loading: true,
    triggered: true,
  },

  onLoad: async function () {
    await this.loadAllActivityAsync();
  },

  onSearchCancel() {
    this.setData({
      searchTerm: '',
      filterActivity: this.data.allActivity,
    });
  },

  // onSearchChange(e) {
  //   const searchText = e.detail.value;
  //   const filterActivity = this.data.allActivity.filter(a =>
  //     a.title.toLowerCase().includes(searchText.toLowerCase())
  //     || a.date.includes(searchText.toLowerCase())
  //   );
  //   this.setData({
  //     searchTerm: searchText,
  //     filterActivity: filterActivity,
  //   });
  // },

  async loadAllActivityAsync() {
    await ExcuteWithLoadingAsync(async () => {
      const activities = await LoadAllActivitiesAsync(20, undefined, undefined);

      this.setData({
        allActivity: activities,
        filterActivity: activities,
        loading: false,
        triggered: false,
      });
    });
  },

  slideButtonTap: async function (e: IOption) {
    const { id: activityId } = e.currentTarget.dataset;
    this.deleteActivity(activityId);
  },

  deleteActivity(activityId: string) {
    const that = this;
    wx.showModal({
      title: '确定要删除活动么?',
      confirmText: '是的',
      cancelText: '取消',
      async success(res) {
        if (res.confirm) {
          await that.updateActivity(activityId, true);
        }
      }
    });
  },

  async updateActivity(activityId: string, isCancelled: boolean) {
    // await cloudUtil.updateRecordAsync('Activities', { _id: activityId }, { isCancelled });
    // await this.loadAllActivityAsync();
  },
})