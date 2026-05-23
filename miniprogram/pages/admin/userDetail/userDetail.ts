import { CallCloudFuncAsync, UpdateRecordAsync } from "@API/commonHelper";
import { creditTransferAsync, GetSubUsersByParentMemberId, GetUserByMemberId, SearchUsersByKeyAsync, SetupUserBadges } from "@API/userService";
import { UserBadgesArray, UserGenderArray, UserRoleArray } from "@Lib/types";
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

const defaultCreditTransferUser = { memberId: 0, name: '', value: 0 };

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
    theSelectedBadge: null as unknown as iBadge,
    userBadgesArray: UserBadgesArray,
    // Credit transfer dialog
    showCreditTransferDialog: false,
    creditTransferUser: defaultCreditTransferUser,
    creditTransferSearchUsers: [] as any[]
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
      const subUsers = await GetSubUsersByParentMemberId(memberId);
      const formData = new UserModel(user);
      this.setData({ formData, user, subUsers });
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
      const updateData = {
        ...this.data.formData,
        badges: this.data.formData.badges.map((b: any) => new BadgeModel(b))
      };
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

  ShowCreditChangeDialog() {
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
        await CallCloudFuncAsync('user_balanceChange', { list: [{ memberId, title, value }] });
        await this.LoadUser(memberId);
      };
      await ExcuteWithProcessingAsync(topUpAndReloadUser);
    }

    this.setData({ showBalanceChange: false });
  },

  //#region Credit Transfer
  ShowCreditTransferDialog() {
    this.setData({ showCreditTransferDialog: true });
  },

  clearCreditTransferUser() {
    this.setData({ creditTransferUser: defaultCreditTransferUser });
  },

  changeCreditTransferUserName(e: IOption) {
    this.setData({ [`creditTransferUser.name`]: e.detail.value });
  },

  async onSearchCreditTransferUser() {
    await ExcuteWithProcessingAsync(async () => {
      const searchText = this.data.creditTransferUser.name;
      const users = await SearchUsersByKeyAsync(searchText, 3);
      const { memberId } = this.data.user;
      const creditTransferSearchUsers = users.filter((u: any) => u.memberId !== memberId);
      this.setData({ creditTransferSearchUsers });
    }, false);
  },

  onCancelCreditTransferUserSearch() {
    this.setData({ creditTransferSearchUsers: [] });
    this.setData({ [`creditTransferUser.name`]: '' });
  },

  onSearchUserSelected(e: IOption) {
    const { user } = e.currentTarget.dataset;
    if (!user) return;

    this.setData({
      [`creditTransferUser.memberId`]: user.memberId,
      [`creditTransferUser.name`]: user.displayName,
      creditTransferSearchUsers: []
    });
  },

  onCreditTransferValueChange(e: IOption) {
    this.setData({
      [`creditTransferUser.value`]: Number(e.detail.value)
    });
  },

  async creditTransfer() {
    const toUser = this.data.creditTransferUser;
    const { memberId, displayName, creditBalance } = this.data.user;
    const from = { memberId, name: displayName };
    const to = { memberId: toUser.memberId, name: toUser.name };
    if (creditBalance >= toUser.value && toUser.value > 0) {
      const transferAndReloadUser = async () => {
        await creditTransferAsync(toUser.value, from, to);
        await this.LoadUser(memberId);
      };
      await ExcuteWithProcessingAsync(transferAndReloadUser);
      this.setData({ showCreditTransferDialog: false });
    } else {
      wx.showToast({
        title: '余额不足或无转账',
        icon: 'error',
        duration: 2000
      })
    }
  },
  //#endregion

  //#region Badges
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

  showBadgeDialog(e: IOption) {
    const { badge } = e.currentTarget.dataset;
    const newBadge = SetupUserBadges(new BadgeModel());
    const theSelectedBadge = badge ? badge : newBadge;
    this.setData({
      showBadgeDialog: true,
      theSelectedBadge: theSelectedBadge
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
    if (theSelectedBadge.id) {
      const index = currentBadges.findIndex(b => b.id === theSelectedBadge.id);
      if (index !== -1) {
        currentBadges[index] = theSelectedBadge;
      }
    } else {
      theSelectedBadge.id = GetRandomIdentityId();
      currentBadges.push(theSelectedBadge);
    }

    this.setData({
      [`formData.badges`]: currentBadges,
      showBadgeDialog: false,
    });
  },
  //#endregion

  AddSubAccountPage() {
    wx.navigateTo({
      url: '/pages/user/profile/profile?parentMemberId=' + this.data.user.memberId,
    })
  },

  GoToAccountPage(e: IOption) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/admin/userDetail/userDetail?memberId=' + id,
    });
  }
})