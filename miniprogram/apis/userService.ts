import { GetCloudAsync, GetUnionIdAsync } from "./databaseService";
import { config } from "../configs/index";
import { UserRoleArray, LevelArray, UserGenderArray } from "@Lib/types";
import { ConvertFileIdToHttps } from "@Lib/utils";
import { WxGetFileInfoAsync } from "@Lib/promisify";
import { CallCloudFuncAsync, HandleException } from "./commonHelper";

export const SetupUserTypes = (user: any) => {
  if (user.avatarUrl.startsWith('cloud')) {
    user.avatarUrl = ConvertFileIdToHttps(user.avatarUrl);
  }
  user.userRoleType = UserRoleArray[user.userRole];
  user.userLevelType = LevelArray[user.userLevel];
  user.discount = (user.continueWeeklyJoin ?? 0) > 2
    ? 2
    : user.continueWeeklyJoin;
}

export const RegisterNewUserAsync = async () => {
  const unionId = await GetUnionIdAsync();
  return await CallCloudFuncAsync('eabc_user_register', { unionId });
}

export const CheckUserExistsAsync = async () => {
  const unionId = await GetUnionIdAsync();
  const app = await GetCloudAsync();
  const db = app.database();
  const profiles = await db.collection("UserProfiles").where({ unionId }).get();
  const user = profiles.data.find(d => d.unionId = unionId);

  if (user) {
    SetupUserTypes(user);
  }
  return config.mockNewUser ? null : user;
}

export const GetUserByMemberId = async (memberId: number) => {
  const app = await GetCloudAsync();
  const db = app.database();
  const profiles = await db.collection("UserProfiles").where({ memberId }).get();
  const user = profiles.data.find(d => d.memberId = memberId);
  if (user) {
    SetupUserTypes(user);
  }
  return user;
}

export const UploadAvatarImageAsync = async (filePath: string, memberId: number, avatarFileToDelete: string | null): Promise<any> => {
  try {
    const fileRes = await WxGetFileInfoAsync({ filePath });
    if (fileRes.size > 1024 * 1024 * 2) {
      wx.showToast({
        title: 'No more than 2MB',
        icon: 'none'
      })
    } else if (memberId) {
      const random6String = (Math.random() + 1).toString(36).substring(7);
      const fileTypeArray = filePath.match(/\.[^.]+?$/);
      const fileType = fileTypeArray ? fileTypeArray[0] : '';
      const cloudPath = 'avatar/' + memberId + '-' + random6String + '-' + fileType;
      const app = await GetCloudAsync();
      const result = await app.uploadFile({
        cloudPath,//云存储图片名字
        filePath,//临时路径
        method: 'post'
      });

      if (avatarFileToDelete) {
        await app.deleteFile({ fileList: [avatarFileToDelete] });
      }
      return result;
    }
    return null;
  } catch (error: any) {
    console.log(error);
    await HandleException('UploadAvatarImageAsync', error)
    return null;
  }
}

export const SearchUsersForRankAsync = async () => {
  const { users } = await CallCloudFuncAsync('user_search', {
    sort: { powerPoint: -1 },
    limit: 20
  });
  users.forEach((u: any) => SetupUserTypes(u));
  return users;
}

export const SearchUsersByKeyAsync = async (searchText: string) => {
  const { users } = await CallCloudFuncAsync('user_search', {
    searchText: searchText,
    limit: 5
  });
  users.forEach((u: any) => SetupUserTypes(u));
  return users;
}

export const SearchUsersSortByContinuelyWeeksAsync = async () => {
  const app = await GetCloudAsync();
  const db = app.database();
  const _ = db.command;
  const { users } = await CallCloudFuncAsync('user_search', {
    where: { continueWeeklyJoin: _.gt(0) },
    limit: 30
  });
  users.forEach((u: any) => SetupUserTypes(u));
  return users;
}

export const SearchAllUsersAsync = async () => {
  const { users } = await CallCloudFuncAsync('user_search', {
    sort: { continueWeeklyJoin: -1, memberId: -1 }
  });
  users.forEach((u: any) => SetupUserTypes(u));
  return users;
}
