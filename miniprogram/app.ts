import { GetUnionIdAsync, InitDatabaseAsync } from "@API/databaseService";

// app.ts
App<IAppOption>({
  globalData: {},
  async onLaunch() {
    await InitDatabaseAsync();
    const UnionId = await GetUnionIdAsync();
    console.log(UnionId);
  },
})