Component({
  externalClasses: ['my-class'],
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
    finishLoad: function (e) {
      this.setData({
        finishLoadFlag: true
      })
    },
    onTaped: function(e){
     this.triggerEvent('onTap')
    }
  }
})
