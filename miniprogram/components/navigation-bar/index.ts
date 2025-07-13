Component({
  options: {
    multipleSlots: true
  },
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
  },
  
  data: {
  },

  attached() {
    const rect = wx.getMenuButtonBoundingClientRect()
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight: res.statusBarHeight,
          innerPaddingRight: `padding-right:${res.windowWidth - rect.left}px`,
          leftWidth: `width:${res.windowWidth - rect.left}px`,
          navBarHeight: rect.bottom + rect.top - res.statusBarHeight,
        })
      }
    })
  },

  methods: {
  }
})
