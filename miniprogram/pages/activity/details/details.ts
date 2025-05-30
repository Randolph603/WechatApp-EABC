import { CallCloudFuncAsync, UpdateRecordAsync } from '@API/commonHelper';
import { GetLaguageMap } from '@Language/languageUtils';
import { UserRole, LevelArray } from '@Lib/types';
import { ParseISOString } from '@Lib/utils';
// import util from '@Lib/util';
// import utilWX from '@Lib/promiseUtil';

// import userApi from '@API/userService';
// import cloudUtil from '@API/cloudFunc';

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList,
    myMemberId: null,
    myProfile: {},
    activityId: '',
    activity: { _id: null },
    attendTitle: '',
    allSections: [],
    allJoinedAttendees: [],
    allCancelledAttendees: [],
    joinMore: 0,
    showLowCreditBalance: false,
    showCancelDialog: false,
    canManageAll: false,
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

  onLoad: async function (options: Record<string, string | undefined>) {
    const id = options.id;
    this.setData({
      _lang: GetLaguageMap().activityDetail,
      activityId: id
    });

    // const { user } = await userApi.userCheckExistsAsync();
    // if (user) {
    //   if (user.creditBalance < 0) {
    //     this.setData({ showLowCreditBalance: true });
    //   }

    //   this.setData({
    //     myMemberId: user.memberId,
    //     myProfile: user,
    //     canManageAll: user.userRole === UserRole.Admin.value
    //   });
    // }
    await this.loadActivity();
  },

  async loadActivity() {
    const id = this.data.activityId;
    if (id.length > 0) {
      const { activity, organizer } = await CallCloudFuncAsync('activity_getById', { activityId: id, includeCancelledAttendees: true });

      const currentTimestamp = Date.parse(new Date().toString()) / 1000;
      if (activity.wxActivityExpirationTime > currentTimestamp) {
        await CallCloudFuncAsync('activity_share', { activityId: id, router: 'setUpdatableMsg' });
      }

      // activity.date = util.formatShortDate(activity.startTime);
      // activity.time = util.formatShortTimeRange(activity.startTime, activity.during);

      activity.Attendees.forEach((user: any) => {
        user.userLevelName = LevelArray[user.userLevel].displayName;
        user.userLevelImageSrc = `/images/rank/${user.userLevel}.png`;
      });

      const allAttendees = activity.Attendees.sort((a: { updateDate: any; }, b: { updateDate: any; }) =>
        ParseISOString(a.updateDate) - ParseISOString(b.updateDate));

      const allJoinedAttendees = allAttendees.filter((a: any) => a.isCancelled === false);
      const allCancelledAttendees = allAttendees.filter((a: { isCancelled: boolean; }) => a.isCancelled === true);

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

      // const attendTitle = GetLaguageLib().attendTitle(allJoinedAttendees.length, activity.maxAttendee);
      this.setData({
        // attendTitle, 
        activity, organizer,
        // allSections, 
        allJoinedAttendees, allCancelledAttendees, joinMore
      });
    }
  },

  navigateBack: function () {
    wx.navigateBack({
      delta: 0,
    })
  },

  navigateHome: function () {
    wx.switchTab({
      url: '/pages/front/activityList/activityList',
    })
  },

  navigateMe: function () {
    wx.switchTab({
      url: '/pages/front/me/me',
    })
  },

  async joinAsync() {
    wx.showLoading({ title: 'Processing...', mask: true });
    const { user: meInDb } = await CallCloudFuncAsync('user_checkExists', {});
    if (!meInDb) {
      wx.navigateTo({
        url: '/pages/front/userProfile/userProfile',
      });
      return;
    };

    try {
      const db = wx.cloud.database();
      const existResponse = await db.collection('Attendees')
        .where({
          activityId: this.data.activity._id,
          memberId: meInDb.memberId,
          joinMore: 0
        })
        .get();
      if (existResponse.data.length > 0) {
        await UpdateRecordAsync('Attendees',
          { activityId: this.data.activity._id, memberId: meInDb.memberId, joinMore: 0 },
          { isCancelled: false },
          { updateDate: JSON.stringify(new Date()) }
        );
      } else {
        await db.collection('Attendees').add({
          data: {
            activityId: this.data.activity._id,
            memberId: meInDb.memberId,
            isCancelled: false,
            createDate: new Date(),
            updateDate: new Date(),
            joinMore: 0,
            sectionIndex: 0
          }
        });
      }

      await this.loadActivity();
      wx.showToast({ title: '操作成功', icon: 'success' });
    } catch (error) {
      console.log(error);
      wx.showToast({ title: '操作失败', icon: 'none' });
    }

    wx.hideLoading();
  },

  async cancelAsync() {
    // wx.showLoading({ title: 'Processing...', mask: true });

    // // 36e5 is the scientific notation for 60*60*1000
    // const durationInHours = (new Date(this.data.activity.startTime) - new Date()) / 36e5;
    // const attendeeCount = this.data.allJoinedAttendees.length;
    // if (durationInHours < 24 && attendeeCount < this.data.activity.maxAttendee) {
    //   this.setData({ showCancelDialog: true });
    //   wx.hideLoading();
    //   return;
    // }

    // if (this.data.myProfile.continueWeeklyJoin && this.data.myProfile.continueWeeklyJoin > 0) {
    //   wx.hideLoading();
    //   const continueWeeklyJoin = this.data.myProfile.continueWeeklyJoin;
    //   const activityPrice = this.data.activity.price;
    //   const priceWithDisc = activityPrice - (continueWeeklyJoin > 3 ? 3 : continueWeeklyJoin);
    //   const { cancel } = await utilWX.showModalPromisified({
    //     title: '取消提示',
    //     content: `您已经连续参加活动${continueWeeklyJoin}周次了，这次活动只需要${priceWithDisc} NZD，中断后下次活动将恢复至${activityPrice} NZD`,
    //     cancelText: '继续活动',
    //     confirmText: '仍然取消'
    //   });
    //   if (cancel) {
    //     return;
    //   } else {
    //     wx.showLoading({ title: 'Processing...', mask: true });
    //   }
    // }

    // try {
    //   await cloudUtil.updateRecordAsync('Attendees',
    //     { activityId: this.data.activity._id, memberId: this.data.myMemberId },
    //     { isCancelled: true },
    //     { updateDate: JSON.stringify(new Date()) }
    //   );
    //   await this.loadActivity();
    //   wx.showToast({ title: '操作成功', icon: 'success' });
    // } catch (error) {
    //   console.log(error);
    //   wx.showToast({ title: '操作失败', icon: 'none' });
    // }

    // wx.hideLoading();
  },

  async joinMoreAsync() {
    // wx.showLoading({ title: 'Processing...', mask: true });

    // const joinMore = this.data.joinMore + 1;
    // try {
    //   const db = wx.cloud.database();
    //   const existResponse = await db.collection('Attendees')
    //     .where({
    //       activityId: this.data.activity._id,
    //       memberId: this.data.myMemberId,
    //       joinMore,
    //     })
    //     .get();
    //   if (existResponse.data.length > 0) {
    //     await cloudUtil.updateRecordAsync('Attendees',
    //       { activityId: this.data.activity._id, memberId: this.data.myMemberId, joinMore },
    //       { isCancelled: false },
    //       { updateDate: JSON.stringify(new Date()) }
    //     );
    //   } else {
    //     const db = wx.cloud.database();
    //     await db.collection('Attendees').add({
    //       data: {
    //         activityId: this.data.activity._id,
    //         memberId: this.data.myMemberId,
    //         isCancelled: false,
    //         createDate: new Date(),
    //         updateDate: new Date(),
    //         joinMore,
    //         sectionIndex: 0
    //       }
    //     });
    //   }

    //   await this.loadActivity();
    //   wx.showToast({ title: '操作成功', icon: 'success' });
    // } catch (error) {
    //   console.log(error);
    //   wx.showToast({ title: '操作失败', icon: 'none' });
    // }

    // wx.hideLoading();
  },

  async joinMinusOneAsync() {
    // wx.showLoading({ title: 'Processing...', mask: true });

    // try {
    //   await cloudUtil.updateRecordAsync('Attendees',
    //     { activityId: this.data.activity._id, memberId: this.data.myMemberId, joinMore: this.data.joinMore },
    //     { isCancelled: true },
    //     { updateDate: JSON.stringify(new Date()) }
    //   );
    //   await this.loadActivity();
    //   wx.showToast({ title: '操作成功', icon: 'success' });
    // } catch (error) {
    //   console.log(error);
    //   wx.showToast({ title: '操作失败', icon: 'none' });
    // }

    // wx.hideLoading();
  },

  async moveAsync(event: any) {
    // const { sectionindex, joinmore, memberid } = event.currentTarget.dataset;
    // try {
    //   await cloudUtil.updateRecordAsync(
    //     'Attendees',
    //     { activityId: this.data.activity._id, memberId: memberid, joinMore: joinmore },
    //     { sectionIndex: sectionindex }
    //   );
    //   await this.loadActivity();
    //   wx.showToast({ title: '操作成功', icon: 'success' });
    // } catch (error) {
    //   console.log(error);
    //   wx.showToast({ title: '操作失败', icon: 'none' });
    // }
  },

})