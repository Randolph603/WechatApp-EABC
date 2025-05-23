import { GetLaguageMap } from "@Language/languageUtils";

const lang = GetLaguageMap().type;

const activityType = {
  Happy: { value: 'happy', name: '娱乐场' },
  Group: { value: 'group', name: '分组场' },
  Rank: { value: 'rank', name: '排位场' },
};
export const ActivityType = activityType;
export const ActivityTypeArray = [activityType.Happy, activityType.Group, activityType.Rank];

const userRole = {
  Unknown: { value: 0, name: 'New' },
  Admin: { value: 1, name: 'Admin' },
  Manager: { value: 2, name: 'Manager' },
  ActiveUser: { value: 3, name: 'Active' },
  InActiveUser: { value: 4, name: 'InActive' },
};
export const UserRole = userRole;
export const UserRoleArray = [userRole.Unknown, userRole.Admin, userRole.Manager, userRole.ActiveUser, userRole.InActiveUser];

const userLevel = {
  Unknown: { value: 0, name: lang.userLevel.choose, displayName: lang.userLevelDisplay.choose },
  D: { value: 1, name: lang.userLevel.d, displayName: lang.userLevelDisplay.d },
  C: { value: 2, name: lang.userLevel.c, displayName: lang.userLevelDisplay.c },
  B: { value: 3, name: lang.userLevel.b, displayName: lang.userLevelDisplay.b },
  A: { value: 4, name: lang.userLevel.a, displayName: lang.userLevelDisplay.a },
  S: { value: 5, name: lang.userLevel.s, displayName: lang.userLevelDisplay.s },
};
export const UserLevel = userLevel;
export const LevelArray = [userLevel.Unknown, userLevel.D, userLevel.C, userLevel.B, userLevel.A, userLevel.S];

const userGender = {
  Unknown: { value: 0, name: lang.gender.choose },
  Male: { value: 1, name: lang.gender.male },
  Female: { value: 2, name: lang.gender.female },
};
export const UserGender = userGender;
export const UserGenderArray = [userGender.Unknown, userGender.Male, userGender.Female];
