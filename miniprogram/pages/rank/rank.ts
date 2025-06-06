import { SearchAllUsersAsync } from "@API/userService";
import { InitialiseTabPageAndCheckUser } from "@Lib/utils";

Page({
  data: {
    selectedTab: 0,
    tabList: [{
      id: 'question',
      name: '个人',
    }, {
      id: 'blog',
      name: '队伍',
    }, {
      id: 'others',
      name: '积分',
    }],
    users: [],
    rankList: [
      { rank: 4, name: "Rosie Nash", score: 24324, avatar: "/images/rosie.png" },
      { rank: 5, name: "Lucy Nguyen", score: 12324, avatar: "/images/lucy.png" },
      { rank: 6, name: "Birdie Potter", score: 4324, avatar: "/images/birdie.png" },
      { rank: 7, name: "Celia Brewer", score: 4324, avatar: "/images/celia.png" },
      { rank: 9, name: "Lizzie Rhodes", score: 3324, avatar: "/images/lizzie.png" },
    ]
  },

  async onLoad() {
    await InitialiseTabPageAndCheckUser();

    const users = await SearchAllUsersAsync();
    this.setData({
      users: users
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