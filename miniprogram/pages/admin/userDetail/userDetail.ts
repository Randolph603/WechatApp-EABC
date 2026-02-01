import { CallCloudFuncAsync, UpdateRecordAsync } from "@API/commonHelper";
import { GetUserByMemberId } from "@API/userService";
import { UserBadges, UserBadgesArray, UserGenderArray, UserRoleArray } from "@Lib/types";
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetNavBarHeight, GetRandomIdentityId } from "@Lib/utils";
import { IOption } from "@Model/index";
import { BadgeModel, iBadge, iUser, UserModel } from "@Model/User";

const rules = [
  { name: 'displayName', rules: { required: true } },
  { name: 'bankName', rules: { required: false } },
  { name: 'userRole', rules: { required: true } },
  { name: 'gender', rules: { required: true } },
  { name: 'powerPoint', rules: { required: true } },
  { name: 'continueWeeklyJoin', rules: { required: false } },
  { name: 'powerOfBattle', rules: { required: false } },
  { name: 'badges', rules: { required: false } },
];

Page({
  data: {
    // Static
    navBarHeight: GetNavBarHeight() + 100,
    // Status:
    rules: rules,
    isLoaded: false,
    // Variables
    formData: new UserModel(),
    user: null as unknown as iUser,
    userRoleArray: UserRoleArray,
    genderArray: UserGenderArray,
    // Dialog
    showBalanceChange: false,
    balanceChangeTitle: '充值',
    balanceChangeValue: 15,
    showBadgeDialog: false,
    theSelectedBadge: new BadgeModel(),
    userBadgesArray: UserBadgesArray
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
      const topUpAndReloadUser = async () => {
        await CallCloudFuncAsync('user_balanceChange', { memberId, title, value });
        await this.LoadUser(memberId);
      };
      await ExcuteWithProcessingAsync(topUpAndReloadUser);
    }

    this.setData({ showBalanceChange: false });
  },

  showBadgeDialog(e: IOption) {
    const { badge } = e.currentTarget.dataset;
    this.setData({
      showBadgeDialog: true,
      theSelectedBadge: badge
    });
  },

  badgePickerChange(e: IOption) {
    const index = Number(e.detail.value);
    const selected = this.data.userBadgesArray[index];
    this.setData({
      [`theSelectedBadge.type`]: selected.type,
      [`theSelectedBadge.title`]: selected.title,
    });
  },

  badgeDateChange(e: IOption) {
    const newDate = new Date(e.detail.value);
    this.setData({
      [`theSelectedBadge.createDateString`]: e.detail.value,
      ['theSelectedBadge.createDate']: newDate
    });
  },

  addBadge() {
    const currentBadges = this.data.formData.badges;
    currentBadges.push(new BadgeModel());
    this.setData({
      [`formData.badges`]: currentBadges,
      showBadgeDialog: false,
    });
  },

  removeBadge(e: IOption) {
    const { badge } = e.currentTarget.dataset;
    const currentBadges = this.data.formData.badges;
    const newBadges = currentBadges.filter((b: iBadge) => b.id !== badge.id);
    this.setData({
      [`formData.badges`]: newBadges
    });
  },

  SaveBadge() {
    const currentBadges = this.data.formData.badges;
    const theSelectedBadge = this.data.theSelectedBadge;
    const index = currentBadges.findIndex(b => b.id === theSelectedBadge.id);
    if (index !== -1) {
      currentBadges[index] = theSelectedBadge;
    }

    this.setData({
      [`formData.badges`]: currentBadges,
      showBadgeDialog: false,
    });
  },
  //#endregion
})