import { CallCloudFuncAsync } from "./commonHelper";

export const LoadAllActivitiesAsync = async () => {
  let data = {
    where: { isCancelled: false, type: undefined, toPublic: true },
    sort: { startTime: -1 },
    limit: 10,
  };

  const { activities } = await CallCloudFuncAsync('activity_search', data)

  activities.forEach((acti: any) => {
    acti.coverImageSrc = "/static" + acti.coverImageSrc;
  });
  return activities;
}