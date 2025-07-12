import {
  AttendeeMoveSectionAsync,
  CancelJoinActivityAsync,
  JoinActivityAsync,
  LoadActivityByIdAsync
} from '@API/activityService';
import { CallCloudFuncAsync } from '@API/commonHelper';
import { CheckUserExistsAsync } from '@API/userService';
import { GetAttendTitle, GetLaguageMap } from '@Language/languageUtils';
import { SortDate } from '@Lib/dateExtension';
import { UserRole } from '@Lib/types';
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetCurrentUrl } from '@Lib/utils';
import { iSection } from '@Model/index';

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityDetail,
    // Status:
    isLoaded: false,
    myMemberId: 0,
    myProfile: {} as any,
    // Variables
    activityId: '',
    activity: {} as any,
    attendTitle: '',
    allSections: [] as any[],
    allJoinedAttendeesCount: 0,
    allCancelledAttendees: [] as any[],
    joinMore: 0,
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

    await ExcuteWithLoadingAsync(async () => {
      const loadActivityTask = this.loadActivity();
      const loadMeTask = this.LoadMe();
      await Promise.all([loadActivityTask, loadMeTask]);

      if ((this.data.myProfile.creditBalance ?? 0) < 0) {
        this.setData({ showLowCreditBalance: true });
      }

      if (this.data.activity) {
        const joinMore = this.data.activity.Attendees.filter(
          (a: any) => a.memberId === this.data.myMemberId && a.isCancelled === false).length - 1;
        this.setData({ joinMore });
        await CallCloudFuncAsync('eabc_activity_share', { activityId: this.data.activityId, router: 'setUpdatableMsg' });
      }
    });

    
  },

  //#region private method
  async LoadMe() {
    const myProfile = await CheckUserExistsAsync();
    if (myProfile) {
      this.setData({
        myMemberId: myProfile.memberId,
        myProfile: myProfile,
        isAdmin: myProfile.userRole === UserRole.Admin.value
      });
    }
  },

  async loadActivity() {
    const id = this.data.activityId;
    if (id.length > 0) {
      const activity = await LoadActivityByIdAsync(id);

      const allAttendees = activity.Attendees.sort(
        (a: { updateDate: any; }, b: { updateDate: any; }) => SortDate(a.updateDate, b.updateDate));

      const allJoinedAttendees = allAttendees.filter((a: { isCancelled: boolean; }) => a.isCancelled === false);
      const allCancelledAttendees = allAttendees.filter((a: { isCancelled: boolean; }) => a.isCancelled === true);

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
      this.setData({
        attendTitle,
        activity,
        allSections,
        allJoinedAttendeesCount: allJoinedAttendees.length,
        allCancelledAttendees,
        isLoaded: true
      });
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
    if (this.data.myMemberId > 0) {
      const { join_more } = event.currentTarget.dataset;
      await ExcuteWithProcessingAsync(async () => {
        await JoinActivityAsync(this.data.activityId, this.data.myMemberId, join_more);
        await this.loadActivity();
      });
    } else {
      const currentUrl = GetCurrentUrl();
      wx.navigateTo({
        url: '/pages/user/profile/profile?callbackUrl=' + currentUrl,
      });
    }
  },

  async cancelAsync(event: any) {
    const { join_more } = event.currentTarget.dataset;
    await ExcuteWithProcessingAsync(async () => {
      if (this.showCancelPolicyDialog()) {
        return;
      }

      // if (this.data.myProfile.continueWeeklyJoin && this.data.myProfile.continueWeeklyJoin > 0) {
      //   wx.hideLoading();
      //   const continueWeeklyJoin = this.data.myProfile.continueWeeklyJoin;
      //   const activityPrice = this.data.activity.price;
      //   const priceWithDisc = activityPrice - (continueWeeklyJoin > 3 ? 3 : continueWeeklyJoin);
      //   const { cancel } = await utilWX.showModalPromisified({
      //     title: '取消提示',
      //     content: `您已经连续参加活动${continueWeeklyJoin}周次了，这次活动只需要${priceWithDisc} NZD，中断后下次活动将恢复至${activityPrice} NZD`,
      //     cancelText: 'No',
      //     confirmText: 'Yes'
      //   });
      //   if (cancel) {
      //     return;
      //   } else {
      //     wx.showLoading({ title: 'Processing...', mask: true });
      //   }
      // }

      await CancelJoinActivityAsync(this.data.activityId, this.data.myMemberId, join_more);
      await this.loadActivity();
    });
  },

  showCancelPolicyDialog() {
    // 36e5 is the scientific notation for 60*60*1000
    const startTime = new Date(this.data.activity.startTime);
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
    await ExcuteWithProcessingAsync(async () => {
      await AttendeeMoveSectionAsync(this.data.activityId, member_id, join_more, section_index);
      await this.loadActivity();
    });
  }

  //#endregion

})