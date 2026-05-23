import { UpdateRecordAsync } from "@API/commonHelper";
import { GetUserByMemberId, RegisterNewUserAsync, UploadAvatarImageAsync } from "@API/userService";
import { GetLaguageMap } from "@Language/languageUtils";
import { LevelArray, UserGender, UserGenderArray, userSelfRatingLevelArray, userSelfRatingLevelMap } from "@Lib/types";
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetNavBarHeight, NavigateBack } from "@Lib/utils";
import { IOption } from "@Model/iOption";
import { ProfileModel } from "@Model/User";

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
    parentMemberId: undefined,
    user: null as any,
    formData: {} as any,
    rules: [
      { name: 'displayName', rules: { required: true, maxlength: 20, message: 'name is required with max 20 characters' } },
      { name: 'gender', rules: { required: true, min: 1, message: 'Gender is required' } },
      { name: 'selfRatingLevel', rules: { required: true } },
    ],
    levelArray: LevelArray,
    genderArray: UserGenderArray,
    showSelfRatingLevel: false,
    selfRatingLevelIndex: 0,
    userSelfRatingLevelMap: userSelfRatingLevelMap,
    userSelfRatingLevelArray: userSelfRatingLevelArray,
  },

  async onLoad(options: Record<string, string | undefined>) {
    const { memberId, parentMemberId, callbackUrl, callbackParameterKey, callbackParameterValue } = options;

    if (callbackUrl) {
      this.setData({
        callbackUrl: callbackParameterKey
          ? `${callbackUrl}?${callbackParameterKey}=${callbackParameterValue}`
          : callbackUrl
      });
    }

    let formData = {
      displayName: '',
      gender: UserGender.Unknown.value,
      selfRatingLevel: 0,
      parentMemberId: parentMemberId ?  Number(parentMemberId) : undefined
    };

    await ExcuteWithLoadingAsync(async () => {
      if (memberId) {
        const id = Number(memberId);
        const user = await GetUserByMemberId(id);
        if (user) {
          formData.displayName = user.displayName;
          formData.gender = user.gender;
          formData.selfRatingLevel = user.selfRatingLevel ?? 0;
          formData.parentMemberId = user.parentMemberId;

          var selfRatingLevelIndex = user.selfRatingLevel ?? 0 > 1 ? user.selfRatingLevel - 1 : 0
          this.setData({ avatarUrl: user.avatarUrl, selfRatingLevelIndex: selfRatingLevelIndex });
        }
        this.setData({ user });
      }
      this.setData({ formData, isLoaded: true });
    });
  },

  //#region private method
  navigateBack() {
    NavigateBack();
  },

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

  changeGender(e: IOption) {
    const { value } = e.currentTarget.dataset;
    this.setData({ [`formData.gender`]: value });
  },

  selfRatingLevel() {
    this.setData({ showSelfRatingLevel: true });
  },

  onSwiperChange(e: any) {
    const current = e.detail.current;
    this.setData({ selfRatingLevelIndex: current });
  },

  chooseSelfLevel() {
    this.setData({
      showSelfRatingLevel: false,
      [`formData.selfRatingLevel`]: this.data.selfRatingLevelIndex + 1
    });
  },

  async submitForm() {
    this.selectComponent('#form').validate(async (valid: any, errors: any) => {
      if (!valid) {
        const firstError = Object.keys(errors);
        if (firstError.length) {
          wx.showToast({
            title: errors[firstError[0]].message,
            icon: 'none',
          });
        }
      } else {
        await ExcuteWithProcessingAsync(async () => {
          try {
            const existingUser = this.data.user;
            if (existingUser) {
              await this.Save(existingUser.memberId, existingUser.avatarUrl, existingUser.avatarFile);
            } else {
              // update avatar need to know member id, register first if no member id
              const { parentMemberId } = this.data.formData;
              const newUser = await RegisterNewUserAsync(parentMemberId);
              await this.Save(newUser.memberId, newUser.avatarUrl);
            }

            if (this.data.callbackUrl) {
              wx.reLaunch({ url: '/' + this.data.callbackUrl });
            } else {
              NavigateBack();
            }
          } catch (e) {
            console.log(e);
          }
        });
      }
    });
  },

  async Save(memberId: number, oldAvatarUrl: string, oldAvatarFile: string | null = null) {
    if (!memberId) return;
    const newAvatarUrl = this.data.avatarUrl;
    const profile = new ProfileModel(this.data.formData);
    const updateData = { ...profile } as any;
    if (newAvatarUrl !== oldAvatarUrl && newAvatarUrl !== defaultAvatarUrl) {
      const result = await UploadAvatarImageAsync(newAvatarUrl, memberId, oldAvatarFile);
      if (result) {
        const { fileID, download_url } = result;
        if (download_url) { updateData.avatarUrl = download_url; }
        if (fileID) { updateData.avatarFile = fileID; }
      }
    }
    await UpdateRecordAsync('UserProfiles', { memberId }, updateData);
  },

  //#endregion
})