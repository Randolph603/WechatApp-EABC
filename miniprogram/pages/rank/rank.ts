import { UpdateTabBarLaguage } from "@Lib/utils";

// pages/rank/rank.ts
Page({

  /**
   * Page initial data
   */
  data: {
    rankList: [
      { rank: 4, name: "Rosie Nash", score: 24324, avatar: "/images/rosie.png" },
      { rank: 5, name: "Lucy Nguyen", score: 12324, avatar: "/images/lucy.png" },
      { rank: 6, name: "Birdie Potter", score: 4324, avatar: "/images/birdie.png" },
      { rank: 7, name: "Celia Brewer", score: 4324, avatar: "/images/celia.png" },
      { rank: 9, name: "Lizzie Rhodes", score: 3324, avatar: "/images/lizzie.png" },
    ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    UpdateTabBarLaguage();
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})