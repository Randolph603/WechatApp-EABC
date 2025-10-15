import { CallCloudFuncAsync, RemoveFieldsAsync, UpdateRecordAsync } from "./commonHelper";
import { SortDate, ToDayOfWeekString, ToNZDateString, ToNZShortDateString } from "@Lib/dateExtension";
import { GetCloudAsync, GetUnionIdAsync } from "./databaseService";
import { ActivityModel } from "@Model/Activity";
import { SetupUserTypes } from "./userService";

//#region Activity

const SetupActivity = (activity: any) => {
  activity.startTime = new Date(activity.startTime);
  activity.updateDate = new Date(activity.updateDate);
  activity.coverImageSrc = "/static/images/" + activity.coverImage;
  activity.startTimeDate = ToNZDateString(activity.startTime);
  activity.date = `${ToNZShortDateString(activity.startTime)} (${ToDayOfWeekString(activity.startTime)})`;
}

export const GetNewActivity = () => {
  const activity = new ActivityModel();
  SetupActivity(activity);
  return activity;
}

export const LoadAllActivitiesAsync = async (limit: number = 20, type: string | undefined, onlyPublic: boolean | undefined) => {
  let data = {
    where: { isCancelled: false, type: type, toPublic: onlyPublic },
    sort: { startTime: -1 },
    limit: limit,
  };
  const { activities } = await CallCloudFuncAsync('activity_search', data)
  activities.forEach(SetupActivity);
  return activities;
}

export const LoadActivityAndMatchesByIdAsync = async (id: string, includeCancelledAttendees: boolean, recordEvent: boolean) => {
  const unionId = await GetUnionIdAsync();
  let data = {
    unionId: unionId,
    recordEvent: recordEvent,
    activityId: id,
    includeCancelledAttendees: includeCancelledAttendees
  };

  const { activity, matches, matchResults } = await CallCloudFuncAsync('eabc_activity_getById', data);
  SetupActivity(activity);

  activity.Attendees.forEach((user: any) => {
    SetupUserTypes(user);
    user.userLevelImageSrc = `/static/ranks/${user.userLevel + 1}.png`;
  });

  activity.Attendees.sort((a: { updateDate: any; }, b: { updateDate: any; }) => SortDate(a.updateDate, b.updateDate));

  // group and match
  const courtMatchesMap = {} as any;
  for (const match of matches) {
    const court = match.court;
    if (!courtMatchesMap[court]) {
      courtMatchesMap[court] = [];
    }
    courtMatchesMap[court].push(match);
  }

  // match result
  const matchResultMap = {} as any;
  for (const result of matchResults) {
    const court = result.court;
    if (!matchResultMap[court]) {
      matchResultMap[court] = [];
    }
    matchResultMap[court].push(result);
  }

  return { activity, courtMatchesMap, matchResultMap };
}

export const AddActivityAsync = async (activityToAdd: ActivityModel) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    const result = await db.collection('Activities').add(activityToAdd);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//#endregion

//#region Attendee
export const AutoJoinActivityAsync = async (activityId: string, memberId: number, sectionIndex: number) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    await db.collection('Attendees').add({
      activityId: activityId,
      memberId: memberId,
      isCancelled: false,
      createDate: new Date(),
      updateDate: new Date(),
      joinMore: 0,
      sectionIndex: sectionIndex
    });
  } catch (error) {
    console.log(error);
  }
}

export const JoinActivityAsync = async (activityId: string, memberId: number, joinMore: number) => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    const updatedCount = await UpdateRecordAsync('Attendees',
      { activityId: activityId, memberId: memberId, joinMore: joinMore },
      { isCancelled: false },
      { updateDate: JSON.stringify(new Date()) }
    );
    if (updatedCount === 0) {
      await db.collection('Attendees').add({
        activityId: activityId,
        memberId: memberId,
        isCancelled: false,
        createDate: new Date(),
        updateDate: new Date(),
        joinMore: joinMore,
        sectionIndex: 0
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const CancelJoinActivityAsync = async (activityId: string, memberId: number, joinMore: number | undefined) => {
  try {
    await UpdateRecordAsync('Attendees',
      { activityId: activityId, memberId: memberId, joinMore: joinMore },
      { isCancelled: true },
      { updateDate: JSON.stringify(new Date()) }
    );
  } catch (error) {
    console.log(error);
  }
}

export const AttendeeMoveSectionAsync = async (activityId: string, memberId: number, joinMore: number, sectionIndex: number) => {
  try {
    await UpdateRecordAsync('Attendees',
      { activityId: activityId, memberId: memberId, joinMore: joinMore },
      { sectionIndex: sectionIndex },
      { updateDate: JSON.stringify(new Date()) }
    );
  } catch (error) {
    console.log(error);
  }
}

export const UpdateAttendeeMoreAsync = async (attendeeId: string, attendeeName: string, attendeeGender: number, attendeeMemberId: number) => {
  if (attendeeId) {
    try {
      await UpdateRecordAsync('Attendees',
        { _id: attendeeId },
        {
          attendeeName,
          attendeeGender,
          attendeeMemberId
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}

//#endregion

export const ConfrimActivityAsync = async (activityId: string, confirmToBeUsers: any[]) => {
  const data = {
    activityId: activityId,
    confirmToBeUsers: confirmToBeUsers,
  };
  const { updatedCount } = await CallCloudFuncAsync('eabc_activity_confirm', data);
  return updatedCount;
}

export const UpdateAttendeeCourtAsync = async (activityId: string, memberId: number, joinMore: number, powerOfBattle: number, court: number) => {
  try {
    await UpdateRecordAsync('Attendees',
      { activityId: activityId, memberId: memberId, joinMore: joinMore },
      { court, currentPowerOfBattle: powerOfBattle }
    );
  } catch (error) {
    console.log(error);
  }
}

export const RemoveAttendeeCourtAsync = async (activityId: string, sectionIndex: number) => {
  try {
    await RemoveFieldsAsync('Attendees',
      { activityId: activityId, sectionIndex: sectionIndex },
      ['court']
    );
  } catch (error) {
    console.log(error);
  }
}

export const UpdateCurrentPowerOfBattleAsync = async (activityId: string, memberId: number, joinMore: number,
  currentPowerOfBattle: number) => {
  try {
    await UpdateRecordAsync('Attendees',
      { activityId: activityId, memberId: memberId, joinMore: joinMore },
      { currentPowerOfBattle: currentPowerOfBattle }
    );
  } catch (error) {
    console.log(error);
  }
}