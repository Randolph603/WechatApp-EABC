import {
  AttendeeMoveSectionAsync,
  CancelJoinActivityAsync,
  JoinActivityAsync,
  LoadActivityByIdAsync
} from '@API/activityService';
import { CallCloudFuncAsync } from '@API/commonHelper';
import { CheckUserExistsAsync } from '@API/userService';
import { GetAttendTitle, GetLaguageMap } from '@Language/languageUtils';
import { WxShowModalAsync } from '@Lib/promisify';
import { UserRole } from '@Lib/types';
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetCurrentUrl } from '@Lib/utils';
import { iSection, iUser } from '@Model/index';

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityDetail,
    // Status:
    isLoaded: false,
    myProfile: null as unknown as iUser,
    // Variables
    activityId: '',
    activity: {} as any,
    attendTitle: '',
    allSections: [] as any[],
    allJoinedAttendeesCount: 0,
    allCancelledAttendees: [] as any[],
    joinMore: -1,
    // Dialog
    showLowCreditBalance: false,
    showCancelDialog: false,
    // Security
    isAdmin: false,
  },

  onShareAppMessage() {
    const activity = this.data.activity;
    const attendeeCount = this.data.allJoinedAttendeesCount;
    const attendeeMax = activity.maxAttendee;

    const promise = new Promise((resolve, reject) => {
      CallCloudFuncAsync('eabc_activity_share', { activityId: activity._id, router: 'createActivityId' })
        .then(result => {
          console.log(result);
          const wxActivityId = result.wxActivityId;
          wx.updateShareMenu({
            withShareTicket: true,
            isUpdatableMessage: true,
            activityId: wxActivityId,
            templateInfo: {
              templateId: "",
              parameterList: [{
                name: 'member_count',
                value: `${attendeeCount}`
              }, {
                name: 'room_limit',
                value: `${attendeeMax}`
              }]
            }
          });
          resolve({
            title: `${activity.date}, ${activity.title}, ${this.data._lang.shareMessage}`,
            imageUrl: `${activity.coverImageSrc}`,
          })
        })
        .catch(error => reject(error));
    });

    return {
      title: `${activity.date}, ${activity.title}, ${this.data._lang.shareMessage} 333`,
      imageUrl: `${activity.coverImageSrc}`,
      promise
    };
  },

  async onLoad(options: Record<string, string | undefined>) {
    const id = options.id;
    this.setData({
      activityId: id
    });

    const fetchData = async () => {
      await this.LoadMe();
      await this.LoadActivity();
      this.setData({ isLoaded: true });
    };
    await ExcuteWithLoadingAsync(fetchData);
  },

  //#region private method
  // LoadMe first of all
  async LoadMe() {
    const myProfile = await CheckUserExistsAsync();
    if (myProfile) {
      this.setData({
        myProfile: myProfile,
        isAdmin: myProfile.userRole === UserRole.Admin.value,
        showLowCreditBalance: myProfile.creditBalance < 0
      });
    }
  },

  // Run after LoadMe fired
  async LoadActivity() {
    const id = this.data.activityId;
    if (id.length > 0) {
      const activity = await LoadActivityByIdAsync(id, true);
      const allJoinedAttendees = activity.Attendees.filter((a: { isCancelled: boolean; }) => a.isCancelled === false);
      const allCancelledAttendees = activity.Attendees.filter((a: { isCancelled: boolean; }) => a.isCancelled === true);

      const allSections: Array<any> = [];
      if (activity.sections) {
        activity.sections.forEach((s: iSection) => {
          const sectionAttendees = allJoinedAttendees.filter((a: { sectionIndex: number; }) => (a.sectionIndex ?? 0) === s.index);
          allSections.push({
            info: s,
            attendees: sectionAttendees.slice(0, s.maxAttendee),
            onWaitAttendees: sectionAttendees.slice(s.maxAttendee, sectionAttendees.length),
          });
        });
      }

      const attendTitle = GetAttendTitle(allJoinedAttendees.length, activity.maxAttendee);

      const myMemberId = this.data.myProfile?.memberId ?? 0;
      if (myMemberId > 0) {
        const allMyJoins = allJoinedAttendees.filter((a: any) => a.memberId === myMemberId);
        const joinMore = allMyJoins.length - 1;
        this.setData({ joinMore });
      }

      this.setData({
        attendTitle,
        activity,
        allSections,
        allJoinedAttendeesCount: allJoinedAttendees.length,
        allCancelledAttendees
      });

      await CallCloudFuncAsync('eabc_activity_share', { activityId: this.data.activityId, router: 'setUpdatableMsg' });
    }
  },

  navigateBack() {
    wx.navigateBack({
      delta: 0,
    })
  },

  navigateHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  navigateMe() {
    wx.switchTab({
      url: '/pages/user/my/my',
    })
  },

  async joinAsync(event: any) {
    const myMemberId = this.data.myProfile?.memberId ?? 0;
    if (myMemberId > 0) {
      const { join_more } = event.currentTarget.dataset;
      const joinActivityAndReload = async () => {
        await JoinActivityAsync(this.data.activityId, myMemberId, join_more);
        await this.LoadActivity();
      };
      await ExcuteWithProcessingAsync(joinActivityAndReload);
    } else {
      const currentUrl = GetCurrentUrl();
      wx.navigateTo({
        url: '/pages/user/profile/profile?callbackUrl=' + currentUrl,
      });
    }
  },

  async cancelAsync(event: any) {
    const myMemberId = this.data.myProfile?.memberId ?? 0;
    if (myMemberId === 0) {
      return;
    }

    if (this.showCancelPolicyDialog()) {
      return;
    }

    const { join_more } = event.currentTarget.dataset;
    if (this.data.myProfile.continueWeeklyJoin && this.data.myProfile.continueWeeklyJoin > 0) {
      const continueWeeklyJoin = this.data.myProfile.continueWeeklyJoin;
      const discount = continueWeeklyJoin > 3 ? 3 : continueWeeklyJoin;
      const { confirm } = await WxShowModalAsync({
        title: '取消提示',
        content: `您已经连续参加活动${continueWeeklyJoin}周次了，这次活动将有${discount} NZD折扣，取消后下次活动将不再享有折扣。`,
        cancelText: '再想想',
        confirmText: '难过取消'
      });
      if (confirm !== true) {
        return;
      }
    }

    const cancelActivityAndReload = async () => {
      await CancelJoinActivityAsync(this.data.activityId, myMemberId, join_more);
      await this.LoadActivity();
    };
    await ExcuteWithProcessingAsync(cancelActivityAndReload);
  },

  showCancelPolicyDialog() {
    // 36e5 is the scientific notation for 60*60*1000
    const startTime = this.data.activity.startTime;
    const durationInHours = (startTime.getTime() - new Date().getTime()) / 36e5;
    const attendeesCount = this.data.allJoinedAttendeesCount;
    const maxAttendeesCount = this.data.activity.maxAttendee;
    if (durationInHours < 24 && attendeesCount <= maxAttendeesCount) {
      this.setData({ showCancelDialog: true });
      wx.hideLoading();
      return true;
    }
    return false;
  },

  async moveAsync(event: any) {
    const { section_index, join_more, member_id } = event.currentTarget.dataset;
    const moveActivityAndReload = async () => {
      await AttendeeMoveSectionAsync(this.data.activityId, member_id, join_more, section_index);
      await this.LoadActivity();
    };
    await ExcuteWithProcessingAsync(moveActivityAndReload);
  }
  //#endregion
})