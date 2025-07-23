import { HandleException } from "@API/commonHelper";
import { InitDatabaseAsync } from "@API/databaseService";
import CheckUpdateVersion from "@API/versionService";

App<IAppOption>({
  globalData: {},
  async onLaunch() {
    CheckUpdateVersion();
    await InitDatabaseAsync();
  },

  async onError(msg) {
    await HandleException("Global error:", msg)
  }
})