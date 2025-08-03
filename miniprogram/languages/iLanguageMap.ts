interface iLanguageMap {
  tabbar: {
    list: { text: string }[]
  },
  type: {
    gender: any,
    selfRatingLevels: { level: number; title: string, content: string }[];
    userLevel: any,
    userLevelDisplay: any,
    activityType: {
      section: string,
      rank: string,
      tournament: string
    },
  },
  utils: {
    processing: string,
    loading: string,
    updating: string,
    success: string,
    failed: string
  },
  my: {
    // "title": string,
    // "register": string,
  };
  userProfile: {
    title: string;
    memberId: string;
    noMemberId: string;
    avatar: string;
    setAvatar: string;
    displayName: string;
    displayNamePlaceholder: string;
    gender: string;
    level: string;
    required: string;
    save: string;
    register: string;
    selfRatingLevelTitle: string;
  },
  creditHistory: any,
  hotRank: any,
  activityList: any,
  activityDetail: any
}