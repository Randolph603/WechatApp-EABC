interface iSection {
  index: number; 
  title: string; 
  price: number;
  time: string;
  during: number;
  timeRange: string;
  maxAttendee: number;
}
export interface iActivity {
  title: string;
  type: string;
  address: string;
  courts: Array<number>;
  // maxAttendee: number;
  coverImageSrc: string;
  startTime: Date;
  updateDate: Date;
  // during: number;
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
    type: raw.type,
    address: raw.address,
    courts: raw.courts,
    // maxAttendee: raw.maxAttendee,
    coverImageSrc: raw.coverImageSrc,
    startTime: new Date(raw.startTime),
    updateDate: new Date(raw.updateDate),
    // during: raw.during,
    isCancelled: raw.isCancelled,
    isCompleted: raw.isCompleted,
    toPublic: raw.toPublic,
    sections: raw.sections,
    viewCount: raw.viewCount,
    shareCount: raw.shareCount
  } as iActivity;
}