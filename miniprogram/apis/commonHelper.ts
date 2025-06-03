import { GetCloudAsync } from './databaseService';

export const CallCloudFuncAsync = async (funcName: string, data: object) => {
  const app = await GetCloudAsync();
  const response = await app.callFunction({
    name: funcName,
    data: data
  });
  return response.result;
};

// return updated success count
export const UpdateRecordAsync = async (collection: string, where: object, data: object, dateData: object | null = null) => {
  const response = await CallCloudFuncAsync(
    'updateRecord',
    {
      collection: collection,
      where: where,
      data: data,
      dateData: dateData
    });
  return response.updatedCount;
};