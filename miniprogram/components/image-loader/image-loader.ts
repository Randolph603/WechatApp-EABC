Component({
  externalClasses: ['ext-class'],
  properties: {
    defaultLoadingSrc: String,
    src: String,
    width: String,
    height: String,
    mode: String,
    borderRadius: String
  },
  data: {
    finishLoadFlag: false
  },
  methods: {
    finishLoad: function () {
      this.setData({
        finishLoadFlag: true
      })
    },
    onTaped: function () {
      this.triggerEvent('onTap')
    }
  }
})
