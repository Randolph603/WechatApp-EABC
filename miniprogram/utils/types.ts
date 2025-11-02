import { GetLaguageMap } from "@Language/languageUtils";

const lang = GetLaguageMap().type;

const activityType = {
  Section: { index: 0, value: 'section', name: lang.activityType.section },
  Rank: { index: 1, value: 'rank', name: lang.activityType.rank },
  Tournament: { index: 2, value: 'tournament', name: lang.activityType.tournament },
};
export const ActivityType = activityType;
export const ActivityTypeArray = [activityType.Section, activityType.Rank, activityType.Tournament];
export const ActivityTypeMap = {
  [`${activityType.Section.value}`]: activityType.Section,
  [`${activityType.Rank.value}`]: activityType.Rank,
  [`${activityType.Tournament.value}`]: activityType.Tournament,
}

export const ConverPageArray = [
  'badmintonCover1.jpg',
  'badmintonCover2.jpg',
  'badmintonCover3.jpg',
];

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

export const userSelfRatingLevelMap = lang.selfRatingLevels.reduce((map, item) => {
  map[item.level] = item;
  return map;
}, {} as Record<number, typeof lang.selfRatingLevels[number]>);
export const userSelfRatingLevelArray = lang.selfRatingLevels;

const userGender = {
  Unknown: { value: 0, name: lang.gender.choose },
  Male: { value: 1, name: lang.gender.male },
  Female: { value: 2, name: lang.gender.female },
};
export const UserGender = userGender;
export const UserGenderArray = [userGender.Unknown, userGender.Male, userGender.Female];

const matchResultType = {
  SoloSingle: { index: 0, value: 'SoloSingle' },
  SoloDouble: { index: 1, value: 'SoloDouble' },
  FixedDouble: { index: 2, value: 'FixedDouble' },
  TournamentDouble: { index: 3, value: 'TournamentDouble' },
};
export const MatchResultType = matchResultType;