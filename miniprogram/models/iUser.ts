export interface iUser {
  avatarUrl: string;
  bankName: string;
  continueWeeklyJoin: number;
  createDate: string;
  creditBalance: number;
  creditHistory: any[];
  displayName: string;
}

export class ProfileModel {
  public displayName = '';
  public gender = 0;
  public userLevel = 0;

  constructor(fields?: Partial<ProfileModel>) {
    if (fields) {
      const allowedKeys = ['displayName', 'gender', 'userLevel'];
      for (const key of allowedKeys) {
        if (key in fields) {
          (this as any)[key] = (fields as any)[key];
        }
      }
    }
  }
}