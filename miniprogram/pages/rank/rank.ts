import { LoadMDRankAsync, LoadMSRankAsync, LoadWDRankAsync, LoadWSRankAsync, LoadXDRankAsync } from "@API/bwfService";
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
    worldMS: null,
    worldWS: null,
    worldMD: null,
    worldWD: null,
    worldXD: null,
  },

  async onLoad() {
    UpdateTabBarLaguage();
    await ExcuteWithLoadingAsync(async () => {
      await this.LoadDataSource();
    });
  },

  // async loalListAsync() {
  //   await ExcuteWithLoadingAsync(async () => {
  //     const users = await SearchUsersForRankAsync();
  //     this.setData({ users: users });
  //   });
  // },

  onShareAppMessage() {

  },

  async onTapTab(e: any) {
    this.setData({ selectedTab: +e.currentTarget.dataset.index });
  },

  async onChange(e: any) {
    const selectedTab = +e.detail.current;
    this.setData({ selectedTab: selectedTab });

    const reloadData =
      (selectedTab === 0 && !this.data.worldMS)
      || (selectedTab === 1 && !this.data.worldWS)
      || (selectedTab === 2 && !this.data.worldMD)
      || (selectedTab === 3 && !this.data.worldWD)
      || (selectedTab === 4 && !this.data.worldXD);
    if (reloadData) {
      await this.LoadDataSource();
    }
  },

  async LoadDataSource() {
    await ExcuteWithLoadingAsync(async () => {
      if (this.data.selectedTab === 0) {
        const worldMS = await LoadMSRankAsync();
        this.setData({ worldMS });
      }
      if (this.data.selectedTab === 1) {
        const worldWS = await LoadWSRankAsync();
        this.setData({ worldWS });
      }
      if (this.data.selectedTab === 2) {
        const worldMD = await LoadMDRankAsync();
        this.setData({ worldMD });
      }
      if (this.data.selectedTab === 3) {
        const worldWD = await LoadWDRankAsync();
        this.setData({ worldWD });
      }
      if (this.data.selectedTab === 4) {
        const worldXD = await LoadXDRankAsync();
        this.setData({ worldXD });
      }
      this.setData({ triggered: false });
    });
  },



})