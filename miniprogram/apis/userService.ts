import { GetDatabaseAsync, GetUnionIdAsync } from "./databaseService";
import { config } from "../configs/index";
import { GetUserByUnionId as MockGetUserByUnionId } from "../mocks/mocks";

export const GetUserByUnionId = async () => {
  if (config.useMock === true) {
    return MockGetUserByUnionId();
  }
  
  const unionId = await GetUnionIdAsync();
  const app = await GetDatabaseAsync();
  const db = app.database();
  const profiles = await db.collection("UserProfiles").where({ unionId }).get();
  const user = profiles.data.find(d => d.unionId = unionId);
  if (!user) {
    wx.removeStorageSync('unionid');
  }
  return user;
}