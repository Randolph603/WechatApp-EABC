export const LanguageMap: iLanguageMap = {
  tabbar: {
    list: [
      { text: '活动' },
      { text: '排名' },
      { text: '商城' },
      { text: '我的' },
    ]
  },
  type: {
    gender: {
      choose: "请选择",
      male: "男",
      female: "女",
    },
    userLevel: {
      choose: "请选择",
      d: "新手D级（倔强青铜）",
      c: "初级C级（秩序白银）",
      b: "中级B级（荣耀黄金）",
      a: "高级A级（尊贵铂金）",
      s: "大师S级 (永恒钻石)",
      sr: "精英SR级 (至尊星耀)",
      ssr: "传说SSR级 (荣耀王者)",
    },
    userLevelDisplay: {
      choose: "未选择",
      d: "倔强青铜",
      c: "秩序白银",
      b: "荣耀黄金",
      a: "尊贵铂金",
      s: "永恒钻石",
      sr: "至尊星耀",
      ssr: "荣耀王者",
    }
  },
  utils: {
    loading: "加载中...",
    updating: "更新中...",
    success: "操作成功",
    failed: "操作失败"
  },
  my: {
    "title": "个人中心",
    "register": "一键登录",
    "memberId": "会员号",
    "continueWeeklyJoin": "连续参加活动",
    "week": "周次",
    "wallet": "我的钱包",
    "information": "个人信息",
    "history": "历史记录",
    "topup": "充值",
    "cashback": "提现",
    "memberCard": "我的会员卡",
    "contactUs": "有困难找组织",
    "adminSetting": "管理员入口",
    topUpTitle: "银行转账",
    topUpAccount: "银行账户",
    topUpRef: "备注会员号",
    topUpTip: "备注会员号或者姓名, 1-2个工作日到账",
    topUpCancel: "返回",
    topUpCopy: "复制账号"
  },
  userProfile: {
    title: "基本信息",
    memberId: "会员号",
    noMemberId: "注册后自动生成",
    avatar: "头像",
    setAvatar: "设置头像",
    nickName: "昵称",
    nickNamePlaceholder: "请输入",
    gender: "性别",
    level: "级别",
    save: "保 存",
    register: "注 册"
  },
  creditHistory: {
    title: "历史记录",
    noHistory: "暂无记录",
  },
  hotRank: {
    "title": "活跃度排行榜",
    "description": "参加活动即可获得能量积分。"
  },
  activityList: {
    title: "活动列表",
    tabs: {
      all: "全部",
      happy: "娱乐",
      group: "分组",
      my: "我的"
    },
    area: "东区",
    address: "地点",
    date: "日期",
    attendee: "报名人数"
  },
  activityDetail: {
    title: "活动详情",
    shareMessage: "点击页面报名！",
    area: "东区",
    view: "浏览",
    share: "转发",
    court: "场地",
    courtSuffix: "号场地",
    address: "地点",
    fee: "费用",
    feeSuffix: "每人",
    discount: "优惠：连续活动",
    week: "周次",
    equipment: "装备: 请自备羽毛球拍，羽毛球鞋",
    facility: "设施：换衣间，卫生间，淋浴",
    member: "人",
    down: "下移",
    up: "上移",
    backUpJoin: "后补报名 (有取消，自动补上)",
    activity: "活动",
    my: "我的",
    contact: "咨询",
    join: "立即报名",
    cancel: "难过取消",
    cancelPolicy: "请提前24小时取消",
    joinMore: "追加报名",
    cancelWarningTitle: "取消提示",
    cancelWarningDesc: "活动开始前24小时内在没有替补的情况下取消将正常扣除费用。组织活动不易，望理解！",
    cancelWarningTips: "特殊情况请联系群主.",
    lowCreditBalanceTitle: "余额提示",
    lowCreditBalanceDesc: "友情提示：您当前的余额为：",
  }
}
export const AttendTitle = (a: number, b: number) => `已有${a}人报名，总名额共${b}人`;