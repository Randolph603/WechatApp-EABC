import { LoadAllEventsAsync } from "@API/eventService";
import { GetLaguageMap } from "@Language/languageUtils";
import { ToDayOfWeekString, ToNZDateString, ToNZShortDateString, ToNZTimeString } from "@Lib/dateExtension";
import { ExcuteWithLoadingAsync } from "@Lib/utils";

Page({
  data: {
    // Static
    _lang: GetLaguageMap().creditHistory,
    // Status:
    isLoaded: false,
    // Variables
    list: [] as any[]
  },

  async onLoad() {
    await ExcuteWithLoadingAsync(async () => {
      const list = await LoadAllEventsAsync();
      list.forEach((item: any) => {
        item.event = item.eventDate
          ? `${ToNZShortDateString(item.eventDate)} (${ToDayOfWeekString(item.eventDate)})`
          : '';
        item.dateForDisplay = `${ToNZDateString(item.date)} ${ToNZTimeString(item.date)}`;
      });

      this.setData({ isLoaded: true, list });
    });
  },


})