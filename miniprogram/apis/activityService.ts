
import { config } from "../configs/index";
import { CallCloudFuncAsync, UpdateRecordAsync } from "./commonHelper";
import { LoadAllActivitiesAsync as MockLoadAllActivitiesAsync } from "../configs/mocks";
import { ToDayOfWeekString, ToShortDateString, ToShortTimeRange } from "@Lib/dateExtension";
import { LevelArray } from "@Lib/types";
import { ConvertFileIdToHttps } from "@Lib/utils";
import { GetCloudAsync } from "./databaseService";

export const LoadAllActivitiesAsync = async (limit: number = 20) => {
  if (config.useMock === true) {
    return MockLoadAllActivitiesAsync();
  }

  let data = {
    where: { isCancelled: false, type: undefined, toPublic: true },
    sort: { startTime: -1 },
    limit: limit,
  };
  const { activities } = await CallCloudFuncAsync('activity_search', data)
  activities.forEach((activity: any) => {
    activity.coverImageSrc = "/static" + activity.coverImageSrc;
    activity.date = ToShortDateString(activity.startTime);
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

  activity.date = `${ToShortDateString(activity.startTime)}(${ToDayOfWeekString(activity.startTime)})`;
  activity.time = ToShortTimeRange(activity.startTime, activity.during);

  activity.Attendees.forEach((user: any) => {
    user.userLevelType = LevelArray[user.userLevel];
    user.key = `${user.memberId}${user.joinMore}`;
    // user.userLevelImageSrc = `/images/rank/${user.userLevel}.png`;
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

export const CancelJoinActivityAsync = async (activityId: string, memberId: number, joinMore: number) => {
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