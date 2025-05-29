
import { config } from "../configs/index";
import { CallCloudFuncAsync } from "./commonHelper";
import { LoadAllActivitiesAsync as MockLoadAllActivitiesAsync } from "../configs/mocks";

export const LoadAllActivitiesAsync = async () => {
  if (config.useMock === true) {
    return MockLoadAllActivitiesAsync();
  }
  
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