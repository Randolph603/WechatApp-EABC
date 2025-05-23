import { InitDatabaseAsync } from "@API/databaseService";
import CheckUpdateVersion from "@API/versionService";

App<IAppOption>({
  globalData: {},
  async onLaunch() {
    CheckUpdateVersion();
    await InitDatabaseAsync();
  },
})