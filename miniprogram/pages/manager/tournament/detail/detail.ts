import { GetNewActivity, LoadActivityAndMatchesByIdAsync, RemoveAttendeeCourtAsync, UpdateAttendeeCaptainAsync, UpdateAttendeeCourtAsync, UpdateCurrentPowerOfBattleAsync } from "@API/activityService";
import { AddMatchAsync, GenerateMatch, GetMatchRankAsync, GetMatchResult, GetTournamentResult, RemoveMatchAsync, UpdateMatchAsync } from "@API/matchService";
import { SearchUsersByKeyAsync } from "@API/userService";
import { getCurrentWeekSpan, SortDate } from "@Lib/dateExtension";
import { ActivityTypeArray, ActivityTypeMap, ConverPageArray, UserGenderArray } from "@Lib/types";
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetNavBarHeight } from "@Lib/utils";
import { ActivityModel } from "@Model/Activity";
import { IOption } from "@Model/index";
import { MatchModel } from "@Model/Match";

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
    this.GenerateMatchResults();
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

  //#region group and match page private method
  async GetAttendeesInSection(section: any) {
    const attendeesInSection = this.data.activity.Attendees.filter((attendee: any) => attendee.sectionIndex === section.index && attendee.isCancelled === false);

    const captainMemberIds = attendeesInSection
      .filter((a: any) => a.captainMemberId)
      .map((a: any) => a.captainMemberId);

    const teams = [];
    for (const captainMemberId of captainMemberIds) {
      const captain = attendeesInSection
        .find((a: any) => a.memberId === captainMemberId);
      const members = attendeesInSection
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
    teams.sort((a: any, b: any) => b.totalPowerPoint - a.totalPowerPoint);

    const joinedTeams = teams.slice(0, section.maxAttendee / 2)
    console.log(joinedTeams);

    const joinedAttendeesInSection: any[] = [];
    for (const team of joinedTeams) {
      joinedAttendeesInSection.push(...team.players)
    }

    joinedAttendeesInSection.forEach((att: any) => {
      att.currentPowerOfBattle = 1;
    });

    return joinedAttendeesInSection;
  },

  async GroupForSection(e: IOption) {
    const { section } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      const joinedAttendeesInSection = await this.GetAttendeesInSection(section);
      const promiseList = [] as any[];
      section.courts.forEach((court: number, index: number) => {
        const start = index * 8;
        const end = start + 8;
        joinedAttendeesInSection.slice(start, end).forEach((attendee: any) => {
          const promise = UpdateAttendeeCourtAsync(activityId, attendee.memberId, attendee.joinMore, attendee.currentPowerOfBattle, court);
          promiseList.push(promise);
        });
      });

      await Promise.all(promiseList);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async DegroupForSection() {
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      await RemoveAttendeeCourtAsync(activityId);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async CreateMatchesForCourt(e: IOption) {
    const { court } = e.currentTarget.dataset;
    const activityId = this.data.activityId;
    const promiseList = [] as any[];
    const attendees = this.data.courtAttendeesMap[court];
    if (attendees.length === 8) {
      const match1 = GenerateMatch(activityId, attendees, court, 0, 1, 2, 3, 1);
      const match2 = GenerateMatch(activityId, attendees, court, 0, 1, 4, 5, 2);
      const match3 = GenerateMatch(activityId, attendees, court, 6, 7, 4, 5, 3);
      const match4 = GenerateMatch(activityId, attendees, court, 6, 7, 0, 1, 4);
      const match5 = GenerateMatch(activityId, attendees, court, 2, 3, 4, 5, 5);
      const match6 = GenerateMatch(activityId, attendees, court, 2, 3, 6, 7, 6);
      const matches = [match1, match2, match3, match4, match5, match6];

      matches.forEach((match: any) => {
        const promise = AddMatchAsync(new MatchModel(match));
        promiseList.push(promise);
      });
    }

    await ExcuteWithProcessingAsync(async () => {
      await Promise.all(promiseList);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async RemoveMatchesForCourt(e: IOption) {
    const { court } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      await RemoveMatchAsync(activityId, court);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async MoveInsideSection(e: IOption) {
    const { court, attendee } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      await UpdateAttendeeCourtAsync(activityId, attendee.memberId, attendee.joinMore, attendee.currentPowerOfBattle, court);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async ChangeCurrentPowerOfBattle(e: IOption) {
    const newValue = Number(e.detail.value);
    const { attendee } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      await UpdateCurrentPowerOfBattleAsync(activityId, attendee.memberId, attendee.joinMore, newValue);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async FocusLeftScore(e: IOption) {
    const newValue = Number(e.detail.value);
    if (newValue === 0) {
      const { match } = e.currentTarget.dataset;
      const courtMatchesMap = this.data.courtMatchesMap;
      courtMatchesMap[match.court].forEach((m: any) => {
        if (m.index === match.index) {
          m.leftScore = null;
        }
      });
      this.setData({ courtMatchesMap: courtMatchesMap });
    }
  },

  async ChangeLeftScore(e: IOption) {
    const newValue = Number(e.detail.value);
    const { match } = e.currentTarget.dataset;
    const courtMatchesMap = this.data.courtMatchesMap;
    courtMatchesMap[match.court].forEach((m: any) => {
      if (m.index === match.index) {
        m.leftScore = newValue;
      }
    });
    this.setData({ courtMatchesMap: courtMatchesMap });
  },

  async FocusRightScore(e: IOption) {
    const newValue = Number(e.detail.value);
    if (newValue === 0) {
      const { match } = e.currentTarget.dataset;
      const courtMatchesMap = this.data.courtMatchesMap;
      courtMatchesMap[match.court].forEach((m: any) => {
        if (m.index === match.index) {
          m.rightScore = null;
        }
      });
      this.setData({ courtMatchesMap: courtMatchesMap });
    }
  },

  async ChangeRightScore(e: IOption) {
    const newValue = Number(e.detail.value);
    const { match } = e.currentTarget.dataset;
    const courtMatchesMap = this.data.courtMatchesMap;
    courtMatchesMap[match.court].forEach((m: any) => {
      if (m.index === match.index) {
        m.rightScore = newValue;
      }
    });
    this.setData({ courtMatchesMap: courtMatchesMap });
  },

  async SaveScoreByCourt(e: IOption) {
    const { court } = e.currentTarget.dataset;
    const matches = this.data.courtMatchesMap[court];
    const activityId = this.data.activityId;

    const promiseList = [] as any[];
    for (const match of matches) {
      const promise = UpdateMatchAsync(activityId, match.court, match.index, match.leftScore, match.rightScore);
      promiseList.push(promise);
    }

    await ExcuteWithProcessingAsync(async () => {
      await Promise.all(promiseList);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  GenerateMatchResults() {
    // match result
    const matchResultMap = {} as any;
    for (const court in this.data.courtMatchesMap) {
      const matches = this.data.courtMatchesMap[court];
      const attendees = this.data.courtAttendeesMap[court];
      matchResultMap[court] = GetTournamentResult(matches, attendees, this.data.activityId, Number(court));
    }
    this.setData({ matchResultMap });
  },

  SeeMatchResults() {
    this.GenerateMatchResults();
    this.setData({ selectedTab: 1 });
  }
  //#endregion
})