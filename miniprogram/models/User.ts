export interface iUser {
  // Store in db
  avatarUrl: string;
  continueWeeklyJoin: number;
  createDate: Date;
  creditBalance: number;
  creditHistory: any[];
  displayName: string;
  gender: number;
  isDeleted: boolean;
  memberId: number;
  powerOfBattle: number;
  powerPoint: number;
  unionId: string;
  updateDate: Date;
  userLevel: number;
  userRole: number;

  // Help to display
  userRoleType: object;
  userLevelType: object;
  genderType: object;
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

export class UserModel {
  public displayName: string = '';
  public bankName: string | undefined = undefined;
  public userRole = 0;
  public gender = 0;
  public userLevel = 0;
  public creditBalance = 0;
  public powerPoint = 0;
  public continueWeeklyJoin = 0;

  constructor(fields?: Partial<ProfileModel>) {
    if (fields) {
      const allowedKeys = ['displayName', 'bankName', 'userRole', 'gender', 'userLevel',
        'creditBalance', 'powerPoint', 'continueWeeklyJoin'];
      for (const key of allowedKeys) {
        if (key in fields) {
          (this as any)[key] = (fields as any)[key];
        }
      }
    }
  }
}