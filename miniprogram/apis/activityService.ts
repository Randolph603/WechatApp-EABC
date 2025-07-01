
import { config } from "../configs/index";
import { CallCloudFuncAsync, UpdateRecordAsync } from "./commonHelper";
import { LoadAllActivitiesAsync as MockLoadAllActivitiesAsync } from "../configs/mocks";
import { ToDayOfWeekString, ToNZShortDateString, ToNZTimeRangeString } from "@Lib/dateExtension";
import { LevelArray } from "@Lib/types";
import { ConvertFileIdToHttps } from "@Lib/utils";
import { GetCloudAsync } from "./databaseService";
import { iActivity } from "miniprogram/models";

export const LoadAllActivitiesAsync = async (limit: number = 20, onlyPublic: boolean | undefined) => {
  if (config.useMock === true) {
    return MockLoadAllActivitiesAsync();
  }

  let data = {
    where: { isCancelled: false, type: undefined, toPublic: onlyPublic },
    sort: { startTime: -1 },
    limit: limit,
  };
  const { activities } = await CallCloudFuncAsync('activity_search', data)
  activities.forEach((activity: any) => {
    activity.coverImageSrc = "/static" + activity.coverImageSrc;
    activity.date = ToNZShortDateString(activity.startTime);
    activity.dayOfWeek = ToDayOfWeekString(activity.startTime);
  });
  return activities;
}

export const LoadActivityByIdAsync = async (id: string) => {
  let data = {
    activityId: id,
    includeCancelledAttendees: true
  };

  const { activity } = await CallCloudFuncAsync('activity_getById', data);

  activity.date = `${ToNZShortDateString(activity.startTime)} (${ToDayOfWeekString(activity.startTime)})`;
  activity.time = ToNZTimeRangeString(activity.startTime, activity.during);

  activity.Attendees.forEach((user: any) => {
    user.userLevelType = LevelArray[user.userLevel];
    user.key = `${user.memberId}+${user.joinMore}`;
    user.userLevelImageSrc = `/static/ranks/${user.userLevel}.png`;
    if (user.avatarUrl.startsWith('cloud')) {
      user.avatarUrl = ConvertFileIdToHttps(user.avatarUrl);
    }
  });

  return activity;
}

export const JoinActivityAsync = async (activityId: string, memberId: number, joinMore: number) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    const updatedCount = await UpdateRecordAsync('Attendees',
      { activityId: activityId, memberId: memberId, joinMore: joinMore },
      { isCancelled: false },
      { updateDate: JSON.stringify(new Date()) }
    );
    if (updatedCount === 0) {
      await db.collection('Attendees').add({
        activityId: activityId,
        memberId: memberId,
        isCancelled: false,
        createDate: new Date(),
        updateDate: new Date(),
        joinMore: joinMore,
        sectionIndex: 0
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const CancelJoinActivityAsync = async (activityId: string, memberId: number, joinMore: number | undefined) => {
  try {
    await UpdateRecordAsync('Attendees',
      { activityId: activityId, memberId: memberId, joinMore: joinMore },
      { isCancelled: true },
      { updateDate: JSON.stringify(new Date()) }
    );
  } catch (error) {
    console.log(error);
  }
}

export const AttendeeMoveSectionAsync = async (activityId: string, memberId: number, joinMore: number, sectionIndex: number) => {
  try {
    await UpdateRecordAsync('Attendees',
      { activityId: activityId, memberId: memberId, joinMore: joinMore },
      { sectionIndex: sectionIndex }
    );
  } catch (error) {
    console.log(error);
  }
}

export const AddActivityAsync = async (activityToAdd: iActivity): Promise<any> => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    const result = await db.collection('Activities').add(activityToAdd);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const ConfrimActivityAsync = async (activityId: string, confirmToBeUsers: any[]) => {
  const data = {
    activityId: activityId,
    confirmToBeUsers: confirmToBeUsers,
  };
  const { updatedCount } = await CallCloudFuncAsync('activity_confirm', data);
  return updatedCount;
}