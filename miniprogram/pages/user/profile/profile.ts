import { CallCloudFuncAsync, UpdateRecordAsync } from "@API/commonHelper";
import { GetUserByMemberId, RegisterNewUserAsync, UploadAvatarImageAsync } from "@API/userService";
import { GetLaguageMap } from "@Language/languageUtils";
import { LevelArray, UserGender, UserGenderArray, UserLevel } from "@Lib/types";
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetNavBarHeight } from "@Lib/utils";

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Page({
  data: {
    // Static
    _lang: GetLaguageMap().userProfile,
    navBarHeight: GetNavBarHeight() + 100,
    // Status:
    isLoaded: false,
    callbackUrl: '',
    // Variables
    avatarUrl: defaultAvatarUrl,
    user: null,
    formData: {},
    rules: [
      { name: 'displayName', rules: { required: true, maxlength: 20, message: 'name is required with max 20 characters' } },
      { name: 'gender', rules: { required: true } },
      { name: 'genderType', rules: { required: false } },
      { name: 'userLevel', rules: { required: true } },
      { name: 'userLevelType', rules: { required: false } },
    ],
    levelArray: LevelArray,
    genderArray: UserGenderArray,
  },

  async onLoad(options: Record<string, string | undefined>) {
    const { memberId, callbackUrl } = options;
    if (callbackUrl) {
      this.setData({ callbackUrl });
    }

    await ExcuteWithLoadingAsync(async () => {
      const id = Number(memberId);
      const user = await GetUserByMemberId(id);
      let formData = {};
      if (user) {
        formData = {
          displayName: user.displayName,
          gender: user.gender,
          genderType: user.genderType,
          userLevel: user.userLevel,
          userLevelType: user.userLevelType,
        }
        this.setData({ avatarUrl: user.avatarUrl });
      } else {
        formData = {
          displayName: '',
          gender: UserGender.Unknown.value,
          genderType: UserGender.Unknown,
          userLevel: UserLevel.Unknown.value,
          userLevelType: UserLevel.Unknown,
        }
      }
      this.setData({ user, formData, isLoaded: true });

    });
  },

  //#region private method
  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail;
    this.setData({ avatarUrl });
  },

  formTextChange(e: any) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  genderPickerChange(e: any) {
    const index = Number(e.detail.value);
    this.setData({
      [`formData.gender`]: index,
      [`formData.genderType`]: UserGenderArray[index],
    });
  },

  levelPickerChange(e: any) {
    const index = Number(e.detail.value);
    this.setData({
      [`formData.userLevel`]: index,
      [`formData.userLevelType`]: LevelArray[index]
    });
  },

  async submitForm() {
    await ExcuteWithProcessingAsync(() => {
      this.selectComponent('#form').validate(async (valid: any, errors: any) => {
        if (!valid) {
          const firstError = Object.keys(errors);
          console.log(firstError);
          if (firstError.length) {
            wx.showToast({
              title: errors[firstError[0]].message,
              icon: 'none',
            });
          }
        } else {
          try {
            if (!this.data.user) {
              // update avatar need to know member id, register first if no member id
              const newUser = await RegisterNewUserAsync();
              await this.save(newUser);
            } else {
              await this.save(this.data.user);
            }

            if (this.data.callbackUrl) {
              wx.reLaunch({
                url: '/' + this.data.callbackUrl + '?fromCallback=true',
              })
            } else {
              wx.navigateBack({ delta: 0 })
            }
          } catch (e) {
            console.log(e);
          }
        }
      })
    });
  },

  async save(user: any) {
    const { memberId, avatarUrl } = user;
    if (!memberId) return;
    await ExcuteWithProcessingAsync(async () => {
      const { avatarUrl: filePath } = this.data;
      if (filePath !== avatarUrl && filePath !== defaultAvatarUrl) {
        await UploadAvatarImageAsync(filePath, memberId, avatarUrl, this.data.formData);
      } else {
        const updateData = { ...this.data.formData };
        await UpdateRecordAsync('UserProfiles', { memberId }, updateData);
      }
    });
  },

  //#endregion
})