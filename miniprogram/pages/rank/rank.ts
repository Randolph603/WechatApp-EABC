import { LoadMDRankAsync, LoadMSRankAsync, LoadWDRankAsync, LoadWSRankAsync, LoadXDRankAsync } from "@API/bwfService";
import { GetAllResultsAsync } from "@API/matchService";
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
    users: []
  },

  async onLoad() {
    UpdateTabBarLaguage();
    await this.loalListAsync();
  },

  async loalListAsync() {
    const results = await GetAllResultsAsync();
    console.log(results);

    const matchRank: any[] = [];
    for (const result of results) {
      const displayName = result['player'].displayName;
      const attendeeName = result['player'].attendeeName;
      const name = attendeeName ?? displayName;
      const matchIndex = matchRank.findIndex(item => item.name === name);
      if (matchIndex >= 0) {
        matchRank[matchIndex].array.push(result);
        matchRank[matchIndex].wins += result.wins;
        matchRank[matchIndex].lost += result.lost;
        matchRank[matchIndex].powerOfBattle += result.powerOfBattleChange;
        matchRank[matchIndex].pointDifference += result.pointDifference;
      } else {
        matchRank.push({
          name: name,
          wins: result.wins,
          lost: result.lost,
          powerOfBattle: result.powerOfBattleChange,
          pointDifference: result.pointDifference,
          array: [result]
        })
      }
    }
    const sortMatchRank = matchRank.sort((a, b) => {
      if (b.powerOfBattle === a.powerOfBattle) {
        return b.pointDifference - a.pointDifference;
      }
      return b.powerOfBattle - a.powerOfBattle;
    });
    console.log(sortMatchRank);

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