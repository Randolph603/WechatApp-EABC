import { MatchModel } from "@Model/Match";
import { UpdateRecordAsync } from "./commonHelper";
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

export const UpdateMatchAsync = async (activityId: string, court: number, index: number, leftScore: number, rightScore: number) => {
  try {
    await UpdateRecordAsync('Matches',
      { activityId: activityId, court: court, index: index },
      { leftScore: leftScore, rightScore: rightScore }
    );
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
  const playerList = attendees.map(a => {
    return {
      attendeeId: a.attendeeId,
      memberId: a.memberId,
      avatarUrl: a.avatarUrl,
      displayName: a.displayName,
      gender: a.gender,
      joinMore: a.joinMore,
      currentPowerOfBattle: a.currentPowerOfBattle,
      attendeeName: a.attendeeName,
      attendeeGender: a.attendeeGender,
    }
  });
  const leftGender = (playerList[index1].attendeeGender || playerList[index1].gender) + (playerList[index2].attendeeGender || playerList[index2].gender);
  const rightGender = (playerList[index3].attendeeGender || playerList[index3].gender) + (playerList[index4].attendeeGender || playerList[index4].gender);
  const misMatch = leftGender - rightGender;
  const match = {
    index: index,
    activityId: activityId,
    court: court,
    player1: playerList[index1],
    player2: playerList[index2],
    leftScore: misMatch > 0 ? misMatch * 3 : 0,
    player3: playerList[index3],
    player4: playerList[index4],
    rightScore: misMatch < 0 ? (-misMatch) * 3 : 0,
  };
  return match;
}