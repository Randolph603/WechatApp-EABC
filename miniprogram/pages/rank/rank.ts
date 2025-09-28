import { LoadMDRankAsync, LoadMSRankAsync, LoadWDRankAsync, LoadWSRankAsync, LoadXDRankAsync } from "@API/bwfService";
import { GetMatchRankAsync } from "@API/matchService";
import { SearchAllUsersAsync } from "@API/userService";
import { getCurrentWeekSpan } from "@Lib/dateExtension";
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
    thisWeekAllData: null as any,
    lastWeekMaleData: null as any,
    thisWeekFemaleData: null as any,
    currentWeek: getCurrentWeekSpan(),
  },

  async onLoad() {
    UpdateTabBarLaguage();
    await ExcuteWithLoadingAsync(async () => {
      await this.LoadDataSource();
    });
  },

  async loalListAsync() {
    await ExcuteWithLoadingAsync(async () => {
      const weeks = this.data.currentWeek;
      const allUsers = await SearchAllUsersAsync();
      const results = await GetMatchRankAsync(weeks);
      console.log(results);
      if (results && results.length > 1) {
        const lastWeekAll = results[0].generalRank;
        const mapToData = (data: any, i: number) => {
          return {
            rank: i + 1,
            memberId: data.memberId,
            displayName: data.name,
            gender: data.gender,
            tournaments: data.array.length,
            powerOfBattle: data.powerOfBattle,
            pointDifference: data.pointDifference,
          }
        };

        const lastWeekAllData = lastWeekAll.map((data: any, i: number) => mapToData(data, i));
        const lastWeekMaleData = lastWeekAll.filter((u: any) => u.gender === 1)
          .map((data: any, i: number) => mapToData(data, i));
        const lastWeekFemaleData = lastWeekAll.filter((u: any) => u.gender === 2)
          .map((data: any, i: number) => mapToData(data, i));

        const thisWeek = results[1].generalRank;
        const mapToDisplayData = (lastWeekData: any, data: any, i: number) => {
          const matched = lastWeekData.find((lastWeekData: any) =>
            lastWeekData.memberId === data.memberId
            || (lastWeekData.gender === data.gender && lastWeekData.displayName === data.name));
          const findUser = allUsers.find((u: any) => u.memberId === data.memberId);
          return {
            rank: i + 1,
            rank_change: matched ? matched.rank - (i + 1) : 0,
            rank_previous: matched ? matched.rank : 0,
            memberId: data.memberId,
            displayName: data.name,
            gender: data.gender,
            tournaments: data.array.length,
            tournaments_change: matched ? data.array.length - matched.tournaments : 0,
            powerOfBattle: data.powerOfBattle,
            powerOfBattle_change: matched ? data.powerOfBattle - matched.powerOfBattle : 0,
            points: Number(data.powerOfBattle).toLocaleString("en-US"),
            pointDifference: data.pointDifference,
            avatarUrl: findUser ? findUser.avatarUrl : defaultAvatarUrl,
          }
        };
        const thisWeekAllData = thisWeek.map((data: any, i: number) => mapToDisplayData(lastWeekAllData, data, i));
        const thisWeekMaleData = thisWeek.filter((u: any) => u.gender === 1).map((data: any, i: number) => mapToDisplayData(lastWeekMaleData, data, i));
        const thisWeekFemaleData = thisWeek.filter((u: any) => u.gender === 2).map((data: any, i: number) => mapToDisplayData(lastWeekFemaleData, data, i));

        this.setData({
          thisWeekAllData: thisWeekAllData.slice(0, 20),
          thisWeekMaleData: thisWeekMaleData.slice(0, 20),
          thisWeekFemaleData: thisWeekFemaleData.slice(0, 20)
        });
      }
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