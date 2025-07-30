interface iLanguageMap {
  tabbar: {
    list: { text: string }[]
  },
  type: {
    gender: any,
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
  userProfile: any,
  creditHistory: any,
  hotRank: any,
  activityList: any,
  activityDetail: any
}