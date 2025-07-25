import { AddActivityAsync, CancelJoinActivityAsync, ConfrimActivityAsync, GetNewActivity, JoinActivityAsync, LoadActivityAndMatchesByIdAsync, RemoveAttendeeCourtAsync, UpdateAttendeeCourtAsync, UpdateCurrentPowerOfBattleAsync } from "@API/activityService";
import { UpdateRecordAsync } from "@API/commonHelper";
import { AddMatchAsync, LoadAllMatchesAsync, RemoveMatchAsync } from "@API/matchService";
import { SearchUsersByKeyAsync, SearchUsersSortByContinuelyWeeksAsync } from "@API/userService";
import { ToNZTimeRangeString } from "@Lib/dateExtension";
import { ActivityTypeArray, ConverPageArray } from "@Lib/types";
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
    // Tab
    selectedTab: 0,
    // Info Page
    activityId: null as unknown as string,
    formData: null as unknown as ActivityModel,
    activity: null as unknown as any,
    courtAttendeesMap: {} as any,
    typeArray: ActivityTypeArray,
    courtArray: [1, 2, 3, 4, 5, 6, 7, 8],
    converPageArray: ConverPageArray,
    rules: rules,
    //Attendees page
    searchTerm: '',
    matchedUsers: [] as any[],
    groupedAttendees: [] as any[]
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
    const { activity, matches } = await LoadActivityAndMatchesByIdAsync(activityId, false);
    const formData = new ActivityModel(activity);

    const courtAttendeesMap: any = {};
    formData.courts.forEach(court => {
      courtAttendeesMap[court] = activity.Attendees
        .filter((a: any) => a.court === court)
        .sort((a: any, b: any) => b.currentPowerOfBattle - a.currentPowerOfBattle);
    });

    const courtMatchesMap = {} as any;
    matches.forEach((match: any) => {
      const court = match.court;
      if (!courtMatchesMap[court]) {
        courtMatchesMap[court] = [];
      }
      courtMatchesMap[court].push(match);
    });

    this.setData({
      activityId: activityId,
      formData: formData,
      activity: activity,
      courtAttendeesMap,
      courtMatchesMap
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
      const first = atts[0];
      first.totalJoinMore = atts.length - 1;
      first.sectionIndexs = atts.map((a: any) => a.sectionIndex);
      groupedAttendees.push(first);
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
      [`activity.typeValue`]: selectedType,
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
      const users = await SearchUsersByKeyAsync(searchText);

      this.setData({
        searchTerm: searchText,
        matchedUsers: users
      });
    }, false);
  },

  async addAttendeeAsync(e: IOption) {
    const { user, more } = e.currentTarget.dataset;
    if (!user) return;

    await ExcuteWithProcessingAsync(async () => {
      const activityId = this.data.activityId;
      if (activityId) {
        await JoinActivityAsync(activityId, user.memberId, more);
        user.joinMore = more;
        allActiveAttendees.push(user);
        this.generateGroupAttendees();
      };
    }, false);
  },

  async removeAttendeeAsync(e: IOption) {
    const { user, more } = e.currentTarget.dataset;
    if (!user) return;

    const memberId = user.memberId;
    const activityId = this.data.activityId;

    await ExcuteWithProcessingAsync(async () => {
      let newAllActiveAttendees = [];
      if (more > 0) {
        await CancelJoinActivityAsync(activityId, memberId, more);
        newAllActiveAttendees = allActiveAttendees
          .filter((a: any) => !(a.memberId === memberId && a.joinMore === more));
      } else {
        await CancelJoinActivityAsync(activityId, memberId, undefined);
        newAllActiveAttendees = allActiveAttendees
          .filter((a: any) => a.memberId !== memberId);
      }

      allActiveAttendees = newAllActiveAttendees
      this.generateGroupAttendees();
    }, false);
  },

  goToUserDetails(e: IOption) {
    const { memberId } = e.currentTarget.dataset['user'];
    wx.navigateTo({
      url: '/pages/admin/userDetail/userDetail?memberId=' + memberId,
    });
  },

  async autoAddAttendeesAsync() {
    await ExcuteWithProcessingAsync(async () => {
      const activityId = this.data.activityId;
      const users = await SearchUsersSortByContinuelyWeeksAsync() as any[];
      const promiseList = [] as any[];
      users.forEach(user => {
        const promise = JoinActivityAsync(activityId, user.memberId, 0);
        promiseList.push(promise);
        user.sectionIndex = 0;
      });
      await Promise.all(promiseList);

      allActiveAttendees = users;
      this.generateGroupAttendees();
    }, false);
  },

  async ConfirmAndChargeActivityAsync() {
    // const vipMemberIds = [10000];

    const activityId = this.data.activityId;
    const sections = this.data.formData.sections;
    const confirmToBeUsers = this.data.groupedAttendees
      .map(a => {
        const discount = (a.continueWeeklyJoin || 0) > 3 ? 3 : (a.continueWeeklyJoin || 0);
        let charge = 0;
        a.sectionIndexs.forEach((sectionIndex: number) => {
          const section = sections[sectionIndex];
          let price = section.price - discount;
          // if (vipMemberIds.includes(a.memberId)) {
          //   price = 14;
          // }
          charge = charge + price;
        });

        return {
          memberId: a.memberId,
          count: a.joinMore,
          discount: discount,
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

  //#group and score page private method
  async GroupForSection(e: IOption) {
    const { section } = e.currentTarget.dataset;
    const activityId = this.data.activityId;
    const attendeesInSection = this.data.activity.Attendees.filter((attendee: any) => attendee.sectionIndex === section.index);
    attendeesInSection.sort((a: any, b: any) => { return a.powerOfBattle - b.powerOfBattle });

    const promiseList = [] as any[];
    section.courts.forEach((court: number, index: number) => {
      const start = index * 6;
      const end = start + 6;
      attendeesInSection.slice(start, end).forEach((attendee: any) => {
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

  async ArrangeGame(e: IOption) {
    const { section } = e.currentTarget.dataset;
    const activityId = this.data.activityId;

    const generateMatch = (attendees: any[], court: number, index1: number, index2: number, index3: number, index4: number, index: number) => {
      const leftGender = attendees[index1].gender + attendees[index2].gender;
      const rightGender = attendees[index3].gender + attendees[index4].gender;
      const misMatch = leftGender - rightGender;
      const match = {
        index: index,
        activityId: activityId,
        court: court,
        player1: attendees[index1],
        player2: attendees[index2],
        leftScore: misMatch > 0 ? misMatch * 3 : 0,
        player3: attendees[index3],
        player4: attendees[index4],
        rightScore: misMatch < 0 ? (-misMatch) * 3 : 0,
      };
      return match;
    }

    const promiseList = [] as any[];
    section.courts.forEach((court: number) => {
      const attendees = this.data.courtAttendeesMap[court];
      if (attendees.length === 6) {
        const match1 = generateMatch(attendees, court, 0, 2, 1, 3, 1);
        const match2 = generateMatch(attendees, court, 2, 4, 3, 5, 2);
        const match3 = generateMatch(attendees, court, 0, 4, 1, 5, 3);
        const match4 = generateMatch(attendees, court, 0, 3, 1, 2, 4);
        const match5 = generateMatch(attendees, court, 2, 5, 3, 4, 5);
        const match6 = generateMatch(attendees, court, 0, 5, 1, 4, 6);
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

  async CleanMatches(e: IOption) {
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



  //#endregion
})