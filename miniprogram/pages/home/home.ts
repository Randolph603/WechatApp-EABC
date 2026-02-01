import { LoadAllActivitiesAsync } from "@API/activityService";
import { HandleException } from "@API/commonHelper";
import { CheckUserExistsAsync } from "@API/userService";
import { GetLaguageMap } from "@Language/languageUtils";
import { GetNavBarHeight, UpdateTabBarLaguage } from "@Lib/utils";

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList,
    navBarHeight: GetNavBarHeight() + 10,
    // Status:
    isLoaded: false,
    triggered: false,
    // Variables   
    activities: [],
  },

  onShareAppMessage() { },

  async onLoad() {
    UpdateTabBarLaguage();

    try {
      if (this.data.activities.length === 0) {
        await this.reloadAllAsync();
      }
    } catch (error) {
      await HandleException('onLoad', error)
    }
  },

  //#region private method

  async reloadAllAsync() {
    try {
      this.setData({ isLoaded: false });
      await this.fetchAllDataAsync();
    } catch (error) {
      await HandleException('HomePage-FirstTimeTry', error);
      try {
        await this.fetchAllDataAsync();
      } catch (error) {
        await HandleException('HomePage-SecondTimeTry', error);
        throw error;
      }
      throw error;
    }
    finally {
      this.setData({ isLoaded: true, triggered: false });
    }
  },

  async fetchAllDataAsync() {
    const activities = await LoadAllActivitiesAsync(6, undefined, true);
    const { userProfile: myProfile } = await CheckUserExistsAsync();    
    if (myProfile) {
      for (const activity of activities) {
        activity.isJoined = activity.Attendees.some((a: any) => a.memberId === myProfile.memberId && !activity.isCompleted);
      }
    }
    this.setData({ activities: activities });
  },

  //#endregion
})