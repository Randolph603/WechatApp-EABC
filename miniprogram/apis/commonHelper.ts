import { GetLaguageMap } from '@Language/languageUtils';
import { GetDatabaseAsync } from './databaseService';

export const CallCloudFuncAsync = async (funcName: string, data: object) => {
  const app = await GetDatabaseAsync();
  const response = await app.callFunction({
    name: funcName,
    data: data
  });
  return response.result;
};

export const UpdateRecordAsync = async (collection: string, where: object, data: object, dateData: object, showLoading: boolean = true) => {
  var _lang = GetLaguageMap().utils;
  if (showLoading === true) {
    wx.showLoading({ title: _lang.updating });
  }

  const response = await wx.cloud.callFunction({
    name: 'updateRecord',
    data: {
      collection: collection,
      where: where,
      data: data,
      dateData: dateData
    }
  });

  if (typeof response.result === "string") {
    wx.showToast({
      title: response.result,
      icon: 'none',
    });
  } else if (response.result) {
    const updated = response.result.updatedCount > 0;
    if (updated === true) {
      wx.showToast({
        title: _lang.success,
        icon: 'success',
      });
    } else {
      wx.showToast({
        title: _lang.failed,
        icon: 'none',
      });
    }
  } else {
    wx.showToast({
      title: _lang.failed,
      icon: 'error',
    });
  }
};