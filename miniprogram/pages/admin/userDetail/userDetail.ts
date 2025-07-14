import { GetUserByMemberId } from "@API/userService";
import { LevelArray, UserGenderArray, UserRoleArray } from "@Lib/types";
import { ExcuteWithLoadingAsync, GetNavBarHeight } from "@Lib/utils";

Page({
  data: {
    // Static
    navBarHeight: GetNavBarHeight() + 100,
    // Status:
    isLoaded: false,
    // Variables
    userRoleArray: UserRoleArray,
    levelArray: LevelArray,
    genderArray: UserGenderArray,
  },

  async onLoad(options: Record<string, string | undefined>) {
    const { memberId } = options;
    await ExcuteWithLoadingAsync(async () => {
      const id = Number(memberId);
      const user = await GetUserByMemberId(id);
      if (user) {
        const formData = {
          displayName: user.displayName,
          userRole: user.userRole,
          userRoleType: user.userRoleType,
          gender: user.gender,
          genderType: user.genderType,
          userLevel: user.userLevel,
          userLevelType: user.userLevelType,
          creditBalance: user.creditBalance,
        }
        this.setData({ formData });
      } else {
        wx.showToast({
          title: '会员未知',
          icon: 'none',
        });
      }

      this.setData({ user, isLoaded: true });
    });
  },
})