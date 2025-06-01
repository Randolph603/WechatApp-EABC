import { GetDatabaseAsync, GetUnionIdAsync } from "./databaseService";
import { config } from "../configs/index";
import { GetUserByUnionId as MockGetUserByUnionId } from "../configs/mocks";
import { UserRoleArray, LevelArray } from "@Lib/types";
import { ConvertFileIdToHttps } from "@Lib/utils";

export const GetUserByUnionId = async () => {
  if (config.useMock === true) {
    return MockGetUserByUnionId();
  }

  const unionId = await GetUnionIdAsync();
  const app = await GetDatabaseAsync();
  const db = app.database();
  const profiles = await db.collection("UserProfiles").where({ unionId }).get();
  const user = profiles.data.find(d => d.unionId = unionId);

  if (user) {
    if (user.avatarUrl.startsWith('cloud')) {
      user.avatarUrl = ConvertFileIdToHttps(user.avatarUrl);
    }
    user.userRoleName = UserRoleArray.find(u => u.value === user.userRole)?.name ?? 'Unknown';
    user.userLevelName = LevelArray[user.userLevel].displayName ?? 'Unknown';
  } else {
    // if user not exists, delete union id from storage
    wx.removeStorageSync('unionid');
  }
  return user;
}