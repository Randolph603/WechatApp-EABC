import { CallCloudFuncAsync } from "@API/commonHelper";
import { AddMatchRankAsync, GetAllResultsAsync } from "@API/matchService";
import { getCurrentWeekSpan } from "@Lib/dateExtension";
import { ExcuteWithProcessingAsync } from "@Lib/utils"

Page({
  data: {},
  onLoad() { },

  async updateContinueWeeklyJoin() {
    await ExcuteWithProcessingAsync(async () => {
      await CallCloudFuncAsync('eabc_update_weekly', {});
    });
  },

  async updateMatchResultWeekly() {
    await ExcuteWithProcessingAsync(async () => {
      const weeks = getCurrentWeekSpan();
      const results = await GetAllResultsAsync();
      const data = {
        weekNumber: weeks,
        generalRank: results
      }
      await AddMatchRankAsync(data);
    });
  }
})