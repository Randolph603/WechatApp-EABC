import { MatchModel } from "@Model/Match";
import { GetCloudAsync } from "./databaseService";

export const AddMatchAsync = async (matchToAdd: MatchModel): Promise<any> => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    const result = await db.collection('Matches').add(matchToAdd);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const RemoveMatchAsync = async (activityId: string, court: number): Promise<any> => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    const result = await db.collection('Matches')
      .where({ activityId: activityId, court: court })
      .remove();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}