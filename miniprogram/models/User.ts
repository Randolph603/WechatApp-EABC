import { ToNZDateString } from "@Lib/dateExtension";
import { UserBadges } from "@Lib/types";
import { GetRandomIdentityId } from "@Lib/utils";

export interface iBadge {
  // Store in db
  id: string;
  createDate: Date;
  type: number;

  // Help to display
  title: string;
  createDateString: string;
}

export class BadgeModel {
  public id = GetRandomIdentityId();
  public createDate = new Date();
  public createDateString = ToNZDateString(this.createDate);
  public type = UserBadges.Continue5Weeks.type;
  public title = UserBadges.Continue5Weeks.title;

  constructor(fields?: Partial<BadgeModel>) {
    if (fields) {
      const allowedKeys = ['id', 'createDate', 'type', 'title'];
      for (const key of allowedKeys) {
        if (key in fields) {
          (this as any)[key] = (fields as any)[key];
        }
      }
    }
  }
}

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
  selfRatingLevel: number;
  unionId: string;
  updateDate: Date;
  userLevel: number;
  userRole: number;
  badges: Array<iBadge>;

  // Help to display
  userRoleType: object;
  userLevelType: object;
  genderType: object;
  discount: number;
}

export class ProfileModel {
  public displayName = '';
  public gender = 0;
  public selfRatingLevel = 0;

  constructor(fields?: Partial<ProfileModel>) {
    if (fields) {
      const allowedKeys = ['displayName', 'gender', 'selfRatingLevel'];
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
  public powerOfBattle = 0;
  public badges: Array<iBadge> = [];

  constructor(fields?: Partial<ProfileModel>) {
    if (fields) {
      const allowedKeys = ['displayName', 'bankName', 'userRole', 'gender', 'userLevel',
        'creditBalance', 'powerPoint', 'continueWeeklyJoin', 'powerOfBattle'];
      for (const key of allowedKeys) {
        if (key in fields) {
          (this as any)[key] = (fields as any)[key];
        }
      }
    }
  }
}