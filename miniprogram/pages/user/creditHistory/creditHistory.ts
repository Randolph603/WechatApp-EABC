import { GetUserByMemberId } from "@API/userService";
import { GetLaguageMap } from "@Language/languageUtils";
import { SortDateDesc, ToDayOfWeekString, ToNZShortDateString } from "@Lib/dateExtension";
import { ExcuteWithLoadingAsync, GetNavBarHeight } from "@Lib/utils";

Page({
  data: {
    // Static
    _lang: GetLaguageMap().creditHistory,
    navBarHeight: GetNavBarHeight() + 100,
    // Status:
    isLoaded: false,
    // Variables
    creditHistory: [] as any[]
  },

  async onLoad(options: Record<string, string | undefined>) {
    const { memberId } = options;
    const id = Number(memberId);
    await ExcuteWithLoadingAsync(async () => {
      const user = await GetUserByMemberId(id);
      if (user && user.creditHistory) {
        const creditHistory = user.creditHistory.sort((a: any, b: any) => SortDateDesc(a.date, b.date)).map((h: any) => {
          const historyDayOfWeek = ToDayOfWeekString(h.date);
          const historyDate = ToNZShortDateString(h.date);
          const date = `${historyDate} ${historyDayOfWeek}`;
          const title = h.title;

          let value = '';
          let pos = false;
          if (h.value > 0) {
            value = `+ ${h.value}`;
            pos = true;
          } else {
            value = h.value;
            pos = false;
          }
          return { title, date, value, pos };
        })
        this.setData({ creditHistory });
      }
    });

    this.setData({ isLoaded: true });
  },


})