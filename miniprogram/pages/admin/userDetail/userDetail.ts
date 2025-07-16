import { CallCloudFuncAsync, UpdateRecordAsync } from "@API/commonHelper";
import { GetUserByMemberId } from "@API/userService";
import { LevelArray, UserGenderArray, UserRoleArray } from "@Lib/types";
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetNavBarHeight } from "@Lib/utils";
import { IOption } from "@Model/index";
import { iUser, UserModel } from "@Model/User";

Page({
  data: {
    // Static
    navBarHeight: GetNavBarHeight() + 100,
    // Status:
    isLoaded: false,
    // Variables
    formData: null as unknown as UserModel,
    user: null as unknown as iUser,
    userRoleArray: UserRoleArray,
    levelArray: LevelArray,
    genderArray: UserGenderArray,
    // Dialog
    showBalanceChange: false,
    balanceChangeTitle: '充值',
    balanceChangeValue: 17,
  },

  async onLoad(options: Record<string, string | undefined>) {
    const { memberId } = options;
    await ExcuteWithLoadingAsync(async () => {
      const id = Number(memberId);
      this.LoadUser(id);
      this.setData({ isLoaded: true });
    });
  },

  //#region private method
  async LoadUser(memberId: number) {
    const user = await GetUserByMemberId(memberId);
    if (user) {
      const formData = new UserModel(user);
      this.setData({ formData, user });
    } else {
      wx.showToast({
        title: '会员未知',
        icon: 'none',
      });
    }
  },

  FormTextChange(e: IOption) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  FormNumberChange(e: IOption) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: Number(e.detail.value)
    });
  },

  RolePickerChange(e: IOption) {
    const index = Number(e.detail.value);
    this.setData({
      [`formData.userRole`]: index,
      [`user.userRoleType`]: UserRoleArray[index],
    });
  },

  GenderPickerChange(e: IOption) {
    const index = Number(e.detail.value);
    this.setData({
      [`formData.gender`]: index,
      [`user.genderType`]: UserGenderArray[index],
    });
  },

  LevelPickerChange(e: IOption) {
    const index = Number(e.detail.value);
    this.setData({
      [`formData.userLevel`]: index,
      [`user.userLevelType`]: LevelArray[index]
    });
  },

  SubmitForm: async function () {
    this.selectComponent('#form').validate(async (valid: any, errors: any) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          wx.showToast({
            title: errors[firstError[0]].message,
            icon: 'none',
          });
        }
      } else {
        try {
          await this.Save();
        } catch (e) {
          console.log(e);
        }
      }
    })
  },

  async Save() {
    await ExcuteWithProcessingAsync(async () => {
      const updateData = { ...this.data.formData };
      const memberId = this.data.user.memberId;
      if (memberId) {
        await UpdateRecordAsync('UserProfiles', { memberId }, updateData);
      }
    });
  },

  GoToHitoryPage() {
    wx.navigateTo({
      url: '/pages/user/creditHistory/creditHistory?memberId=' + this.data.user.memberId,
    })
  },

  GoToProfilePage() {
    wx.navigateTo({
      url: '/pages/user/profile/profile?memberId=' + this.data.user.memberId,
    })
  },

  ShowBalanceChangeDialog() {
    this.setData({ showBalanceChange: true });
  },

  BalanceChangeTitleChange(e: IOption) {
    this.setData({
      balanceChangeTitle: e.detail.value
    });
  },

  BalanceChangeValueChange(e: IOption) {
    this.setData({
      balanceChangeValue: Number(e.detail.value)
    });
  },

  async TapDialogButton(e: IOption) {
    const title = this.data.balanceChangeTitle;
    let value = this.data.balanceChangeValue;
    const memberId = this.data.user.memberId;

    if (title && title.length > 0 && value && value > 0) {
      // index = 0: top up
      // index = 1: charge 
      if (e.detail.index === 1) {
        value = 0 - value;
      }
      await CallCloudFuncAsync('user_balanceChange', { memberId, title, value });
      await this.LoadUser(memberId);
    }

    this.setData({ showBalanceChange: false });
  },

  //#endregion
})