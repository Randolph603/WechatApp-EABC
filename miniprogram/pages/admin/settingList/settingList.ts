import { CallCloudFuncAsync } from "@API/commonHelper";
import { ExcuteWithProcessingAsync } from "@Lib/utils"

Page({
  data: {},
  onLoad() { },

  async updateContinueWeeklyJoin() {
    await ExcuteWithProcessingAsync(async () => {
      await CallCloudFuncAsync('eabc_update_weekly', {});
    });
  }
})