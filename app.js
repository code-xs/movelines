//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login( {
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  },
  convertTimes: function (gap) {
    var hour = 0, min = 0, sec = 0;
    var one_hour = 60 * 60;
    var one_min = 60;
    gap = gap.toFixed(0);
    hour = gap / one_hour;
    hour = hour.toFixed(0);
    min = gap % one_hour / one_min;
    min = min.toFixed(0);
    sec = gap % one_min;
    sec = sec.toFixed(0);
    var tt = '';
    if (hour >= 1)
      tt = hour + '';
    if (min >= 1)
      tt += min + '\'';
    else
      tt += '0\'';
    if (sec >= 1)
      tt += sec + '"';
    return tt;
  },
})
