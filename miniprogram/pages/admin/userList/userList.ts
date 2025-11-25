import { SearchAllUsersAsync } from "@API/userService";
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
      this.setData({
        allUsers: users,
        filterUsers: users,
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
})