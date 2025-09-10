import { MatchModel } from "@Model/Match";
import { config } from "../configs/index";
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

export const GenerateMatch = (activityId: string, attendees: any[], court: number, index1: number, index2: number, index3: number, index4: number, index: number) => {
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
      attendeeMemberId: a.attendeeMemberId,
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

export const GetMatchResult = (matches: any[], activityId: string, court: number,) => {
  const matchResults: any[] = [];
  for (const match of matches) {
    // skip draw
    if (match.leftScore === match.rightScore) continue;
    const setupCourtMatchesMap = (player: any) => {
      const found = matchResults.find((r: any) => r.player.attendeeId === player.attendeeId);
      if (!found) {
        const result = {
          activityId: activityId,
          court: court,
          player: player,
          wins: 0,
          lost: 0,
          pointDifference: 0,
          powerOfBattleChange: 0,
          season: config.currentSeason
        };
        matchResults.push(result);
      }
    }
    setupCourtMatchesMap(match.player1);
    setupCourtMatchesMap(match.player2);
    setupCourtMatchesMap(match.player3);
    setupCourtMatchesMap(match.player4);

    const setWinnerResult = (player: any, pointDifference: number) => {
      const foundPlayer = matchResults.find((r: any) => r.player.attendeeId === player.attendeeId);
      if (foundPlayer) {
        foundPlayer.wins = foundPlayer.wins + 1;
        foundPlayer.pointDifference = foundPlayer.pointDifference + pointDifference;
      }
    }

    const setLoserResult = (player: any) => {
      const foundPlayer = matchResults.find((r: any) => r.player.attendeeId === player.attendeeId);
      if (foundPlayer) {
        foundPlayer.lost = foundPlayer.lost + 1;
      }
    }

    if (match.leftScore > match.rightScore) {
      const pointDifference = match.leftScore - match.rightScore;
      setWinnerResult(match.player1, pointDifference);
      setWinnerResult(match.player2, pointDifference);
      setLoserResult(match.player3);
      setLoserResult(match.player4);
    }

    if (match.rightScore > match.leftScore) {
      const pointDifference = match.rightScore - match.leftScore;
      setLoserResult(match.player1);
      setLoserResult(match.player2);
      setWinnerResult(match.player3, pointDifference);
      setWinnerResult(match.player4, pointDifference);
    }
  }

  matchResults.sort((a: any, b: any) => {
    if (b.wins === a.wins) return b.pointDifference - a.pointDifference;
    return b.wins - a.wins
  });

  // TODO for more complex powerOfBattleChange logic
  matchResults.forEach((v: any, i: number) => {
    if (v.wins === 0) {
      v.powerOfBattleChange = 0;
    } else {
      v.powerOfBattleChange = (6 - i) * 5;
    }
  });
  return matchResults;
}

export const AddMatchResultsAsync = async (matchResultToAdd: any) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    await RemoveResultsAsync(matchResultToAdd.activityId, matchResultToAdd.court);
    await db.collection('MatchResults').add(matchResultToAdd);
  } catch (error) {
    console.log(error);
  }
}

export const RemoveResultsAsync = async (activityId: string, court: number) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    await db.collection('MatchResults')
      .where({ activityId: activityId, court: court })
      .remove();
  } catch (error) {
    console.log(error);
  }
}

export const GetAllResultsAsync = async () => {
  const app = await GetCloudAsync();
  const db = app.database();
  const matchResults1 = await db.collection("MatchResults").skip(0).limit(100).get();
  const matchResults2 = await db.collection("MatchResults").skip(100).limit(100).get();
  return matchResults1.data.concat(matchResults2.data);
}