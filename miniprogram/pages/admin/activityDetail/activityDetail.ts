import { AddActivityAsync, CancelJoinActivityAsync, ConfrimActivityAsync, JoinActivityAsync, LoadActivityByIdAsync } from "@API/activityService";
import { UpdateRecordAsync } from "@API/commonHelper";
import { SearchUsersByKeyAsync, SearchUsersSortByContinuelyWeeksAsync } from "@API/userService";
import { ToNZDateString, ToNZTimeRangeString, ToNZTimeString } from "@Lib/dateExtension";
import { ActivityType, ActivityTypeArray } from "@Lib/types";
import { ExcuteWithLoadingAsync, ExcuteWithProcessingAsync, GetNavBarHeight, ToNumberOrString } from "@Lib/utils";
import { IOption, iActivity, ToActivity } from "@Model/index";

const converPageArray = [
  '/static/images/badmintonCover1.jpg',
  '/static/images/badmintonCover2.jpg',
];

const newSection = {
  index: 1,
  title: '娱乐区',
  price: 17,
  time: ToNZTimeString(new Date()),
  timeRange: ToNZTimeRangeString(new Date(), 120),
  during: 120,
  maxAttendee: 24,
}

Page({
  data: {
    navBarHeight: GetNavBarHeight() + 10,
    selectedTab: 0,
    activityId: '',
    date: ToNZDateString(new Date()),
    type: ActivityType.Happy,
    formData: {} as iActivity,
    typeArray: ActivityTypeArray,
    courtArray: [1, 2, 3, 4, 5, 6, 7, 8],
    converPageArray: converPageArray,
    rules: [
      { name: 'title', rules: { required: true, message: '请输入名称' } },
      { name: 'type', rules: { required: true } },
      { name: 'address', rules: { required: true } },
      { name: 'courts', rules: { required: true, message: '请输入场地' } },
      { name: 'coverImageSrc', rules: { required: true } },
      { name: 'startTime', rules: { required: true, message: '请输入日期和时间' } },
      { name: 'sections', rules: { required: true, minlength: 1, message: 'Section不能为空' }, },
      { name: 'isCancelled', rules: { required: true } },
      { name: 'isCompleted', rules: { required: true } },
      { name: 'toPublic', rules: { required: true } },
      { name: 'updateDate', rules: { required: false } },
      { name: 'viewCount', rules: { required: false } },
      { name: 'shareCount', rules: { required: false } },
    ],
    //Attendees page
    searchTerm: '',
    matchedUsers: [],
    allActiveAttendees: [] as any[],
    groupedAttendees: [] as any[]
  },

  async onLoad(options: Record<string, string | undefined>) {
    const activityId = options.id;
    if (activityId) {
      await this.ReloadActivityByIdAsync(activityId);
    } else {
      const initData = {
        title: '双打羽毛球',
        type: ActivityType.Happy.value,
        address: 'Lloyd Elsmore Park Badminton',
        courts: [5, 6, 7, 8],
        coverImageSrc: converPageArray[0],
        startTime: new Date(),
        updateDate: new Date(),
        isCancelled: false,
        isCompleted: false,
        toPublic: true,
        sections: [newSection],
        viewCount: 0,
        shareCount: 0,
      } as iActivity;
      this.setData({ formData: initData });
    }

  },

  async ReloadActivityByIdAsync(activityId: string) {
    await ExcuteWithLoadingAsync(async () => {
      const activity = await LoadActivityByIdAsync(activityId);
      const formData = ToActivity(activity);
      const allActiveAttendees = activity.Attendees.filter((a: any) => !a.isCancelled);
      this.setData({
        activityId: activityId,
        date: ToNZDateString(activity.startTime),
        type: ActivityTypeArray.find(x => x.value === activity.type),
        formData: formData,
        allActiveAttendees: allActiveAttendees
      });

      this.generateGroupAttendees();
    });
  },

  generateGroupAttendees() {
    const groupedAttendees: any = [];
    const activeAttendeesGroup = this.data.allActiveAttendees
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
  formTextChange(e: any) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  typePickerChange(e: any) {
    const typeArrayIndex = Number(e.detail.value);
    this.setData({
      [`type`]: this.data.typeArray[typeArrayIndex],
      [`formData.type`]: this.data.typeArray[typeArrayIndex].value
    });
  },

  courtCheckboxChange(e: any) {
    const newCourts = e.detail.value.map((str: any) => Number(str)).sort((a: number, b: number) => (a - b));
    this.setData({
      [`formData.courts`]: newCourts
    });
  },

  formDateChange(e: any) {
    const existingDate = new Date(this.data.formData.startTime);
    const newDate = new Date(e.detail.value);
    existingDate.setFullYear(newDate.getFullYear());
    existingDate.setMonth(newDate.getMonth());
    existingDate.setDate(newDate.getDate());
    this.setData({
      [`date`]: e.detail.value,
      ['formData.startTime']: existingDate
    });
  },

  coverImageRadioChange(e: { detail: { value: any; }; }) {
    const coverIndex = Number(e.detail.value);
    const coverImageSrc = converPageArray[coverIndex];
    this.setData({
      [`formData.coverImageSrc`]: coverImageSrc,
    });
  },

  addSection() {
    const existing = this.data.formData.sections;
    const addSection = { ...newSection };
    addSection.index = existing.length + 1;
    existing.push(addSection);
    this.setData({
      [`formData.sections`]: existing
    });
  },

  removeSection() {
    const existing = this.data.formData.sections;
    existing.pop();
    this.setData({
      [`formData.sections`]: existing
    });
  },

  handleSectionChange(e: IOption) {
    const { id, field } = e.currentTarget.dataset;
    const newValue = ToNumberOrString(e.detail.value);

    this.setData({
      [`formData.sections[${id}].${field}`]: newValue
    });

    if (['time', 'during'].includes(field)) {
      const existing = this.data.formData.sections[id];
      const dateTime = new Date();
      const timeArray = existing.time.split(':');
      dateTime.setHours(Number(timeArray[0]));
      dateTime.setMinutes(Number(timeArray[1]));
      dateTime.setSeconds(0);

      const timeRange = ToNZTimeRangeString(dateTime, existing.during);
      this.setData({
        [`formData.sections[${id}].timeRange`]: timeRange
      });
    }
  },

  async submitForm() {
    await ExcuteWithProcessingAsync(() => {
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
          const activityToAdd = { ...this.data.formData };
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
        }
      });
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
        this.setData({
          allActiveAttendees: [user, ...this.data.allActiveAttendees]
        });
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
      let allActiveAttendees = [];
      if (more > 0) {
        await CancelJoinActivityAsync(activityId, memberId, more);
        allActiveAttendees = this.data.allActiveAttendees
          .filter((a: any) => !(a.memberId === memberId && a.joinMore === more));
      } else {
        await CancelJoinActivityAsync(activityId, memberId, undefined);
        allActiveAttendees = this.data.allActiveAttendees
          .filter((a: any) => a.memberId !== memberId);
      }

      this.setData({
        allActiveAttendees: allActiveAttendees
      });
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

      this.setData({
        allActiveAttendees: users
      });
      this.generateGroupAttendees();
    }, false);
  },

  async confirmActivityAsync() {
    const vipMemberIds = [10024, 10000];

    const activityId = this.data.activityId;
    const sections = this.data.formData.sections;
    const confirmToBeUsers = this.data.groupedAttendees
      .map(a => {
        const discount = (a.continueWeeklyJoin || 0) > 3 ? 3 : (a.continueWeeklyJoin || 0);
        let charge = 0;
        a.sectionIndexs.forEach((sectionIndex: number) => {
          const section = sections[sectionIndex];
          let price = section.price - discount;
          if (vipMemberIds.includes(a.memberId)) {
            price = 14;
          }
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

    const resCount = await ConfrimActivityAsync(activityId, confirmToBeUsers);
    if (resCount > 0) {
      wx.showToast({ title: `成功`, icon: 'success' });
      wx.navigateBack({ delta: 0 });
    } else {
      wx.showToast({ title: '失败', icon: 'none' });
    }
  },
  //#endregion
})