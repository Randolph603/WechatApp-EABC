import { SearchAllUsersAsync } from "@API/userService";
import { ExcuteWithLoadingAsync } from "@Lib/utils"

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
})