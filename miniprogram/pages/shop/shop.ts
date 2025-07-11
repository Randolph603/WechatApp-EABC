import { GetLaguageMap } from "@Language/languageUtils";
import { UpdateTabBarLaguage } from "@Lib/utils";

const generateGridList = (childCount: number) => {
  const ans = []
  for (let i = 0; i < childCount; i++) {
    ans.push({
      id: Math.floor(Math.random() * childCount) + 1,
    })
  }
  return ans
}

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList,
    gridList: generateGridList(9),
  },

  async onLoad() {
    UpdateTabBarLaguage();
  },

  onReady() {

  },

  onShow() {
  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})