import { GetCloudAsync } from "./databaseService";

export const LoadAllEventsAsync = async (): Promise<any> => {
  try {
    const now = new Date();
    const daysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const app = await GetCloudAsync();
    const db = app.database();
    const _ = db.command;
    const result = await db.collection('Events')
      .where({ date: _.gte(daysAgo as any).and(_.lte(now as any)) })
      .orderBy('date', 'desc')
      .skip(0)
      .limit(1000)
      .get();
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}