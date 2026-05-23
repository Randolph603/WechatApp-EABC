import { GetCloudAsync, GetUnionIdAsync } from "./databaseService";
import { config } from "../configs/index";
import { UserRoleArray, LevelArray, UserBadgesArray, UserBadgesMap } from "@Lib/types";
import { ConvertFileIdToHttps, GetRandomIdentityId } from "@Lib/utils";
import { WxGetFileInfoAsync } from "@Lib/promisify";
import { CallCloudFuncAsync, HandleException } from "./commonHelper";
import { BadgeModel, iBadge } from "@Model/User";
import { ToNZDateString } from "@Lib/dateExtension";

export const SetupUserTypes = (user: any) => {
  if (user.avatarUrl.startsWith('cloud')) {
    user.avatarUrl = ConvertFileIdToHttps(user.avatarUrl);
  }
  user.userRoleType = UserRoleArray[user.userRole];
  user.userLevelType = LevelArray[user.userLevel];
  user.discount = (user.continueWeeklyJoin ?? 0) > config.maxDiscount
    ? config.maxDiscount
    : user.continueWeeklyJoin;

  if (user.badges) {
    user.badges = user.badges.map((b: any) => SetupUserBadges(b));
  }
}

export const SetupUserBadges = (badge: BadgeModel) => {
  const title = UserBadgesMap[badge.type].title;
  const createDateString = ToNZDateString(badge.createDate);
  const badgeForDisplay: iBadge = { ...badge, title, createDateString };
  return badgeForDisplay;
}

export const RegisterNewUserAsync = async (parentMemberId: string) => {
  const unionId = parentMemberId ? "SubAccount-" + GetRandomIdentityId() : await GetUnionIdAsync();
  return await CallCloudFuncAsync('eabc_user_register', { unionId });
}

export const CheckUserExistsAsync = async () => {
  const unionId = await GetUnionIdAsync();
  const app = await GetCloudAsync();
  const db = app.database();
  const profiles = await db.collection("UserProfiles").where({ unionId }).get();
  const user = profiles.data.find(d => d.unionId = unionId);

  if (user) {
    SetupUserTypes(user);
  }
  return {
    unionId: unionId,
    userProfile: config.mockNewUser ? null : user
  };
}

export const GetUserByMemberId = async (memberId: number) => {
  const app = await GetCloudAsync();
  const db = app.database();
  const profiles = await db.collection("UserProfiles").where({ memberId }).get();
  const user = profiles.data.find(d => d.memberId = memberId);
  if (user) {
    SetupUserTypes(user);
  }
  return user;
}

export const GetSubUsersByParentMemberId = async (parentMemberId: number) => {
  const app = await GetCloudAsync();
  const db = app.database();
  const profiles = await db.collection("UserProfiles").where({ parentMemberId }).get();
  const subUsers = profiles.data ?? [];
  for (const user of subUsers) {
    SetupUserTypes(user);
  }
  return subUsers;
}

export const UploadAvatarImageAsync = async (filePath: string, memberId: number, avatarFileToDelete: string | null): Promise<any> => {
  try {
    const fileRes = await WxGetFileInfoAsync({ filePath });
    if (fileRes.size > 1024 * 1024 * 2) {
      wx.showToast({
        title: 'No more than 2MB',
        icon: 'none'
      })
    } else if (memberId) {
      const random6String = (Math.random() + 1).toString(36).substring(7);
      const fileTypeArray = filePath.match(/\.[^.]+?$/);
      const fileType = fileTypeArray ? fileTypeArray[0] : '';
      const cloudPath = 'avatar/' + memberId + '-' + random6String + '-' + fileType;
      const app = await GetCloudAsync();
      const result = await app.uploadFile({
        cloudPath,//云存储图片名字
        filePath,//临时路径
        method: 'post'
      });

      if (avatarFileToDelete) {
        await app.deleteFile({ fileList: [avatarFileToDelete] });
      }
      return result;
    }
    return null;
  } catch (error: any) {
    console.log(error);
    await HandleException('UploadAvatarImageAsync', error)
    return null;
  }
}

export const SearchUsersForRankAsync = async () => {
  const { users } = await CallCloudFuncAsync('user_search', {
    sort: { powerPoint: -1 },
    limit: 20
  });
  users.forEach((u: any) => SetupUserTypes(u));
  return users;
}

export const SearchUsersByKeyAsync = async (searchText: string, limit: number) => {
  const { users } = await CallCloudFuncAsync('user_search', {
    searchText: searchText,
    limit: limit
  });
  users.forEach((u: any) => SetupUserTypes(u));
  return users;
}

export const SearchUsersSortByContinuelyWeeksAsync = async () => {
  const app = await GetCloudAsync();
  const db = app.database();
  const _ = db.command;
  const { users } = await CallCloudFuncAsync('user_search', {
    where: { continueWeeklyJoin: _.gt(0) },
    limit: 100,
    sort: { continueWeeklyJoin: -1 }
  });
  users.forEach((u: any) => SetupUserTypes(u));
  return users;
}

export const SearchAllUsersAsync = async () => {
  const { users } = await CallCloudFuncAsync('user_search', {
    sort: { continueWeeklyJoin: -1, memberId: -1 }
  });
  users.forEach((u: any) => SetupUserTypes(u));
  return users;
}

export const creditTransferAsync = async (value: number, from: { memberId: number, name: string }, to: { memberId: number, name: string }) => {
  const fromTitle = `to ${to.name}(${to.memberId})`;
  const toTitle = `from ${from.name}(${from.memberId})`;
  await CallCloudFuncAsync('user_balanceChange', {
    list: [
      { memberId: from.memberId, title: fromTitle, value: -value },
      { memberId: to.memberId, title: toTitle, value: value },
    ]
  });
}
