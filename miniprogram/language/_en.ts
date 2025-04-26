module.exports.languageMap = {
  tabbar: {
    list: [
      { text: 'Activities' },
      { text: 'Hot Rank' },
      { text: 'My' },
    ]
  },
  type: {
    gender: {
      choose: "Please choose",
      male: "Male",
      female: "Female",
    },
    userLevel: {
      choose: "Please choose",
      d: "D - Beginner (Bronze)",
      c: "C - Junior (Silver",
      b: "B - Intermediate（Gold）",
      a: "A - Senior（Platinum）",
      s: "S - Glitter (Diamond)",
      sr: "SR - Epic (Master)",
      ssr: "SSR -Legendary (Challenger)",
    },
    userLevelDisplay: {
      choose: "Not choose",
      d: "Bronze",
      c: "Silver",
      b: "Gold",
      a: "Platinum",
      s: "Diamond",
      sr: "Master",
      ssr: "Challenger",
    }
  },
  utils: {
    loading: "Loading...",
    updating: "Updating...",
    success: "Success!",
    failed: "Failed!"
  },
  my: {
    "title": "Profile Centre",
    "register": "One-click login",
    "memberId": "Member Id",
    "continueWeeklyJoin": "Continue Weekly Join",
    "week": "Week",
    "wallet": "My Wallet",
    "information": "My Information",
    "history": "History",
    "topup": "Top Up",
    "cashback": "Cash Back",
    "memberCard": "My Member Card",
    "contactUs": "Contact Us",
    "adminSetting": "Admin Settings",
    topUpTitle: "Bank Transfer",
    topUpAccount: "Transfer",
    topUpRef: "Ref",
    topUpTip: "Please ref your member id or name, it will take 1-2 working days.",
    topUpCancel: "Cancel",
    topUpCopy: "Copy Account"
  },
  userProfile: {
    title: "Basic Information",
    memberId: "Member Id",
    noMemberId: "Automatically generated after registration",
    avatar: "Avatar",
    setAvatar: "Set Avatar",
    nickName: "Nick Name",
    nickNamePlaceholder: "Type in...",
    gender: "Gender",
    level: "Level",
    save: "Save",
    register: "Register"
  },
  creditHistory: {
    title: "History",
    noHistory: "No records",
  },
  hotRank: {
    "title": "Hot Rank",
    "description": "Earning hot points when attend badminton games."
  },
  activityList: {
    title: "Activity List",
    tabs: {
      all: "All",
      happy: "Happy",
      group: "Group",
      my: "My"
    },
    area: "East",
    address: "Address",
    date: "Date",
    attendee: "Attendees"
  },
  activityDetail: {
    title: "Activity Details",
    shareMessage: "Click the page to join!",
    area: "East",
    view: "View",
    share: "Share",
    court: "Court",
    courtSuffix: "",
    address: "Address",
    fee: "Fee",
    feeSuffix: "PP",
    discount: "Discount: Continuous activities",
    week: "weeks",
    equipment: "Equipment: Please bring your own badminton racket and shoe",
    facility: "Facility: Changing room, toilet, shower",
    member: "members",
    down: "Down",
    up: "Up",
    backUpJoin: "Back up registration (auto joined when someone cancelled)",
    activity: "Activity",
    my: "My",
    contact: "Consult",
    share: "Share",
    join: "Join Now",
    cancel: "Cancel",
    cancelPolicy: "Cancel 24 hours in advance",
    joinMore: "JoinMore",
    cancelWarningTitle: "Cancel Notification",
    cancelWarningDesc: "Cancellations without a substitute within 24 hours before the event will be subject to normal fee deductions. It’s not easy to organize events, I hope you understand!",
    cancelWarningTips: "In special circumstances, please contact the group owner.",
    lowCreditBalanceTitle: "Low Balance Notification",
    lowCreditBalanceDesc: "Friendly reminder: Your current balance is：",
  }
}
module.exports.attendTitle = (a, b) => `${a} members joined, ${b} in total.`;
