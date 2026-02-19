import { MatchResultType } from "@Lib/types";
import { MatchModel } from "@Model/Match";
import { config } from "../configs/index";
import { CallCloudFuncAsync, UpdateRecordAsync } from "./commonHelper";
import { GetCloudAsync } from "./databaseService";

// table of Matches
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
      captainMemberId: a.captainMemberId
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
  if (activityId && court) {
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

// table of MatchResults
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
          season: config.currentSeason,
          type: MatchResultType.SoloDouble.value
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

  let lastResult: any = null;
  // TODO for more complex powerOfBattleChange logic
  matchResults.forEach((v: any, i: number) => {
    if (v.wins === 0) {
      v.powerOfBattleChange = 0;
    } else {
      const powerOfBattle: number = v.player.currentPowerOfBattle;
      if (powerOfBattle <= 100) { // 青铜级别，负场不扣战力，场地排序增加战力
        v.powerOfBattleChange = (6 - i) * 5;
      } else if (powerOfBattle <= 200) { // 白银级别，胜场加战力，负场不扣战力
        v.powerOfBattleChange = v.wins * 5
      } else if (powerOfBattle <= 400) { // 黄金级别，胜场加战力，负场扣战力
        v.powerOfBattleChange = v.wins * 5 - v.lost * 5
      } else { // 400 + ....
        v.powerOfBattleChange = v.wins * 5 - v.lost * 8
      }

      // for fixed couplex to make sure they get same powerOfBattleChange
      if (lastResult && lastResult.pointDifference === v.pointDifference) {
        v.powerOfBattleChange = lastResult.powerOfBattleChange;
      }
      lastResult = v;
    }
  });
  return matchResults;
}

export const GetTournamentResult = (matches: any[], attendees: any[], activityId: string, court: number,) => {
  const captainMemberIds = attendees
    .filter((a: any) => a.captainMemberId)
    .map((a: any) => a.captainMemberId);

  const teams: any[] = [];
  for (const captainMemberId of captainMemberIds) {
    const captain = attendees.find((a: any) => a.memberId === captainMemberId);
    const members = attendees.filter((a: any) => a.captainMemberId === captainMemberId);
    const players = [captain].concat(members);
    teams.push({
      activityId: activityId,
      court: court,
      captain: captain,
      players: players,
      wins: 0,
      lost: 0,
      pointDifference: 0,
      powerOfBattleChange: 0,
      season: config.currentSeason,
      type: MatchResultType.TournamentDouble.value
    });
  }

  for (const match of matches) {
    // skip draw
    if (match.leftScore === match.rightScore) continue;

    const setWinnerResult = (player: any, pointDifference: number) => {
      const findTeam = teams.find((t: any) => t.captain.memberId === player.memberId
        || t.captain.memberId === player.captainMemberId);
      if (findTeam) {
        findTeam.wins = findTeam.wins + 1;
        findTeam.pointDifference = findTeam.pointDifference + pointDifference;
      }
    }

    const setLoserResult = (player: any) => {
      const findTeam = teams.find((t: any) => t.captain.memberId === player.memberId
      || t.captain.memberId === player.captainMemberId);
      if (findTeam) {
        findTeam.lost = findTeam.lost + 1;
      }
    }

    if (match.leftScore > match.rightScore) {
      const pointDifference = match.leftScore - match.rightScore;
      setWinnerResult(match.player1, pointDifference);     
      setLoserResult(match.player4);
    }

    if (match.rightScore > match.leftScore) {
      const pointDifference = match.rightScore - match.leftScore;
      setLoserResult(match.player1);      
      setWinnerResult(match.player4, pointDifference);
    }
  }

  teams.sort((a: any, b: any) => {
    if (b.wins === a.wins) return b.pointDifference - a.pointDifference;
    return b.wins - a.wins
  });

  teams.forEach((v: any, i: number) => {
    v.powerOfBattleChange = i + 1;
  });
  return teams;
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
  if (activityId && court) {
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
}

export const GetAllResultsAsync = async () => {
  const { matchResults: results } = await CallCloudFuncAsync('eabc_match', {
    where: { season: config.currentSeason, type: MatchResultType.SoloDouble.value },
    limit: 2000,
  });

  const matchRank: any[] = [];

  // sort for used to use +1 but no member id, later has member id
  results.sort((a: any, b: any) => {
    if (a['player'].attendeeMemberId && !b['player'].attendeeMemberId) {
      return -1;
    } else if (b['player'].attendeeMemberId && !a['player'].attendeeMemberId) {
      return 1;
    } else if (a['player'].memberId && !a['player'].attendeeName) {
      return -1;
    } else {
      return 0;
    }
  });

  for (const result of results) {
    const displayName = result['player'].displayName;
    const attendeeName = result['player'].attendeeName;
    const name = attendeeName ?? displayName;
    const gender = result['player'].attendeeGender ?? result['player'].gender;
    const memberId = result['player'].memberId;
    const attendeeMemberId = result['player'].attendeeMemberId;
    if (attendeeMemberId) {
      const matchIndexByMemberId = matchRank.findIndex(item => item.memberId === attendeeMemberId);
      if (matchIndexByMemberId >= 0) {
        matchRank[matchIndexByMemberId].array.push(result);
        matchRank[matchIndexByMemberId].wins += result.wins;
        matchRank[matchIndexByMemberId].lost += result.lost;
        matchRank[matchIndexByMemberId].powerOfBattle += result.powerOfBattleChange;
        matchRank[matchIndexByMemberId].pointDifference += result.pointDifference;
      } else {
        matchRank.push({
          name: name,
          gender: gender,
          memberId: attendeeMemberId,
          wins: result.wins,
          lost: result.lost,
          powerOfBattle: result.powerOfBattleChange,
          pointDifference: result.pointDifference,
          array: [result]
        })
      }
    } else {
      // fix for duplicate name e.g. Lee
      if (!attendeeName && memberId) {
        const matchIndexByMemberId = matchRank.findIndex(item => item.memberId === memberId);
        if (matchIndexByMemberId >= 0) {
          matchRank[matchIndexByMemberId].array.push(result);
          matchRank[matchIndexByMemberId].wins += result.wins;
          matchRank[matchIndexByMemberId].lost += result.lost;
          matchRank[matchIndexByMemberId].powerOfBattle += result.powerOfBattleChange;
          matchRank[matchIndexByMemberId].pointDifference += result.pointDifference;
        } else {
          matchRank.push({
            name: name,
            gender: gender,
            memberId: memberId,
            wins: result.wins,
            lost: result.lost,
            powerOfBattle: result.powerOfBattleChange,
            pointDifference: result.pointDifference,
            array: [result]
          })
        }

      } else {
        const matchIndex = matchRank.findIndex(item => item.name === name);
        if (matchIndex >= 0) {
          matchRank[matchIndex].array.push(result);
          matchRank[matchIndex].wins += result.wins;
          matchRank[matchIndex].lost += result.lost;
          matchRank[matchIndex].powerOfBattle += result.powerOfBattleChange;
          matchRank[matchIndex].pointDifference += result.pointDifference;
        } else {
          matchRank.push({
            name: name,
            gender: gender,
            wins: result.wins,
            lost: result.lost,
            powerOfBattle: result.powerOfBattleChange,
            pointDifference: result.pointDifference,
            array: [result]
          })
        }
      }
    }
  }

  const sortMatchRank = matchRank.sort((a, b) => {
    if (b.powerOfBattle === a.powerOfBattle) {
      return b.pointDifference - a.pointDifference;
    }
    return b.powerOfBattle - a.powerOfBattle;
  });

  return sortMatchRank;
}

// table of MatchRank

export const AddMatchRankAsync = async (matchRankToAdd: any) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    await RemoveMatchRankAsync(matchRankToAdd.weekNumber);
    await db.collection('MatchRank').add(matchRankToAdd);
  } catch (error) {
    console.log(error);
  }
}

export const RemoveMatchRankAsync = async (weekNumber: number) => {
  if (weekNumber) {
    try {
      const app = await GetCloudAsync();
      const db = app.database();
      await db.collection('MatchRank')
        .where({ weekNumber: weekNumber })
        .remove();
    } catch (error) {
      console.log(error);
    }
  }
}

export const GetMatchRankAsync = async (weekNumber: number) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    const _ = db.command;
    const result = await db.collection('MatchRank')
      .where({ weekNumber: _.in([weekNumber - 1, weekNumber]) })
      .orderBy("weekNumber", "asc")
      .get();
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}