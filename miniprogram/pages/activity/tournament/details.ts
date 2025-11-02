import {
  AttendeeMoveSectionAsync,
  CancelJoinActivityAsync,
  JoinActivityAsync,
  LoadActivityAndMatchesByIdAsync
} from '@API/activityService';
import { CallCloudFuncAsync } from '@API/commonHelper';
import { CheckUserExistsAsync } from '@API/userService';
import { GetAttendTitle, GetLaguageMap } from '@Language/languageUtils';
import { WxShowModalAsync } from '@Lib/promisify';
import { UserRole } from '@Lib/types';
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetCurrentUrl, NavigateBack } from '@Lib/utils';
import { iSection, iUser } from '@Model/index';

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityDetail,
    // Tab
    selectedTab: 0,
    swiperHeight: 0,
    // Status:
    isLoaded: false,
    isLoading: false,
    myProfile: null as unknown as iUser,
    // Variables
    activityId: '',
    activity: null as any,
    attendTitle: '',
    allSections: [] as any[],
    allJoinedAttendeesCount: 0,
    allCancelledAttendees: [] as any[],
    joinMore: -1,
    courtMatchesMap: {} as any,
    isCourtMatchesMapEmpty: true,
    matchResultMap: {} as any,
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
      title: `${activity.date}, ${activity.title}, ${this.data._lang.shareMessage}`,
      imageUrl: `${activity.coverImageSrc}`,
      promise
    };
  },

  async onLoad(options: Record<string, string | undefined>) {
    const id = options.id;
    this.setData({
      activityId: id
    });
    await this.ReloadAll()
    // await this.UpdateSharedMessage();
  },

  async ReloadAll() {
    try {
      this.setData({ isLoading: true });
      const fetchData = async () => {
        await this.LoadMe();
        await this.LoadActivityAndMatches(true);
        this.setData({ isLoaded: true, isLoading: false });
      };
      await ExcuteWithLoadingAsync(fetchData);
      this.updateSwiperHeight(0);
    } finally {
      this.setData({ isLoading: false });
    }
  },

  //#region private method
  // LoadMe first of all
  async LoadMe() {
    const { userProfile: myProfile } = await CheckUserExistsAsync();
    if (myProfile) {
      this.setData({
        myProfile: myProfile,
        isAdmin: myProfile.userRole === UserRole.Admin.value,
        showLowCreditBalance: myProfile.creditBalance < 0
      });
    }
  },

  // Run after LoadMe fired
  async LoadActivityAndMatches(recordEvent: boolean) {
    const id = this.data.activityId;
    if (id.length > 0) {
      const { activity, courtMatchesMap, matchResultMap } = await LoadActivityAndMatchesByIdAsync(id, true, recordEvent);
      const allJoinedAttendees = activity.Attendees.filter((a: any) => a.isCancelled === false);
      const allCancelledAttendees = activity.Attendees.filter((a: any) => a.isCancelled === true);

      const captainMemberIds = allJoinedAttendees
        .filter((a: any) => a.captainMemberId)
        .map((a: any) => a.captainMemberId);
      console.log(captainMemberIds);

      const teams = [];
      for (const captainMemberId of captainMemberIds) {
        const captain = allJoinedAttendees
          .find((a: any) => a.memberId === captainMemberId);
        const members = allJoinedAttendees
          .filter((a: any) => a.captainMemberId === captainMemberId);
        const players = [captain].concat(members);

        const totalPowerPoint = players.reduce((accumulator, current) => {
          const powerPoint = (current.joinMore > 0 && !current.attendeeMemberId) ? 0 : (current.powerPoint ?? 0);
          return accumulator + powerPoint;
        }, 0);

        teams.push({
          captain: captain,
          players: players,
          totalPowerPoint: totalPowerPoint
        });
      }
      teams.sort((a: any, b: any) => b.totalPowerPoint - a.totalPowerPoint)

      const maxAttendeeGroup = activity.sections[0].maxAttendee / 2;
      const joinedTeams = teams.slice(0, maxAttendeeGroup - 1);
      const waitingTeams = teams.slice(maxAttendeeGroup - 1);

      const soloMembers = allJoinedAttendees
        .filter((a: any) => !captainMemberIds.includes(a.captainMemberId) && !captainMemberIds.includes(a.memberId));

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
        joinedTeams,
        waitingTeams,
        soloMembers,
        allJoinedAttendeesCount: allJoinedAttendees.length,
        allCancelledAttendees,
        courtMatchesMap,
        isCourtMatchesMapEmpty: Object.keys(courtMatchesMap).length === 0,
        matchResultMap,
        isMatchResultMapEmpty: Object.keys(matchResultMap).length === 0,
      });
    }
  },

  async UpdateSharedMessage() {
    await CallCloudFuncAsync('eabc_activity_share', { activityId: this.data.activityId, router: 'setUpdatableMsg' });
  },

  //#region top tap
  onTapTab(e: any) {
    const current = Number(e.currentTarget.dataset.index);
    this.updateSwiperHeight(current);
  },

  onSwiperChange(e: any) {
    const current = e.detail.current;
    this.updateSwiperHeight(current);
  },

  updateSwiperHeight(index: number) {
    this.setData({ selectedTab: index });
    const id = `#slide${index}`;
    const query = wx.createSelectorQuery();
    query.select(id).boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        const swiperHeight = res[0].height;
        this.setData({ swiperHeight });
      }
    });
  },
  //#endregion

  navigateBack() {
    NavigateBack();
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
        await this.LoadActivityAndMatches(false);
        await this.UpdateSharedMessage();
      };
      await ExcuteWithProcessingAsync(joinActivityAndReload);
    } else {
      const currentUrl = GetCurrentUrl();
      const callbackParameterKey = 'id'
      const callbackParameterValue = this.data.activityId;
      wx.navigateTo({
        url: `/pages/user/profile/profile?callbackUrl=${currentUrl}&callbackParameterKey=${callbackParameterKey}&callbackParameterValue=${callbackParameterValue}`,
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
      const { confirm } = await WxShowModalAsync({
        title: '取消提示',
        content: ``,
        cancelText: '再想想',
        confirmText: '难过取消'
      });
      if (confirm !== true) {
        return;
      }
    }

    const cancelActivityAndReload = async () => {
      await CancelJoinActivityAsync(this.data.activityId, myMemberId, join_more);
      await this.LoadActivityAndMatches(false);
      await this.UpdateSharedMessage();
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
      await this.LoadActivityAndMatches(false);
    };
    await ExcuteWithProcessingAsync(moveActivityAndReload);
  }
  //#endregion
})