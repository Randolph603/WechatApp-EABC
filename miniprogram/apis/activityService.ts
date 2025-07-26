import { CallCloudFuncAsync, RemoveFieldsAsync, UpdateRecordAsync } from "./commonHelper";
import { SortDate, ToDayOfWeekString, ToNZDateString, ToNZShortDateString } from "@Lib/dateExtension";
import { ActivityTypeArray, LevelArray } from "@Lib/types";
import { ConvertFileIdToHttps } from "@Lib/utils";
import { GetCloudAsync, GetUnionIdAsync } from "./databaseService";
import { ActivityModel } from "@Model/Activity";

const SetupActivity = (activity: any) => {
  activity.startTime = new Date(activity.startTime);
  activity.updateDate = new Date(activity.updateDate);
  activity.coverImageSrc = "/static/images/" + activity.coverImage;
  activity.startTimeDate = ToNZDateString(activity.startTime);
  activity.date = `${ToNZShortDateString(activity.startTime)} (${ToDayOfWeekString(activity.startTime)})`;
  activity.typeValue = ActivityTypeArray[activity.type];
}

export const GetNewActivity = () => {
  const activity = new ActivityModel();
  SetupActivity(activity);
  return activity;
}

export const LoadAllActivitiesAsync = async (limit: number = 20, onlyPublic: boolean | undefined) => {
  let data = {
    where: { isCancelled: false, type: undefined, toPublic: onlyPublic },
    sort: { startTime: -1 },
    limit: limit,
  };
  const { activities } = await CallCloudFuncAsync('activity_search', data)
  activities.forEach(SetupActivity);
  return activities;
}

export const LoadActivityAndMatchesByIdAsync = async (id: string, includeCancelledAttendees: boolean) => {
  const unionId = await GetUnionIdAsync();
  let data = {
    unionId: unionId,
    activityId: id,
    includeCancelledAttendees: includeCancelledAttendees
  };

  const { activity, matches } = await CallCloudFuncAsync('eabc_activity_getById', data);
  SetupActivity(activity);

  activity.Attendees.forEach((user: any) => {
    user.userLevelType = LevelArray[user.userLevel];
    user.key = `${user.memberId}+${user.joinMore}`;
    user.userLevelImageSrc = `/static/ranks/${user.userLevel + 1}.png`;
    if (user.avatarUrl.startsWith('cloud')) {
      user.avatarUrl = ConvertFileIdToHttps(user.avatarUrl);
    }
  });

  activity.Attendees.sort((a: { updateDate: any; }, b: { updateDate: any; }) => SortDate(a.updateDate, b.updateDate));

  return { activity, matches };
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

export const AddActivityAsync = async (activityToAdd: ActivityModel): Promise<any> => {
  try {
    const app = await GetCloudAsync();
    const db = app.database();
    const result = await db.collection('Activities').add(activityToAdd);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const ConfrimActivityAsync = async (activityId: string, confirmToBeUsers: any[]) => {
  const data = {
    activityId: activityId,
    confirmToBeUsers: confirmToBeUsers,
  };
  const { updatedCount } = await CallCloudFuncAsync('eabc_activity_confirm', data);
  return updatedCount;
}

export const UpdateAttendeeCourtAsync = async (activityId: string, memberId: number, joinMore: number,
  powerOfBattle: number, court: number) => {
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