import { GetDatabaseAsync, GetUnionIdAsync } from "./databaseService";

export const GetUserByUnionId = async () => {
  const unionId = await GetUnionIdAsync();  
  const app = await GetDatabaseAsync();
  const db = app.database();
  const profiles = await db.collection("UserProfiles").where({ unionId }).get();
  return profiles.data.find(d => d.unionId = unionId);  
}