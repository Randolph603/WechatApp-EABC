import { AddActivityAsync, AutoJoinActivityAsync, CancelJoinActivityAsync, ConfrimActivityAsync, GetNewActivity, JoinActivityAsync, LoadActivityAndMatchesByIdAsync, LoadAllActivitiesAsync, RemoveAttendeeCourtAsync, UpdateAttendeeCourtAsync, UpdateAttendeeMoreAsync, UpdateCurrentPowerOfBattleAsync } from "@API/activityService";
import { UpdateRecordAsync } from "@API/commonHelper";
import { AddMatchAsync, AddMatchResultsAsync, GenerateMatch, GetAllResultsAsync, GetMatchResult, RemoveMatchAsync, UpdateMatchAsync } from "@API/matchService";
import { SearchUsersByKeyAsync, SearchUsersSortByContinuelyWeeksAsync } from "@API/userService";
import { SortDate, ToNZDateString, ToNZTimeRangeString } from "@Lib/dateExtension";
import { ActivityTypeArray, ActivityTypeMap, ConverPageArray, UserGenderArray } from "@Lib/types";
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetNavBarHeight } from "@Lib/utils";
import { ActivityModel } from "@Model/Activity";
import { IOption, iSection } from "@Model/index";
import { MatchModel } from "@Model/Match";

const rules = [
  { name: 'title', rules: { required: true, message: '请输入名称' } },
  { name: 'organizerMemberId', rules: { required: true } },
  { name: 'type', rules: { required: true } },
  { name: 'address', rules: { required: true } },
  { name: 'courts', rules: { required: true, message: '请输入场地' } },
  { name: 'maxAttendee', rules: { required: true } },
  { name: 'coverImage', rules: { required: true } },
  { name: 'startTime', rules: { required: true, message: '请输入日期和时间' } },
  { name: 'sections', rules: { required: true, minlength: 1, message: 'Section不能为空' }, },
  { name: 'isCancelled', rules: { required: true } },
  { name: 'isCompleted', rules: { required: true } },
  { name: 'calculatePowerPoint', rules: { required: true } },
  { name: 'toPublic', rules: { required: true } },
  { name: 'updateDate', rules: { required: false } },
  { name: 'viewCount', rules: { required: false } },
  { name: 'shareCount', rules: { required: false } },
];

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
    rules: rules,
    // Attendees page
    searchTerm: '',
    matchedUsers: [] as any[],
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
      const aggregateAttendee = {
        avatarUrl: mainAttendee.avatarUrl,
        continueWeeklyJoin: mainAttendee.continueWeeklyJoin,
        creditBalance: mainAttendee.creditBalance,
        discount: mainAttendee.discount,
        displayName: mainAttendee.displayName,
        gender: mainAttendee.gender,
        memberId: mainAttendee.memberId,
        attendeeList: atts.map((a: any) => {
          return {
            attendeeId: a.attendeeId,
            joinMore: a.joinMore,
            sectionIndex: a.sectionIndex,
            attendeeName: a.attendeeName,
            attendeeGender: a.attendeeGender,
            attendeeMemberId: a.attendeeMemberId
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

  //#region information page private method
  formTextChange(e: IOption) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  typePickerChange(e: IOption) {
    const typeArrayIndex = Number(e.detail.value);
    const selectedType = this.data.typeArray[typeArrayIndex];
    this.setData({
      [`formData.type`]: selectedType.value
    });
  },

  courtCheckboxChange(e: IOption) {
    const newCourts = e.detail.value.map((str: any) => Number(str)).sort((a: number, b: number) => (a - b));
    this.setData({
      [`formData.courts`]: newCourts
    });
  },

  formDateChange(e: IOption) {
    const newDate = new Date(e.detail.value);
    const existingDate = this.data.formData.startTime;
    existingDate.setFullYear(newDate.getFullYear());
    existingDate.setMonth(newDate.getMonth());
    existingDate.setDate(newDate.getDate());
    this.setData({
      [`activity.startTimeDate`]: e.detail.value,
      ['formData.startTime']: existingDate
    });
  },

  coverImageRadioChange(e: IOption) {
    const coverIndex = Number(e.detail.value);
    const coverImage = ConverPageArray[coverIndex];
    this.setData({
      [`formData.coverImage`]: coverImage,
    });
  },

  addSection() {
    const existing = this.data.formData.sections;
    const addSection = { ...existing[0] };
    addSection.index = existing.length;
    existing.push(addSection);
    this.setData({
      [`formData.sections`]: existing,
      [`formData.maxAttendee`]: this.data.formData.sections.reduce((acc: number, element: iSection) => acc + element.maxAttendee, 0)
    });
  },

  removeSection() {
    const existing = this.data.formData.sections;
    if (existing.length > 1) {
      existing.pop();
      this.setData({
        [`formData.sections`]: existing,
        [`formData.maxAttendee`]: this.data.formData.sections.reduce((acc: number, element: iSection) => acc + element.maxAttendee, 0)
      });
    }
  },

  handleSectionChange(e: IOption) {
    const { id, field, is_number } = e.currentTarget.dataset;
    const newValue = is_number ? Number(e.detail.value) : e.detail.value;
    this.setData({
      [`formData.sections[${id}].${field}`]: newValue
    });

    if (['time', 'during'].includes(field)) {
      const existing = this.data.formData.sections[id];
      const timeArray = existing.time.split(':');

      const dateTime = new Date();
      dateTime.setHours(Number(timeArray[0]));
      dateTime.setMinutes(Number(timeArray[1]));
      dateTime.setSeconds(0);

      const existingStartTime = this.data.formData.startTime;
      existingStartTime.setHours(Number(timeArray[0]));
      existingStartTime.setMinutes(Number(timeArray[1]));
      existingStartTime.setSeconds(0);

      const timeRange = ToNZTimeRangeString(dateTime, existing.during);
      this.setData({
        ['formData.startTime']: existingStartTime,
        [`formData.sections[${id}].timeRange`]: timeRange
      });
    }

    if (field === 'maxAttendee') {
      this.setData({
        [`formData.maxAttendee`]: this.data.formData.sections.reduce((acc: number, element: iSection) => acc + element.maxAttendee, 0)
      });
    }
  },

  sectionCourtCheckboxChange(e: IOption) {
    const newCourts = e.detail.value.map((str: any) => Number(str)).sort((a: number, b: number) => (a - b));
    const { id } = e.currentTarget.dataset;
    this.setData({
      [`formData.sections[${id}].courts`]: newCourts
    });
  },

  async submitForm() {
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
        await ExcuteWithProcessingAsync(async () => {
          const activityToAdd = this.data.formData;
          if (this.data.activityId) {
            const { startTime, updateDate, ...activityToUpdate } = activityToAdd;
            const startTimeString = JSON.stringify(this.data.formData.startTime);
            const updateDateString = JSON.stringify(new Date());
            const updateDateData = { startTime: startTimeString, updateDate: updateDateString };

            await UpdateRecordAsync('Activities', { _id: this.data.activityId }, activityToUpdate, updateDateData)
          } else {
            // new a activity
            const { id } = await AddActivityAsync(activityToAdd);
            if (id) {
              this.setData({ activityId: id });
            }
          }
        });
      }
    });
  },
  //#endregion

  //#region attendee page private method
  onSearchInputChange(e: IOption) {
    this.setData({
      searchTerm: e.detail.value,
      matchedUsers: [],
    });
  },

  onSearchCancel() {
    this.setData({
      searchTerm: '',
      matchedUsers: [],
    });
  },

  async searchUser(e: IOption) {
    await ExcuteWithProcessingAsync(async () => {
      const searchText = e.detail.value;
      const users = await SearchUsersByKeyAsync(searchText, 10);

      this.setData({
        searchTerm: searchText,
        matchedUsers: users
      });
    }, false);
  },

  async addAttendeeAsync(e: IOption) {
    const { user } = e.currentTarget.dataset;
    if (!user) return;

    const more = user.attendeeList?.length ?? 0;
    const memberId = user.memberId;
    const activityId = this.data.activityId;
    if (activityId) {
      await ExcuteWithProcessingAsync(async () => {
        await JoinActivityAsync(activityId, memberId, more);
        await this.ReloadActivityByIdAsync(activityId);
      }, false);
    }
  },

  async removeAttendeeAsync(e: IOption) {
    const { user } = e.currentTarget.dataset;
    if (!user) return;

    const more = user.attendeeList.length - 1;
    const memberId = user.memberId;
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      if (more > 0) {
        await CancelJoinActivityAsync(activityId, memberId, more);
      } else {
        await CancelJoinActivityAsync(activityId, memberId, undefined);
      }

      await this.ReloadActivityByIdAsync(activityId);
    }, false);
  },

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
      attendeeMemberId: attendee.attendeeMemberId
    };
    this.setData({
      showAttendeeDialog: true,
      selectedAttendee: selectedAttendee
    })
  },

  changeSelectedAttendeeName(e: IOption) {
    this.setData({ [`selectedAttendee.attendeeName`]: e.detail.value });
  },

  clearAttendeeMemberId() {
    this.setData({ [`selectedAttendee.attendeeMemberId`]: null });
  },

  async onSearchAttendeeName() {
    await ExcuteWithProcessingAsync(async () => {
      const searchText = this.data.selectedAttendee.attendeeName;
      const users = await SearchUsersByKeyAsync(searchText, 4);
      this.setData({
        matchedUsersByAttendeeName: users
      });
    }, false);
  },

  onCancelAttendeeNameSearch() {
    this.setData({ matchedUsersByAttendeeName: [] });
  },

  onSearchAttendeeSelected(e: IOption) {
    const { user } = e.currentTarget.dataset;
    if (!user) return;

    this.setData({
      [`selectedAttendee.attendeeMemberId`]: user.memberId,
      [`selectedAttendee.attendeeName`]: user.displayName,
      [`selectedAttendee.attendeeGender`]: user.gender,
      matchedUsersByAttendeeName: []
    });
  },

  changeSelectedAttendeeGender(e: IOption) {
    const { value } = e.currentTarget.dataset;
    this.setData({ [`selectedAttendee.attendeeGender`]: value });
  },

  async updateSelectedAttendee() {
    const activityId = this.data.activityId;
    await ExcuteWithProcessingAsync(async () => {
      const selectedAttendee = this.data.selectedAttendee;
      await UpdateAttendeeMoreAsync(
        selectedAttendee.attendeeId,
        selectedAttendee.attendeeName,
        selectedAttendee.attendeeGender,
        selectedAttendee.attendeeMemberId);
      await this.ReloadActivityByIdAsync(activityId);
      this.setData({ showAttendeeDialog: false });
    }, false);
  },

  async autoAddAttendeesAsync() {
    await ExcuteWithProcessingAsync(async () => {
      const activity = this.data.activity;
      let sevenDaysAgo = new Date(activity.startTime);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const loadedActivities = await LoadAllActivitiesAsync(4, activity.type, true);
      const lastSevenDaysActivity = loadedActivities.find((a: any) => ToNZDateString(a.startTimeDate) === ToNZDateString(sevenDaysAgo));
      if (lastSevenDaysActivity) {
        // reload activity to include cancelled attendees
        const { activity: activityLastTime } = await LoadActivityAndMatchesByIdAsync(lastSevenDaysActivity._id, true, false);

        const attendeesLastTime = activityLastTime.Attendees;
        const attendeesLastTimeMap: Map<number, any> = new Map(attendeesLastTime.map((item: any) => [item.memberId, item]));
        const allUsersWithContinuely = await SearchUsersSortByContinuelyWeeksAsync() as any[];
        const users = [];
        for (const user of allUsersWithContinuely) {
          const attendee = attendeesLastTimeMap.get(user.memberId);
          if (attendee) {
            users.push({
              ...user,
              sectionIndex: attendee.sectionIndex,
            });
          }
        }
        const targetUsers = users.slice(0, (activityLastTime.maxAttendee * 2 / 3));

        const promiseList = [] as any[];
        const activityId = this.data.activityId;
        targetUsers.forEach(user => {
          const promise = AutoJoinActivityAsync(activityId, user.memberId, user.sectionIndex);
          promiseList.push(promise);
        });
        await Promise.all(promiseList);
        await this.ReloadActivityByIdAsync(activityId);
      }
    }, false);
  },

  async ConfirmAndChargeActivityAsync() {
    // Kevin : 10067
    const vipMemberIds = [10067];

    const activityId = this.data.activityId;
    const sections = this.data.formData.sections;
    const confirmToBeUsers = this.data.groupedAttendees
      .map(groupedAttendee => {
        const { discount, memberId, attendeeList } = groupedAttendee;

        let charge = 0;
        let useDiscount = true;
        attendeeList.forEach((a: any) => {
          const section = sections[a.sectionIndex];
          let actualDiscount = section.useDiscount === true ? discount : 0;
          let price = section.price - actualDiscount;
          if (vipMemberIds.includes(memberId)) {
            price = 0;
          }
          charge = charge + price;
          useDiscount = useDiscount && section.useDiscount
        });

        return {
          memberId: memberId,
          count: attendeeList.length - 1,
          discount: useDiscount === true ? discount : 0,
          charge: charge,
        };
      })
      .filter(a => a !== undefined && a !== null);

    await ExcuteWithProcessingAsync(async () => {
      await ConfrimActivityAsync(activityId, confirmToBeUsers);
      await this.ReloadActivityByIdAsync(activityId);
    });

  },
  //#endregion

  //#region group and match page private method
  async GroupForSection(e: IOption) {
    const { section } = e.currentTarget.dataset;
    const activityId = this.data.activityId;
    const attendeesInSection = this.data.activity.Attendees.filter((attendee: any) => attendee.sectionIndex === section.index);
    attendeesInSection.sort((a: any, b: any) => SortDate(a.updateDate, b.updateDate));
    const joinedAttendeesInSection = attendeesInSection.slice(0, section.maxAttendee);

    var sortMatchRank = await GetAllResultsAsync();
    console.log(sortMatchRank);
    joinedAttendeesInSection.forEach((att: any) => {
      const matchIndexByAttendeeMemberId = sortMatchRank.findIndex(item => item.memberId === att.attendeeMemberId ?? 0);
      const matchIndexByMemberId = sortMatchRank.findIndex(item => item.memberId === att.memberId && att.joinMore === 0);
      const matchIndexByAttendeeName = sortMatchRank.findIndex(item => item.name === att.attendeeName);
      const matchIndexByName = sortMatchRank.findIndex(item => item.name === att.displayName && att.joinMore === 0);

      if (matchIndexByAttendeeMemberId >= 0) {
        att.currentPowerOfBattle = sortMatchRank[matchIndexByAttendeeMemberId].powerOfBattle;
      } else if (matchIndexByMemberId >= 0) {
        att.currentPowerOfBattle = sortMatchRank[matchIndexByMemberId].powerOfBattle;
      } else if (matchIndexByAttendeeName >= 0) {
        att.currentPowerOfBattle = sortMatchRank[matchIndexByAttendeeName].powerOfBattle;
      } else if (matchIndexByName >= 0) {
        att.currentPowerOfBattle = sortMatchRank[matchIndexByName].powerOfBattle;
      } else {
        att.currentPowerOfBattle = 0;
      }
    });

    joinedAttendeesInSection.sort((a: any, b: any) => { return a.currentPowerOfBattle - b.currentPowerOfBattle });

    const promiseList = [] as any[];
    section.courts.forEach((court: number, index: number) => {
      const start = index * 6;
      const end = start + 6;
      joinedAttendeesInSection.slice(start, end).forEach((attendee: any) => {
        const promise = UpdateAttendeeCourtAsync(activityId, attendee.memberId, attendee.joinMore, attendee.currentPowerOfBattle ?? attendee.powerOfBattle, court);
        promiseList.push(promise);
      });
    });

    await ExcuteWithProcessingAsync(async () => {
      await Promise.all(promiseList);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async DegroupForSection(e: IOption) {
    const { section } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      await RemoveAttendeeCourtAsync(activityId, section.index);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async CreateMatchesForSection(e: IOption) {
    const { section } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    const promiseList = [] as any[];
    section.courts.forEach((court: number) => {
      const attendees = this.data.courtAttendeesMap[court];
      if (attendees.length === 6) {
        const match1 = GenerateMatch(activityId, attendees, court, 0, 2, 1, 3, 1);
        const match2 = GenerateMatch(activityId, attendees, court, 2, 4, 3, 5, 2);
        const match3 = GenerateMatch(activityId, attendees, court, 0, 4, 1, 5, 3);
        const match4 = GenerateMatch(activityId, attendees, court, 0, 3, 1, 2, 4);
        const match5 = GenerateMatch(activityId, attendees, court, 2, 5, 3, 4, 5);
        const match6 = GenerateMatch(activityId, attendees, court, 0, 5, 1, 4, 6);
        const matches = [match1, match2, match3, match4, match5, match6];

        matches.forEach((match: any) => {
          const promise = AddMatchAsync(new MatchModel(match));
          promiseList.push(promise);
        });
      }
    });

    await ExcuteWithProcessingAsync(async () => {
      await Promise.all(promiseList);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async RemoveMatchesForSection(e: IOption) {
    const { section } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    const promiseList = [] as any[];
    section.courts.forEach((court: number) => {
      const promise = RemoveMatchAsync(activityId, court);
      promiseList.push(promise);
    });

    await ExcuteWithProcessingAsync(async () => {
      await Promise.all(promiseList);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async CreateMatchesForCourt(e: IOption) {
    const { court } = e.currentTarget.dataset;
    const activityId = this.data.activityId;
    const promiseList = [] as any[];
    const attendees = this.data.courtAttendeesMap[court];
    if (attendees.length === 6) {
      const match1 = GenerateMatch(activityId, attendees, court, 0, 2, 1, 3, 1);
      const match2 = GenerateMatch(activityId, attendees, court, 2, 4, 3, 5, 2);
      const match3 = GenerateMatch(activityId, attendees, court, 0, 4, 1, 5, 3);
      const match4 = GenerateMatch(activityId, attendees, court, 0, 3, 1, 2, 4);
      const match5 = GenerateMatch(activityId, attendees, court, 2, 5, 3, 4, 5);
      const match6 = GenerateMatch(activityId, attendees, court, 0, 5, 1, 4, 6);
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

  async ChangeLeftScore(e: IOption) {
    const newValue = Number(e.detail.value);
    const { match } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      await UpdateMatchAsync(activityId, match.court, match.index, newValue, match.rightScore);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  async ChangeRightScore(e: IOption) {
    const newValue = Number(e.detail.value);
    const { match } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      await UpdateMatchAsync(activityId, match.court, match.index, match.leftScore, newValue);
      await this.ReloadActivityByIdAsync(activityId);
    });
  },

  GenerateMatchResults() {
    // match result
    const matchResultMap = {} as any;
    for (const court in this.data.courtMatchesMap) {
      const matches = this.data.courtMatchesMap[court];
      matchResultMap[court] = GetMatchResult(matches, this.data.activityId, Number(court));
    }
    this.setData({ matchResultMap, selectedTab: 3 });
  },
  //#endregion

  //#region result private method
  async SaveMatchResults() {
    const promiseList = [] as any[];
    for (const resultByCourt of Object.values(this.data.matchResultMap as any[][])) {
      for (const result of resultByCourt) {
        const promise = AddMatchResultsAsync(result);
        promiseList.push(promise);
      }
    }

    await ExcuteWithProcessingAsync(async () => {
      await Promise.all(promiseList);
      await this.ReloadActivityByIdAsync(this.data.activityId);
    });
  }
  //#endregion

})