
import { config } from "../configs/index";
import { CallCloudFuncAsync } from "./commonHelper";
import { LoadAllActivitiesAsync as MockLoadAllActivitiesAsync } from "../configs/mocks";
import { ToDayOfWeekString, ToShortDateString, ToShortTimeRange } from "@Lib/dateExtension";
import { LevelArray } from "@Lib/types";
import { ConvertFileIdToHttps } from "@Lib/utils";

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
    user.userLevelName = LevelArray[user.userLevel].displayName;
    // user.userLevelImageSrc = `/images/rank/${user.userLevel}.png`;
    if (user.avatarUrl.startsWith('cloud')) {
      user.avatarUrl = ConvertFileIdToHttps(user.avatarUrl);
    }
  });

  return activity;
}