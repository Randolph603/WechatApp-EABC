import { LoadMDRankAsync, LoadMSRankAsync, LoadWDRankAsync, LoadWSRankAsync, LoadXDRankAsync } from "@API/bwfService";
import { SearchUsersForRankAsync } from "@API/userService";
import { ExcuteWithLoadingAsync, UpdateTabBarLaguage } from "@Lib/utils";

Page({
  data: {
    selectedTab: 0,
    tabList: [{
      id: 'MS',
      name: '男单',
    }, {
      id: 'WS',
      name: '女单',
    }, {
      id: 'MD',
      name: '男双',
    }, {
      id: 'WD',
      name: '女双',
    }, {
      id: 'XD',
      name: '混双',
    }],
    users: [],
    worldMS: []
  },

  async onLoad() {
    UpdateTabBarLaguage();
    await this.loalListAsync();
  },

  async loalListAsync() {
    await ExcuteWithLoadingAsync(async () => {
      const users = await SearchUsersForRankAsync();
      const worldMS = await LoadMSRankAsync();
      const worldWS = await LoadWSRankAsync();
      const worldMD = await LoadMDRankAsync();
      const worldWD = await LoadWDRankAsync();
      const worldXD = await LoadXDRankAsync();
      this.setData({ users: users, worldMS, worldWS, worldMD, worldWD, worldXD, triggered: false });
    });
  },

  onShareAppMessage() {

  },

  onTapTab(e: any) {
    this.setData({
      selectedTab: +e.currentTarget.dataset.index,
    })
  },

  onChange(e: any) {
    this.setData({
      selectedTab: +e.detail.current,
    })
  },
})