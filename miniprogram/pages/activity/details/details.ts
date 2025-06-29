import { AttendeeMoveSectionAsync, CancelJoinActivityAsync, JoinActivityAsync, LoadActivityByIdAsync } from '@API/activityService';
import { CallCloudFuncAsync } from '@API/commonHelper';
import { GetUserByUnionId } from '@API/userService';
import { GetAttendTitle, GetLaguageMap } from '@Language/languageUtils';
import { UserRole } from '@Lib/types';
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync } from '@Lib/utils';

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList,
    // Status:
    isLoaded: false,
    myMemberId: 0,
    myProfile: {},
    // Variables
    activityId: '',
    activity: { wxActivityExpirationTime: 0, startTime: '' },
    attendTitle: '',
    // allSections: [],
    allJoinedOnWaitAttendees: [],
    allCancelledAttendees: [],
    joinMore: 0,
    // Dialog
    showLowCreditBalance: false,
    showCancelDialog: false,
    // Security
    isAdmin: false,
  },

  // onShareAppMessage: async function () {
  //   const activity = this.data.activity;
  //   const attendeeCount = this.data.allJoinedAttendees.length;
  //   const attendeeMax = activity.maxAttendee;

  //   const result = await CallCloudFuncAsync('activity_share', { activityId: activity._id, router: 'createActivityId' });
  //   const wxActivityId = result.wxActivityId;

  //   wx.updateShareMenu({
  //     withShareTicket: true,
  //     isUpdatableMessage: true,
  //     activityId: wxActivityId,
  //     templateInfo: {
  //       templateId: "",
  //       parameterList: [{
  //         name: 'member_count',
  //         value: `${attendeeCount}`
  //       }, {
  //         name: 'room_limit',
  //         value: `${attendeeMax}`
  //       }]
  //     }
  //   });

  //   return {
  //     title: `${activity.date}, ${activity.title}, ${this.data._lang.shareMessage}`,
  //     imageUrl: `${activity.coverImageSrc}`
  //   };
  // },

  async onLoad(options: Record<string, string | undefined>) {
    const id = options.id;
    this.setData({
      _lang: GetLaguageMap().activityDetail,
      activityId: id
    });

    await ExcuteWithLoadingAsync(async () => {
      const user = await this.LoadMe();
      if ((user?.creditBalance ?? 0) < 0) {
        this.setData({ showLowCreditBalance: true });
      }

      await this.loadActivity();
      if (this.data.activity) {
        const currentTimestamp = Date.parse(new Date().toString()) / 1000;
        if (this.data.activity.wxActivityExpirationTime > currentTimestamp) {
          await CallCloudFuncAsync('activity_share', { activityId: id, router: 'setUpdatableMsg' });
        }
      }
    })
  },

  //#region private method
  async LoadMe() {
    const user = await GetUserByUnionId();
    if (user) {
      this.setData({
        myMemberId: user.memberId,
        myProfile: user,
        isAdmin: user.userRole === UserRole.Admin.value
      });
    }
    return user;
  },

  async loadActivity() {
    const id = this.data.activityId;
    if (id.length > 0) {
      const activity = await LoadActivityByIdAsync(id);

      const allAttendees = activity.Attendees.sort((a: { updateDate: any; }, b: { updateDate: any; }) => new Date(a.updateDate) > new Date(b.updateDate) ? 1 : -1);

      const allJoinedAttendees = allAttendees.filter((a: any) => a.isCancelled === false);
      const allCancelledAttendees = allAttendees.filter((a: { isCancelled: boolean; }) => a.isCancelled === true);
      const allJoinedOnWaitAttendees = allJoinedAttendees.slice(activity.maxAttendee, allJoinedAttendees.length);

      const joinMore = allJoinedAttendees.filter((a: { memberId: null; }) => a.memberId === this.data.myMemberId).length - 1;

      var enrolledAttendees = allJoinedAttendees.slice(0, activity.maxAttendee);
      const allSections = [];
      if (activity.sections) {
        activity.sections.forEach((v: any, i: any) => {
          allSections.push({
            index: i,
            title: v,
            attendees: enrolledAttendees.filter((a: { sectionIndex: any; }) => (a.sectionIndex ?? 0) === i)
          });
        });
      } else {
        allSections.push({
          index: 0,
          title: '',
          attendees: enrolledAttendees
        });
      }

      const attendTitle = GetAttendTitle(allJoinedAttendees.length, activity.maxAttendee);
      this.setData({
        attendTitle,
        activity,
        allSections,
        allJoinedOnWaitAttendees,
        allCancelledAttendees,
        joinMore,
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
      wx.navigateTo({
        url: '/pages/user/profile/profile',
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
    const attendeeOnWaitCount = this.data.allJoinedOnWaitAttendees.length;
    if (durationInHours < 24 && attendeeOnWaitCount < 1) {
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