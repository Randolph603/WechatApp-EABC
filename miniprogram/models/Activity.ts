import { ToNZTimeRangeString, ToNZTimeString } from "@Lib/dateExtension";
import { ActivityType, ConverPageArray } from "@Lib/types";

export interface iSection {
  courts: Array<number>;
  during: number;
  index: number;
  isLocked: boolean;
  maxAttendee: number;
  price: number;
  time: string;
  timeRange: string;
  title: string;
}

export interface iActivity {
  // Store in db
  address: string;
  courts: Array<number>;
  coverImage: string;
  isCancelled: boolean;
  isCompleted: boolean;
  maxAttendee: number;
  organizerMemberId: number;
  sections: Array<iSection>;
  shareCount: number;
  startTime: Date;
  title: string;
  toPublic: boolean;
  type: number;
  updateDate: Date;
  viewCount: number;

  // Help to display
  startTimeDate: string;
  typeValue: object;
  coverImageSrc: string;
}

const today = new Date();
today.setHours(19);
today.setMinutes(30);

const newSection: iSection = {
  courts: [1, 2, 3, 4],
  during: 120,
  index: 0,
  isLocked: false,
  maxAttendee: 24,
  price: 17,
  time: ToNZTimeString(today),
  timeRange: ToNZTimeRangeString(today, 120),
  title: '娱乐区',
}

// Used to save to db
export class ActivityModel {
  public address = 'Lloyd Elsmore Park Badminton';
  public courts: Array<number> = [5, 6, 7, 8];
  public coverImage = ConverPageArray[0];
  public isCancelled = false;
  public isCompleted = false;
  public maxAttendee = newSection.maxAttendee;
  public organizerMemberId = 10024;
  public sections: iSection[] = [newSection];
  public shareCount = 0;
  public startTime = today;
  public title = '双打羽毛球';
  public toPublic = true;
  public type = ActivityType.Section.value;
  public updateDate = today;
  public viewCount = 0;

  constructor(fields?: Partial<ActivityModel>) {
    if (fields) {
      const allowedKeys = ['address', 'courts', 'coverImage', 'isCancelled', 'isCompleted',
        'maxAttendee', 'organizerMemberId', 'sections', 'shareCount', 'startTime', 'title',
        'toPublic', 'type', 'updateDate', 'viewCount'];

      for (const key of allowedKeys) {
        if (key in fields) {
          (this as any)[key] = (fields as any)[key];
        }
      }
    }
  }
}