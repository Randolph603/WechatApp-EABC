import { MatchModel } from "@Model/Match";
import { GetCloudAsync } from "./databaseService";

export const AddMatchAsync = async (matchToAdd: MatchModel) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    await RemoveMatchAsync(matchToAdd.activityId, matchToAdd.court);
    await db.collection('Matches').add(matchToAdd);
  } catch (error) {
    console.log(error);
  }
}

export const RemoveMatchAsync = async (activityId: string, court: number) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    await db.collection('Matches')
      .where({ activityId: activityId, court: court })
      .remove();
  } catch (error) {
    console.log(error);
  }
}

// merge into activity load could function together, should not be used for now
export const LoadAllMatchesAsync = async (activityId: string): Promise<any> => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    const result = await db.collection('Matches')
      .where({ activityId: activityId })
      .orderBy('index', 'asc')
      .get();
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const generateMatch = (activityId: string, attendees: any[], court: number, index1: number, index2: number, index3: number, index4: number, index: number) => {
  const leftGender = attendees[index1].gender + attendees[index2].gender;
  const rightGender = attendees[index3].gender + attendees[index4].gender;
  const misMatch = leftGender - rightGender;
  const match = {
    index: index,
    activityId: activityId,
    court: court,
    player1: attendees[index1],
    player2: attendees[index2],
    leftScore: misMatch > 0 ? misMatch * 3 : 0,
    player3: attendees[index3],
    player4: attendees[index4],
    rightScore: misMatch < 0 ? (-misMatch) * 3 : 0,
  };
  return match;
}