import { GetCurrentUrl } from '@Lib/utils';
import { GetCloudAsync, GetUnionIdAsync } from './databaseService';
import { CheckUserExistsAsync } from './userService';

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

export const HandleException = async (functionName: string, error: any) => {
  const currentUrl = GetCurrentUrl();
  const program = wx.getAccountInfoSync().miniProgram;
  const programInfo = `${program.envVersion} - V${program.version}`;
  const app = await GetCloudAsync();
  const db = app.database();
  const unionId = await GetUnionIdAsync();
  const user = await CheckUserExistsAsync();
  const memberId = user?.memberId ?? 0;
  const userName = user?.displayName ?? 'not register user';

  await db.collection('Sys_Exceptions').add({
    functionName: `${currentUrl} - ${functionName}`,
    unionId: unionId,
    memberId: memberId,
    user: userName,
    program: programInfo,
    date: new Date(),
    exception: error,
  });
};