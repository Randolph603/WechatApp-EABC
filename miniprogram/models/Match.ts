// Used to save to db
export class MatchModel {
  public index = 0;
  public activityId = '';
  public court = 0;
  public player1: any = {};
  public player2: any = {};
  public leftScore = 0;
  public player3: any = {};
  public player4: any = {};
  public rightScore = 0;
  public isDeleted = false;

  constructor(fields?: Partial<MatchModel>) {
    if (fields) {
      const allowedKeys = ['index', 'activityId', 'court', 'player1', 'player2',
        'leftScore', 'player3', 'player4', 'rightScore', 'isDeleted'];

      for (const key of allowedKeys) {
        if (key in fields) {
          (this as any)[key] = (fields as any)[key];
        }
      }
    }
  }
}