import { SearchAllUsersAsync } from "@API/userService";
import { UserRole } from "@Lib/types";
import { ExcuteWithLoadingAsync } from "@Lib/utils"
import { IOption } from "@Model/index";

Page({
  data: {
    slideActiveButtons: [{
      type: 'default',
      text: 'Active',
    }],
    slideCancelButtons: [{
      type: 'warn',
      text: 'Delete',
    }],
    // Tab
    selectedTab: 0,
    swiperHeight: 0,
    searchTerm: '',
    allUsers: [],
    filterUsers: [],
    triggered: true,
    total: 0,
  },

  async onLoad() {
    await ExcuteWithLoadingAsync(async () => {
      const users = await SearchAllUsersAsync();
      const total = users.reduce((acc: number, element: any) => acc + element.creditBalance, 0);
      const filterUsers = users
        .filter((u: any) => [UserRole.Admin.value, UserRole.Manager.value, UserRole.ActiveUser.value].includes(u.userRole))
        .sort((a: any, b: any) => b.continueWeeklyJoin - a.continueWeeklyJoin);
      this.setData({
        allUsers: users,
        filterUsers: filterUsers,
        triggered: false,
        total,
      });
    });
  },

  onSearchCancel() {
    this.setData({
      searchTerm: '',
      filterUsers: this.data.allUsers,
    });
  },

  onSearchChange(e: IOption) {
    const searchText = e.detail.value;
    if (searchText.length === 0) return;

    const filterUsers = this.data.allUsers.filter((user: any) =>
      user.displayName?.toLowerCase().includes(searchText.toLowerCase())
      || user.bankName?.toLowerCase().includes(searchText.toLowerCase())
      || user.memberId.toString().includes(searchText.toLowerCase())
    );
    this.setData({
      searchTerm: searchText,
      filterUsers: filterUsers,
    });
  },

  onTapTab(e: any) {
    const current = Number(e.currentTarget.dataset.index);
    this.setData({ selectedTab: current });
    if (current === 0) {
      const filterUsers = this.data.allUsers
        .filter((u: any) => [UserRole.Admin.value, UserRole.Manager.value, UserRole.ActiveUser.value].includes(u.userRole))
        .sort((a: any, b: any) => b.continueWeeklyJoin - a.continueWeeklyJoin);
      this.setData({ filterUsers: filterUsers });
    }
    if (current === 1) {
      const filterUsers = this.data.allUsers
        .filter((u: any) => u.creditBalance < 0)
        .sort((a: any, b: any) => a.creditBalance - b.creditBalance);
      this.setData({ filterUsers: filterUsers });
    }
    if (current === 2) {
      const filterUsers = this.data.allUsers
        .filter((u: any) => [UserRole.InActiveUser.value].includes(u.userRole))
        .sort((a: any, b: any) => b.continueWeeklyJoin - a.continueWeeklyJoin);
      this.setData({ filterUsers: filterUsers });
    }
    if (current === 3) {
      const filterUsers = this.data.allUsers.sort((a: any, b: any) => b.memberId - a.memberId);
      this.setData({ filterUsers: filterUsers });
    }
  },
})