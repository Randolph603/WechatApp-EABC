
import { config } from "../configs/index";
import { CallCloudFuncAsync } from "./commonHelper";
import { LoadAllActivitiesAsync as MockLoadAllActivitiesAsync } from "../configs/mocks";
import { ToDayOfWeekString, ToShortDateString } from "@Lib/utils";

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