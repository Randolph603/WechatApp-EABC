import { LoadMDRankAsync, LoadMSRankAsync, LoadWDRankAsync, LoadWSRankAsync, LoadXDRankAsync } from "@API/bwfService";
import { GetAllResultsAsync } from "@API/matchService";
import { ExcuteWithLoadingAsync, UpdateTabBarLaguage } from "@Lib/utils";

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Page({
  data: {
    showEABC: false,
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
    worldMS: null,
    worldWS: null,
    worldMD: null,
    worldWD: null,
    worldXD: null,

    // EABC
    tabs: [{
      id: 'MS',
      name: '综合',
    }, {
      id: 'WS',
      name: '女',
    }, {
      id: 'MD',
      name: '男',
    }],
    users: null as any,
  },

  async onLoad() {
    UpdateTabBarLaguage();
    await ExcuteWithLoadingAsync(async () => {
      await this.LoadDataSource();
    });
  },

  async loalListAsync() {
    await ExcuteWithLoadingAsync(async () => {
      // const allUsers = await SearchAllUsersAsync();
      const results: any[] = await GetAllResultsAsync();
      const users = results.map((d, i) => {
        // const findUser = allUsers.find(u => u.memberId === d.memberId);
        return {
          rank: i + 1,
          rank_change: 0,
          rank_previous: 0,
          tournaments: d.array.length,
          powerOfBattle: d.powerOfBattle,
          points: Number(d.powerOfBattle).toLocaleString("en-US"),
          displayName: d.name,
          nation: "",
          avatarUrl: defaultAvatarUrl,
        };
      });
      const filterUsers = users.filter(u => u.tournaments > 1 || u.powerOfBattle > 20);
      this.setData({ users: filterUsers });
    });
  },

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
    if (reloadData && !this.data.showEABC) {
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

  async switchChange() {
    this.setData({ showEABC: !this.data.showEABC });
    if (this.data.showEABC) {
      await this.loalListAsync();
    }
  }

})