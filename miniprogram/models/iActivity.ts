export interface iSection {
  index: number; 
  title: string; 
  price: number;
  time: string;
  during: number;
  timeRange: string;
  maxAttendee: number;
  courts: Array<number>;
  isLocked: boolean;
}
export interface iActivity {
  title: string;
  organizerMemberId: number;
  type: number;
  address: string;
  courts: Array<number>;
  maxAttendee: number;
  coverImage: string;
  startTime: Date;
  updateDate: Date;
  isCancelled: boolean;
  isCompleted: boolean;
  toPublic: boolean;
  sections: Array<iSection>;
  viewCount: number;
  shareCount: number;
}

export const ToActivity = (raw: any): iActivity => {
  return {
    title: raw.title,
    organizerMemberId: raw.organizerMemberId,
    type: raw.type,
    address: raw.address,
    courts: raw.courts,
    maxAttendee: raw.maxAttendee,
    coverImage: raw.coverImage,
    startTime: new Date(raw.startTime),
    updateDate: new Date(raw.updateDate),
    isCancelled: raw.isCancelled,
    isCompleted: raw.isCompleted,
    toPublic: raw.toPublic,
    sections: raw.sections,
    viewCount: raw.viewCount,
    shareCount: raw.shareCount
  } as iActivity;
}