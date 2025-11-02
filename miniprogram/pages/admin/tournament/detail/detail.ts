import { GetNewActivity, LoadActivityAndMatchesByIdAsync, UpdateAttendeeCaptainAsync } from "@API/activityService";
import { SearchUsersByKeyAsync } from "@API/userService";
import { ActivityTypeArray, ActivityTypeMap, ConverPageArray, UserGenderArray } from "@Lib/types";
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetNavBarHeight } from "@Lib/utils";
import { ActivityModel } from "@Model/Activity";
import { IOption } from "@Model/index";

let allActiveAttendees: any[] = [];

Page({
  data: {
    // Static
    navBarHeight: GetNavBarHeight() + 10,
    genderArray: UserGenderArray,
    // Tab
    selectedTab: 0,
    // Info Page
    activityId: null as unknown as string,
    formData: null as unknown as ActivityModel,
    activity: null as unknown as any,
    courtAttendeesMap: {} as any,
    courtMatchesMap: {} as any,
    matchResultMap: null as unknown as any,
    typeArray: ActivityTypeArray,
    typeMap: ActivityTypeMap,
    courtArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    converPageArray: ConverPageArray,
    // Attendees page
    groupedAttendees: [] as any[],
    // Dialog
    showAttendeeDialog: false,
    selectedAttendee: null as unknown as any,
    matchedUsersByAttendeeName: [] as any[]
  },

  async onLoad(options: Record<string, string | undefined>) {
    const activityId = options.id;
    if (activityId) {
      await ExcuteWithLoadingAsync(async () => {
        await this.ReloadActivityByIdAsync(activityId);
      });
    } else {
      const activity = GetNewActivity();
      const formData = new ActivityModel(activity);
      this.setData({
        formData: formData,
        activity: activity
      });
    }
  },

  async ReloadActivityByIdAsync(activityId: string) {
    const { activity, courtMatchesMap, matchResultMap } = await LoadActivityAndMatchesByIdAsync(activityId, false, false);
    const formData = new ActivityModel(activity);

    const courtAttendeesMap: any = {};
    formData.courts.forEach(court => {
      courtAttendeesMap[court] = activity.Attendees
        .filter((a: any) => a.court === court)
        .sort((a: any, b: any) => b.currentPowerOfBattle - a.currentPowerOfBattle);
    });

    this.setData({
      activityId: activityId,
      formData: formData,
      activity: activity,
      courtAttendeesMap,
      courtMatchesMap,
      matchResultMap
    });

    allActiveAttendees = [...activity.Attendees];
    this.generateGroupAttendees();
  },

  generateGroupAttendees() {
    const groupedAttendees: any = [];
    const activeAttendeesGroup = allActiveAttendees
      .filter(a => !a.captainName)
      .reduce((acc: any, currentValue: any) => {
        let groupKey = currentValue['memberId'];
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(currentValue);
        return acc;
      }, {});

    Object.values(activeAttendeesGroup).forEach((atts: any) => {
      const mainAttendee = atts.find((a: any) => a.joinMore === 0);
      const teamMemberAttendees = allActiveAttendees
        .filter((a: any) => a.captainMemberId === mainAttendee.memberId);
      const allTeamMember = teamMemberAttendees.concat(atts);
      console.log(teamMemberAttendees);
      console.log(allTeamMember);
      const aggregateAttendee = {
        avatarUrl: mainAttendee.avatarUrl,
        continueWeeklyJoin: mainAttendee.continueWeeklyJoin,
        creditBalance: mainAttendee.creditBalance,
        discount: mainAttendee.discount,
        displayName: mainAttendee.displayName,
        gender: mainAttendee.gender,
        memberId: mainAttendee.memberId,
        captainName: mainAttendee.captainName,
        captainMemberId: mainAttendee.captainMemberId,
        attendeeList: allTeamMember.map((a: any) => {
          return {
            attendeeId: a.attendeeId,
            avatarUrl: a.avatarUrl,
            joinMore: a.joinMore,
            sectionIndex: a.sectionIndex,
            displayName: a.displayName,
            gender: a.gender,
            attendeeName: a.attendeeName,
            attendeeGender: a.attendeeGender,
            attendeeMemberId: a.attendeeMemberId,
            captainName: a.captainName,
            captainMemberId: a.captainMemberId,
          }
        })
      };

      groupedAttendees.push(aggregateAttendee);
    });

    this.setData({
      groupedAttendees: groupedAttendees
    });
  },

  //#region top tap
  onTapTab(e: any) {
    this.setData({
      selectedTab: Number(e.currentTarget.dataset.index),
    })
  },

  onChange(e: any) {
    this.setData({
      selectedTab: Number(e.detail.current),
    })
  },
  //#endregion

  //#region attendee page private method
  goToUserDetails(e: IOption) {
    const { memberId } = e.currentTarget.dataset['user'];
    wx.navigateTo({
      url: '/pages/admin/userDetail/userDetail?memberId=' + memberId,
    });
  },

  showSelectedAttendee(e: IOption) {
    const { user, attendee } = e.currentTarget.dataset;
    const selectedAttendee = {
      attendeeId: attendee.attendeeId,
      attendeeJoinMore: attendee.joinMore,
      accountName: user.displayName,
      accountMemberId: user.memberId,
      attendeeName: attendee.attendeeName,
      attendeeGender: attendee.attendeeGender,
      attendeeMemberId: attendee.attendeeMemberId,
      captainName: attendee.captainName,
      captainMemberId: attendee.captainMemberId,
    };
    this.setData({
      showAttendeeDialog: true,
      selectedAttendee: selectedAttendee
    })
  },

  changeSelectedCaptainName(e: IOption) {
    this.setData({ [`selectedAttendee.captainName`]: e.detail.value });
  },

  clearCaptainMemberId() {
    this.setData({ [`selectedAttendee.captainMemberId`]: null });
  },

  async onSearchAttendeeName() {
    await ExcuteWithProcessingAsync(async () => {
      const searchText = this.data.selectedAttendee.captainName;
      const users = await SearchUsersByKeyAsync(searchText, 4);
      this.setData({ matchedUsersByAttendeeName: users });
    }, false);
  },

  onCancelAttendeeNameSearch() {
    this.setData({ matchedUsersByAttendeeName: [] });
  },

  onSearchAttendeeSelected(e: IOption) {
    const { user } = e.currentTarget.dataset;
    if (!user) return;

    this.setData({
      [`selectedAttendee.captainMemberId`]: user.memberId,
      [`selectedAttendee.captainName`]: user.displayName,
      matchedUsersByAttendeeName: []
    });
  },

  async updateSelectedAttendee() {
    const activityId = this.data.activityId;
    await ExcuteWithProcessingAsync(async () => {
      const selectedAttendee = this.data.selectedAttendee;
      await UpdateAttendeeCaptainAsync(
        selectedAttendee.attendeeId,
        selectedAttendee.captainName,
        selectedAttendee.captainMemberId);
      await this.ReloadActivityByIdAsync(activityId);
      this.setData({ showAttendeeDialog: false });
    }, false);
  },

  //#endregion
})