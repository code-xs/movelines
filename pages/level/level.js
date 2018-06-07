var app = getApp()
Page({
  data: {
    level:[],
    lockLevel:0,
    maxLevel:0,
    progress:1,
    times:[],
    duration:[],
  },
  onLoad: function (option) {
    console.log('onLoad')
    var that = this;
    that.setData({
      lockLevel: option.lockLevel,
      maxLevel:option.maxLevel,
    });
    this.data.duration = wx.getStorageSync('durations');
    console.log("__level:" + this.data.lockLevel+', max:'+this.data.maxLevel);
    that.initData(this.data.maxLevel);
  },
  initData:function(len){
    for(var i=0; i< len; i++){
      this.data.level.push([i+1]);
    }
    for (var j = 0; j < this.data.duration.length; j++){
      var gap = this.data.duration[j];
      if (gap > 0) {
        this.data.times.push(app.convertTimes(gap));
      } else {
        this.data.times.push('0\'00"');
      }
    }

    console.log(' push level:' + this.data.level + ', len:' + this.data.duration.length);
    this.setData({
      level:this.data.level,
      times:this.data.times,
    })
  },

  onLevelSelect:function(e){
    console.log(' onLevelSelect:'+e.target.id);
    var level = parseInt(e.target.id) + 1
    if (level > this.data.lockLevel)
      return;
    this.navigateBackFunc(level);
  },

  navigateBackFunc: function (level) {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]  //上一个页面
    prevPage.setData({
      selectLevel: level
    })
    wx.navigateBack();
  }
})