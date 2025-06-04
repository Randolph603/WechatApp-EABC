import { GetCloudAsync, GetUnionIdAsync } from "./databaseService";
import { config } from "../configs/index";
import { GetUserByUnionId as MockGetUserByUnionId } from "../configs/mocks";
import { UserRoleArray, LevelArray, UserGenderArray } from "@Lib/types";
import { ConvertFileIdToHttps } from "@Lib/utils";
import { WxGetFileInfoAsync } from "@Lib/promisify";
import { CallCloudFuncAsync, UpdateRecordAsync } from "./commonHelper";

const SetupUserTypes = (user: any) => {
  if (user.avatarUrl.startsWith('cloud')) {
    user.avatarUrl = ConvertFileIdToHttps(user.avatarUrl);
  }
  user.userRoleType = UserRoleArray[user.userRole];
  user.userLevelType = LevelArray[user.userLevel];
  user.genderType = UserGenderArray[user.gender];
}

export const RegisterNewUserAsync = async () => {
  const unionId = await GetUnionIdAsync();
  return await CallCloudFuncAsync('eabc_user_register', { unionId });
}

export const GetUserByUnionId = async () => {
  if (config.useMock === true) {
    return MockGetUserByUnionId();
  }

  const unionId = await GetUnionIdAsync();
  const app = await GetCloudAsync();
  const db = app.database();
  const profiles = await db.collection("UserProfiles").where({ unionId }).get();
  const user = profiles.data.find(d => d.unionId = unionId);

  if (user) {
    SetupUserTypes(user);
  } else {
    // if user not exists, delete union id from storage
    wx.removeStorageSync('unionid');
  }
  return user;
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

export const UploadAvatarImageAsync = async (filePath: string, memberId: number, avatarUrl: string, formData = {}) => {
  try {
    const fileRes = await WxGetFileInfoAsync({ filePath });
    if (fileRes.size > 1024 * 1024 * 2) {
      wx.showToast({
        title: 'No more than 2MB',
        icon: 'none'
      })
    } else {
      if (memberId) {
        const random6String = (Math.random() + 1).toString(36).substring(7);
        const fileTypeArray = filePath.match(/\.[^.]+?$/);
        const fileType = fileTypeArray ? fileTypeArray[0] : '';
        const cloudPath = 'avatar/' + memberId + '-' + random6String + '-' + fileType;

        const app = await GetCloudAsync();
        // const UploadFileAsync = wxPromisify<any, any>(app.uploadFile); is not work
        app.uploadFile({
          cloudPath,//云存储图片名字
          filePath,//临时路径
          method: "post"
        })
          .then(async ({ fileID }) => {
            const updateData = { ...formData, avatarUrl: fileID };
            await UpdateRecordAsync('UserProfiles', { memberId }, updateData);
            await app.deleteFile({ fileList: [avatarUrl] });
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
}