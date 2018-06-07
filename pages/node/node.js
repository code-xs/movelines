//snake.js
var app = getApp();

Page({
   data:{
      nodes: 0,
      progress:1,
      context:'恭喜过关',
      maxProgress: 0,//最高
        focus:[],
        position:[],
        lines:[],
        endPos:[],
        targetPos:-1,
        drawLines:0,
        windowW:0,
        windowH:0,
        modalHidden: true,
        showModal: false,
        maxGates:93,
        Height: 100,
        steps:0,
        times:0,
        disableTapEvent:false,
        screenWidth:375,
        canvasH:0,
        offSetY:0,
        selectLevel:0,
        moving:false,
        debug:false,
        duration:[],
        longPressListion:false,
        uerRemoveMode:false,
        longTimer:null,
        removeLineStartPos:-1,
        removeLineEndPos: -1,
        middlePos:[],
        ballX:100,
        ballY:100,
        ball_width:10,
        ball_height:10,
        xV:0,
        yV:0,
        blockPos:[],
        blockValue: [],
   } ,
   onLoad:function(opt){
       var ret = 0;
       var that = this;
       var max = wx.getStorageSync('maxProgress');
       console.log('maxProgress:' + this.data.maxProgress + ' max:' + max + 'progress:' + opt.progress);
       if (max <= 0)
        max = 1;
       this.setData({
        maxProgress: max,
       });
       wx.getStorage({
         key: 'durations',
         success: function (res) {
           console.log('get all duration:'+res.data) ; //打印出已缓存了的historyCitys数组  
           that.setData({
             duration: res.data 
           })
           if(res.data.length < that.data.maxGates){
             console.log(' old len:' + res.data.length + ' new len:' + that.data.maxGates);
             for (var i = res.data.length; i < that.data.maxGates ; i++){
               that.data.duration.push(0);
             }
             wx.setStorage({ key: 'durations', data: that.data.duration });
           }
         },
         fail: function (res) {
           for (var i = 0; i < that.data.maxGates; i++) {
             that.data.duration.push(0);
           }
           console.log('push all duration to storage:' + that.data.duration);
           wx.setStorage({ key: 'durations', data: that.data.duration});
         }
       });
       wx.getSystemInfo({
         success: function (res) {
           console.log(res);
           that.setData({
             windowW: res.windowWidth,
             windowH: res.windowHeight,
             screenWidth: res.windowWidth,
           })
         }
       });
       var canvasH = this.data.windowH - this.data.windowW*200/750;
       canvasH = canvasH.toFixed(0);
       this.data.offSetY = this.data.windowW * 200 / 750;
       this.data.offSetY = this.data.offSetY.toFixed(0);
       this.data.ballX = parseInt(this.data.windowW/2);
       this.data.ballH = parseInt(this.data.windowH / 2);
       that.setData({
         Height: canvasH
       })
       console.log(' selectLevel:' + this.data.selectLevel + ',canvasH:' + canvasH);
       if (parseInt(opt.progress)>1){
         this.setData({
           progress: parseInt(opt.progress),
         });
       }
       this.readyNextData(this.data.progress);
       /*this.initBlockData();
       wx.onAccelerometerChange(function (res) {
         console.log(' get acceler x:' + res.x + ',y:' + res.y + ',z:' + res.z);
         var x = res.x * 2;
         var y = -res.y * 2;
         if(x >0 && x < 1)
          x = 1;
         else if (x > -1 && x < 0)
           x = -1;
         if (y > 0 && y < 1)
           y = 1;
         else if (y > -1 && y < 0)
           y = -1;
         that.moveTo(parseInt(x), parseInt((y)));
       });*/
   },

  moveTo:function(x, y){
    console.log("get moveTo x=" + x + " y=" + y);
   this.data.xV += x;
   this.data.yV += y;
   if (this.data.xV > 6){
     this.data.xV = 6;
   } else if (this.data.xV < -6) {
     this.data.xV = -6;
   }
    if (this.data.yV > 8) {
      this.data.yV = 8;
    } else if (this.data.yV < -8) {
      this.data.yV = -8;
    }
   this.data.ballX += this.data.xV;
   this.data.ballY += this.data.yV;
   if (this.data.ballX < 0 ){
     this.data.ballX = 0;
     this.data.xV = 0;
   }
    
   if (this.data.ballY < 0){
     this.data.ballY = 0;
     this.data.yV = 0;
   }  
      
   if (this.data.ballX > this.data.windowW - this.data.ball_width) {
     this.data.ballX = this.data.windowW - this.data.ball_width;
     this.data.xV = 0;
   }  
  
   if (this.data.ballY > this.data.Height - this.data.ball_height) {
     this.data.ballY = this.data.Height - this.data.ball_height;
     this.data.yV = 0;
   }
   this.drawBall(this.data.ballX, this.data.ballY);
   console.log("ball x=" + this.data.ballX + " ball y=" + this.data.ballY);
},

initBlockData:function(){
  this.data.blockPos = [];
  this.data.blockValue =[];
  var canvasW = this.data.screenWidth;
  var canvasH = this.data.Height;

  var W_01 = parseInt(canvasW * 0.1);
  var W_02 = parseInt(canvasW * 0.2);
  var W_03 = parseInt(canvasW * 0.3);
  var W_04 = parseInt(canvasW * 0.4);
  var W_05 = parseInt(canvasW * 0.5);
  var W_06 = parseInt(canvasW * 0.6);
  var W_07 = parseInt(canvasW * 0.7);
  var W_08 = parseInt(canvasW * 0.8);
  var W_09 = parseInt(canvasW * 0.9);

  var H_01 = parseInt(canvasH * 0.1);
  var H_02 = parseInt(canvasH * 0.2);
  var H_03 = parseInt(canvasH * 0.3);
  var H_04 = parseInt(canvasH * 0.4);
  var H_05 = parseInt(canvasH * 0.5);
  var H_06 = parseInt(canvasH * 0.6);
  var H_07 = parseInt(canvasH * 0.7);
  var H_08 = parseInt(canvasH * 0.8);
  var H_09 = parseInt(canvasH * 0.9);

  this.data.blockPos.push([W_02, H_03]);
  this.data.blockValue.push(1);

  this.data.blockPos.push([W_07, H_06]);
  this.data.blockValue.push(3);

  this.data.blockPos.push([W_05, H_8]);
  this.data.blockValue.push(2);
},
   onShareAppMessage: function(ops) {
     if (ops.from == 'button'){
       return {
         title: '[有人@我]邀请你来挑战第' + this.data.progress + '关,我已用时 ' + this.getTime(),
         path: 'pages/node/node?progress=' + this.data.progress,
         success: function (res) {
           console.log("转发成功:" + JSON.stringify(res));
         },
         fail: function (res) {
           console.log("转发失败:" + JSON.stringify(res));
         }
       }
     }else{
        return {
          title: '[有人@我]邀请你来体验最强相交线,我已通过' + this.data.maxProgress+'关.解锁了'+this.data.nodes+'条线',
          path: 'pages/node/node?progress=1',
          success: function (res) {
            console.log("转发成功:" + JSON.stringify(res));
          },
          fail: function (res) {
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
     }
   },
   onReady: function () {
   },
   preventTouchMove: function () {
   },   
   onContinue:function(){
     this.enterNext();     
   },
   onConfirm: function () {
     this.enterNext();
   },
   onShare: function () {
     this.enterNext();
   },
   hideModal: function () {
     this.enterNext();
   },
   enterNext:function(){
     if (this.data.progress >= this.data.maxGates){
       this.setData({
         progress: 1,
         context:'恭喜过关',
       }); 
     }else{
      this.setData({
        progress: this.data.progress + 1,
      });
     }
     this.readyNextData(this.data.progress);
   },
   modalBindaconfirm: function () {
     this.setData({
       modalHidden: !this.data.modalHidden,
       progress: this.data.progress + 1,
     });
   },
   onShow: function () {
     if (this.data.selectLevel > 0){
       this.data.uerRemoveMode = false;
       wx.reportAnalytics('user_select', {
         cur_progress: this.data.progress,
         max_history: this.data.maxProgress,
         select_level: this.data.selectLevel,
       });
       this.setData({
         progress: this.data.selectLevel,
         selectLevel:0
       });
      this.readyNextData(this.data.progress);
     }
     //wx.startAccelerometer();
   },
   onHide:function(){
     //wx.stopAccelerometer();
     console.log(' onHide called!!!');
     wx.vibrateLong();
     setTimeout(function () {
       wx.vibrateLong();
     }, 2000);
   },
   modalBindcancel: function () {
     this.setData({
       modalHidden: !this.data.modalHidden,
     })
   },
  initData: function(len){
    this.data.lines = [];
      for(var i= 0; i< len; i++){
        if (i >= this.data.endPos.length)
          continue;
        //console.log(' endPos:' + i + "-" + this.data.endPos[i]);
        if (this.data.endPos[i] != null && this.data.endPos[i][0] > 0){
          for (var j = 0; j < this.data.endPos[i].length; j++){
            var index = this.data.endPos[i][j];
            //console.log(' endPos:' + i + ",j:" + j + ' index:' + index);
            this.data.lines.push([this.data.position[i][0], this.data.position[i][1], this.data.position[index][0], this.data.position[index][1]]);
            this.data.focus.push(0);
          }
        }
      }
    console.log(this.data.focus);
    console.log(this.data.lines);
    console.log('----' + this.data.lines[0] + '+'+this.data.lines[0][1]);
  },

  readyNextData: function(progress){
    var nodes = progress+3;
    this.initPosition(nodes);
    this.initData(nodes);
    this.caluFocus();
    this.data.drawLines = 0;
    this.data.steps = 0;
    var timestamp = Date.parse(new Date());
    this.data.times = timestamp / 1000;
    //当前时间戳为：1505355301
    console.log("当前时间戳为：" + this.data.times);
    this.data.disableTapEvent = true;
    this.drawLineOneByOne(this);
    /*
    var ret = this.getNodes();
    this.setData({
      nodes: this.data.nodes+ this.data.lines.length,
    });*/
  },

  initPosition:function(node){
    this.data.position = [];
    this.data.endPos = [];
    var canvasW = this.data.screenWidth;
    var canvasH = this.data.Height;

    var W_01 = parseInt(canvasW * 0.1);
    var W_02 = parseInt(canvasW * 0.2);
    var W_03 = parseInt(canvasW * 0.3);
    var W_04 = parseInt(canvasW * 0.4);
    var W_05 = parseInt(canvasW * 0.5);
    var W_06 = parseInt(canvasW * 0.6);
    var W_07 = parseInt(canvasW * 0.7);
    var W_08 = parseInt(canvasW * 0.8);
    var W_09 = parseInt(canvasW * 0.9);

    var H_01 = parseInt(canvasH * 0.1);
    var H_02 = parseInt(canvasH * 0.2);
    var H_03 = parseInt(canvasH * 0.3);
    var H_04 = parseInt(canvasH * 0.4);
    var H_05 = parseInt(canvasH * 0.5);
    var H_06 = parseInt(canvasH * 0.6);
    var H_07 = parseInt(canvasH * 0.7);
    var H_08 = parseInt(canvasH * 0.8);
    var H_09 = parseInt(canvasH * 0.9);
    if (node == 4) {
      this.data.position.push([W_02, H_04]);
      this.data.endPos.push([1,2]);
      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([3]);
      this.data.position.push([W_03, H_02]);
      this.data.endPos.push([3]);
      this.data.position.push([W_07, H_07]);
      this.data.endPos.push([-1]);
    }else if (node == 5) {
      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_04]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([4]);
      this.data.position.push([W_03, H_07]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_07]);
      this.data.endPos.push([-1]);
    }else if (node == 6) {
      this.data.position.push([W_05, H_02]);//0
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_03, H_03]);//1
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_06]);//3
      this.data.endPos.push([-1]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([-1]);
    } else if (node == 7) {
      this.data.position.push([W_08, H_07]);//0
      this.data.endPos.push([1, 3, 4]);
      this.data.position.push([W_02, H_06]);//1
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_04, H_07]);
      this.data.endPos.push([4]);
      this.data.position.push([W_09, H_06]);//3
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_02]);
      this.data.endPos.push([-1]);
    } else if (node == 8) {
      this.data.position.push([W_04, H_08]);//0
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_02, H_03]);//1
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_06]);//3
      this.data.endPos.push([-1]);
      this.data.position.push([W_04, H_01]);
      this.data.endPos.push([-1]);
    } else if (node == 9) {
      this.data.position.push([W_05, H_02]);//0
      this.data.endPos.push([1, 3, 4]);
      this.data.position.push([W_03, H_03]);//1
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_06]);//3
      this.data.endPos.push([-1]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([-1]);
    } else if (node == 10) {
      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([2, 3]);

      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([4]);

      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([5]);

      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([5]);

      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
    } else if (node == 11) {
      this.data.position.push([W_04, H_02]);//0
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_04]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_07]);//3
      this.data.endPos.push([5]);
      this.data.position.push([W_02, H_05]);
      this.data.endPos.push([5]);
      this.data.position.push([W_06, H_02]);//5
      this.data.endPos.push([-1]);
    }  else if (node == 12) {
      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_07, H_04]);
      this.data.endPos.push([4]);
      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([-1]);
    } else if (node == 13) {
      this.data.position.push([W_02, H_01]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_07, H_04]);
      this.data.endPos.push([4]);
      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([-1]);
    }  else if (node == 14) {
      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_01, H_03]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_09, H_03]);
      this.data.endPos.push([4]);
      this.data.position.push([W_06, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_04, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
    } else if (node == 15) {
      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_01, H_03]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_09, H_03]);
      this.data.endPos.push([4, 5]);
      this.data.position.push([W_06, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_04, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
    } else if (node == 16) {
      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([1, 4, 5]);
      this.data.position.push([W_01, H_03]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_09, H_03]);
      this.data.endPos.push([4]);
      this.data.position.push([W_06, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_04, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
    } else if (node == 17) {
      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([5]);
      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([-1]);
    } else if (node == 18) {
      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([5]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([5]);
      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([-1]);
    } else if (node == 19) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([3, 4]);
    } else if (node == 20) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_05]);
      this.data.endPos.push([4]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4]);
    } else if (node == 21) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_05]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4]);
    } else if (node == 22) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4]);
    } else if (node == 23) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([2, 3, 5]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([5]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([-1]);
    } else if (node == 24) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_05]);
      this.data.endPos.push([4]);
      this.data.position.push([W_02, H_05]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4]);
    } else if (node == 25) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([4, 5]);
      this.data.position.push([W_08, H_05]);
      this.data.endPos.push([4, 5]);
      this.data.position.push([W_02, H_05]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([-1]);
    } else if (node == 26) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([2, 3, 4, 5]);
      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_05]);
      this.data.endPos.push([4]);
      this.data.position.push([W_03, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4]);
    } else if (node == 27) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([2, 3, 4, 5]);
      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([2, 3, 5]);
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_05]);
      this.data.endPos.push([4, 5]);
      this.data.position.push([W_03, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([-1]);
    } else if (node == 28) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4, 5]);//0
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([4]);//2
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([-1]);//4
      this.data.position.push([W_07, H_04]);
      this.data.endPos.push([3, 4]);
    } else if (node == 29) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4, 5]);//0
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([4, 5]);//2
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([5]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([5]);//4
      this.data.position.push([W_07, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 30) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);//0
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([4]);//2
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([-1]);//4
      this.data.position.push([W_05, H_04]);
      this.data.endPos.push([3, 4]);
    }else if (node == 31) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);//0
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 5]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([4]);//2
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([-1]);//4
      this.data.position.push([W_05, H_04]);
      this.data.endPos.push([3, 4]);
    } else if (node == 32) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);//0
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([5]);//2
      this.data.position.push([W_06, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_02, H_04]);
      this.data.endPos.push([-1]);//4
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4]);
    } else if (node == 33) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);//0
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([3, 5]);//2
      this.data.position.push([W_06, H_06]);
      this.data.endPos.push([5]);
      this.data.position.push([W_02, H_04]);
      this.data.endPos.push([5]);//4
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([-1]);
    }  else if (node == 34) {
      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_03, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);
    } else if (node == 35) {
      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([1, 3, 4, 5]);
      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_03, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);
    } else if (node == 36) {
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_03, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([3, 4]);
    } else if (node == 37) {
      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_08]);
      this.data.endPos.push([5]);
      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([5]);
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([-1]);
    } else if (node == 38) {
      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([1, 3, 4, 5]);
      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4]);
    } else if (node == 39) {
      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_05]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([3, 4]);
    } else if (node == 40) {
      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([2, 3, 4, 5]);
      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_09, H_07]);
      this.data.endPos.push([3, 4]);
    } else if (node == 41) {
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([2, 3, 4, 5]);
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_04]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4]);
    } else if (node == 42) {
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([1, 2, 3, 4, 5]);
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([3]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4]);
    } else if (node == 43) {
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([1, 2, 3, 4, 5]);
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([2, 3, 4, 5]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([3]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([4]);
    } else if (node == 44) {
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([2, 3, 4, 5]);
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([-1]);
    } else if (node == 45) {
      this.data.position.push([W_08, H_05]);
      this.data.endPos.push([1,3, 4, 5]);
      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_07, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([3, 4]);
    } else if (node == 46) {
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_04]);
      this.data.endPos.push([3]);
      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([3, 4, 5]);
    } else if (node == 47) {
      this.data.position.push([W_04, H_08]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_06, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_04, H_03]);
      this.data.endPos.push([3, 4]);
    } else if (node == 48) {
      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_03, H_05]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([3, 4]);
    } else if (node == 49) {
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_08]);
      this.data.endPos.push([4]);
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([3, 4]);
    } else if (node == 50) {
      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_01]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([1, 3, 4]);
    } else if (node == 51) {
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_03, H_07]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_05]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_07, H_07]);
      this.data.endPos.push([1, 3, 4]);
    } else if (node == 52) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_03, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_05, H_04]);
      this.data.endPos.push([5]);
      this.data.position.push([W_07, H_06]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([1, 3, 4, 5]);
    } else if (node == 53) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([2, 3, 4, 5]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_03, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_05, H_04]);
      this.data.endPos.push([5]);
      this.data.position.push([W_07, H_06]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([1, 3, 4, 5]);
    } else if (node == 54) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5, 6]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_03, H_07]);
      this.data.endPos.push([5]);
      this.data.position.push([W_09, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([1, 3, 4, 5]);
    } else if (node == 55) {
      this.data.position.push([W_03, H_02]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([4]);
      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_07, H_02]);
      this.data.endPos.push([1, 3, 4, 5]);
    }  else if (node == 56) {
      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_02, H_04]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_08]);
      this.data.endPos.push([4]);
      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_07]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([1, 3, 4, 5]);
    } else if (node == 57) {
      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([2, 3, 4, 5]);
      this.data.position.push([W_02, H_04]);
      this.data.endPos.push([2, 3, 4]);
      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_02, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_07, H_07]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([1, 3, 4, 5]);
    } else if (node == 58) {
      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([2, 3, 4, 6]);
      this.data.position.push([W_01, H_07]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 59) {
      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([3, 4, 5, 6]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([2, 3, 6]);
      this.data.position.push([W_01, H_07]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 60) {
      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([1, 3, 4, 5, 6]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([2, 3, 6]);
      this.data.position.push([W_01, H_07]);
      this.data.endPos.push([3, 4]);
      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([5, 7]);
      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 61) {
      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([3, 4, 5, 6]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([2, 3, 6, 7]);
      this.data.position.push([W_01, H_07]);
      this.data.endPos.push([4]);
      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 62) {
      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([3, 4, 5]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([2, 3, 4, 6]);
      this.data.position.push([W_01, H_07]);
      this.data.endPos.push([3, 7]);
      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 63) {
      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([3, 5, 6]);
      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([2, 3, 4, 6]);
      this.data.position.push([W_01, H_07]);
      this.data.endPos.push([3, 7]);
      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([5, 6, 7]);
      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 64) {
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([3, 4, 5]);

      this.data.position.push([W_08, H_01]);
      this.data.endPos.push([2, 3, 4, 6]);

      this.data.position.push([W_03, H_07]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_02, H_05]);
      this.data.endPos.push([4, 5, 6, 7]);

      this.data.position.push([W_08, H_05]);
      this.data.endPos.push([5, 6, 7]);

      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([-1]);
      this.data.position.push([W_04, H_07]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([-1]);
    } else if (node == 65) {
      this.data.position.push([W_06, H_01]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 4, 6]);

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_04, H_04]);
      this.data.endPos.push([4, 5, 6, 7]);

      this.data.position.push([W_04, H_08]);
      this.data.endPos.push([5, 6, 7]);

      this.data.position.push([W_09, H_04]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_09, H_07]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([-1]);
    }else if (node == 66) {
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([3, 4, 5]);

      this.data.position.push([W_08, H_01]);
      this.data.endPos.push([2, 3, 4, 6]);

      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_02, H_05]);
      this.data.endPos.push([4, 5, 6, 7]);

      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([5, 6, 7]);

      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 67) {

      this.data.position.push([W_04, H_08]);
      this.data.endPos.push([3, 4, 5]);

      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([2, 3, 4]);

      this.data.position.push([W_06, H_03]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([4]);

      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_06, H_04]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([1, 3, 4, 5]);

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);      
    } else if (node == 68) {
      this.data.position.push([W_07, H_02]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_01, H_02]);
      this.data.endPos.push([2, 3, 4, 6]);

      this.data.position.push([W_09, H_03]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([4, 5, 6, 7]);

      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([5, 6, 7]);

      this.data.position.push([W_09, H_04]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_06, H_07]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([-1]);
    } else if (node == 69) {
      this.data.position.push([W_07, H_02]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4, 6]);

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 5, 6, 7]);

      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([5, 6, 7]);

      this.data.position.push([W_09, H_05]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([-1]);
    } else if (node == 70) {
      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4]);

      this.data.position.push([W_09, H_05]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([4]);
      
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([1, 3, 4, 5]);

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([3, 4]);
    } else if (node == 71) {
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4]);

      this.data.position.push([W_09, H_04]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([4]);

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([1, 3, 4, 5]);

      this.data.position.push([W_01, H_04]);
      this.data.endPos.push([3, 4]);
    } else if (node == 72) {
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4]);

      this.data.position.push([W_09, H_07]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([4]);

      this.data.position.push([W_09, H_01]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([1, 3, 4, 5]);

      this.data.position.push([W_01, H_04]);
      this.data.endPos.push([3, 4]);
    } else if (node == 73) {
      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4]);

      this.data.position.push([W_09, H_07]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4]);

      this.data.position.push([W_03, H_05]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([1, 3, 4, 5]);

      this.data.position.push([W_01, H_04]);
      this.data.endPos.push([3, 4]);
    } else if (node == 74) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_03, H_05]);
      this.data.endPos.push([2, 3, 4, 8]);

      this.data.position.push([W_07, H_05]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([8]);

      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_01, H_03]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4, 5, 8]);

      this.data.position.push([W_09, H_03]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_06, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 75) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4, 8]);

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([8]);

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4, 5, 8]);

      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([-1]);
    } else if (node == 76) {
      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([2, 3, 4, 8]);

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_07, H_09]);
      this.data.endPos.push([8]);

      this.data.position.push([W_03, H_09]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_01, H_07]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_09, H_07]);
      this.data.endPos.push([3, 4, 5, 8]);

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([-1]);
    } else if (node == 77) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4, 8]);

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 8]);

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4, 5, 8]);
      
      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([-1]);
    } else if (node == 78) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4, 5,6, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4, 8]);

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 8]);

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3]);

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4, 5, 8]);

      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([-1]);
    } else if (node == 79) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 5, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4, 8]);

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 8]);

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4, 7]);

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4, 5, 8]);

      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([-1]);
    } else if (node == 80) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4, 8]);

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 8]);

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([1, 3, 4, 5, 8]);

      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([-1]);
    } else if (node == 81) {
      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([3, 4, 5, 7]);

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4, 8]);

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([4, 8]);

      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([-1]);

      this.data.position.push([W_06, H_06]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([1, 3, 4, 5, 8]);

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([3, 4]);

      this.data.position.push([W_09, H_04]);
      this.data.endPos.push([-1]);
    } else if (node == 82) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_01, H_02]);
      this.data.endPos.push([2, 3, 4, 8, 9]);//1

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4, 9]);//2

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 8, 9]);//3

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([-1]);//4

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([1, 3, 4, 5, 8]);//6

      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_06, H_08]);
      this.data.endPos.push([-1]);//9   
    } else if (node == 83) {
      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([2, 3, 4, 8, 9]);//1

      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([3, 4, 9]);//2

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 8, 9]);//3

      this.data.position.push([W_08, H_04]);
      this.data.endPos.push([-1]);//4

      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([1, 3, 4, 5, 8]);//6

      this.data.position.push([W_04, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_06, H_02]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_09, H_07]);
      this.data.endPos.push([-1]);//9

    } else if (node == 84) {
      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10]);//1

      this.data.position.push([W_02, H_03]);
      this.data.endPos.push([3, 4, 9]);//2

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([4, 8, 9]);//3

      this.data.position.push([W_09, H_04]);
      this.data.endPos.push([10]);//4

      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10]);//6

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_07, H_02]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([-1]);//9

      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([-1]);//10
    } else if (node == 85) {
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10]);//1

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([3, 4, 9]);//2

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 8, 9]);//3

      this.data.position.push([W_09, H_05]);
      this.data.endPos.push([10]);//4

      this.data.position.push([W_04, H_08]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_06, H_07]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10]);//6

      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_09, H_03]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([-1]);//9

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([-1]);//10

    } else if (node == 86) {
      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10]);//1

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([10]);//4

      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_02, H_08]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10]);//6

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_02, H_04]);
      this.data.endPos.push([-1]);//10

      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([-1]);//11

    } else if (node == 87) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10]);//1

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_09, H_05]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_09, H_09]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12]);//6

      this.data.position.push([W_08, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_02, H_08]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_06, H_07]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([12]);//10

      this.data.position.push([W_07, H_06]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([-1]);//12
    } else if (node == 88) {
      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10]);//1

      this.data.position.push([W_01, H_07]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_02, H_05]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_03, H_07]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12]);//6

      this.data.position.push([W_02, H_08]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_08, H_05]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_06, H_06]);
      this.data.endPos.push([12]);//10

      this.data.position.push([W_01, H_03]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([-1]);//12
    } else if (node == 89) {
      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10, 13]);//1

      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_09, H_05]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_05, H_03]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12]);//6

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_04, H_06]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_06, H_07]);
      this.data.endPos.push([12, 13]);//10

      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_08, H_07]);
      this.data.endPos.push([-1]);//12

      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([-1]);//13   
    } else if (node == 90) {
      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10, 13]);//1

      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_03, H_04]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12]);//6

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_04, H_09]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_03, H_07]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_06, H_06]);
      this.data.endPos.push([12, 13]);//10

      this.data.position.push([W_09, H_05]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_09, H_07]);
      this.data.endPos.push([-1]);//12

      this.data.position.push([W_01, H_04]);
      this.data.endPos.push([-1]);//13           
    } else if (node == 91) {
      this.data.position.push([W_06, H_09]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_02, H_01]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10, 13]);//1

      this.data.position.push([W_02, H_09]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_05, H_03]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_01, H_07]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_09, H_02]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12, 14]);//6

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_05, H_08]);
      this.data.endPos.push([12, 13, 14]);//10

      this.data.position.push([W_01, H_04]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([-1]);//12

      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([-1]);//13    

      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([-1]);//14
    } else if (node == 92) {
      this.data.position.push([W_03, H_01]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_02, H_02]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10, 13, 15]);//1

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_09, H_06]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12, 14]);//6

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_08, H_09]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_02, H_09]);
      this.data.endPos.push([12, 13, 14, 15]);//10

      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_07, H_08]);
      this.data.endPos.push([-1]);//12

      this.data.position.push([W_05, H_09]);
      this.data.endPos.push([15]);//13    

      this.data.position.push([W_01, H_03]);
      this.data.endPos.push([-1]);//14

      this.data.position.push([W_09, H_02]);
      this.data.endPos.push([-1]);//15      
    } else if (node == 93) {
      this.data.position.push([W_03, H_09]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_08, H_09]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10, 13, 15, 16]);//1

      this.data.position.push([W_08, H_03]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_09, H_05]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_04, H_02]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12, 14]);//6

      this.data.position.push([W_04, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_05, H_07]);
      this.data.endPos.push([12, 13, 14, 15, 16]);//10

      this.data.position.push([W_07, H_05]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_08, H_08]);
      this.data.endPos.push([-1]);//12

      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([15]);//13    

      this.data.position.push([W_03, H_07]);
      this.data.endPos.push([-1]);//14

      this.data.position.push([W_01, H_08]);
      this.data.endPos.push([16]);//15

      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([-1]);//16         
    } else if (node == 94) {
      this.data.position.push([W_03, H_09]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_08, H_09]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10, 13, 15, 16]);//1

      this.data.position.push([W_07, H_01]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_05, H_03]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_02, H_09]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12, 14]);//6

      this.data.position.push([W_04, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_05, H_04]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_06, H_05]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_06, H_06]);
      this.data.endPos.push([12, 13, 14, 15, 16]);//10

      this.data.position.push([W_07, H_04]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_07, H_07]);
      this.data.endPos.push([-1]);//12

      this.data.position.push([W_02, H_07]);
      this.data.endPos.push([15]);//13    

      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([-1]);//14

      this.data.position.push([W_01, H_02]);
      this.data.endPos.push([16]);//15

      this.data.position.push([W_09, H_02]);
      this.data.endPos.push([-1]);//16         
    } else if (node == 95) {
      this.data.position.push([W_03, H_09]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_08, H_09]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10, 13, 15, 16]);//1

      this.data.position.push([W_09, H_03]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_01, H_03]);
      this.data.endPos.push([4, 8, 9, 11]);//3

      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_02, H_08]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12, 14]);//6

      this.data.position.push([W_02, H_01]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_05, H_04]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_05, H_05]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([12, 13, 14, 15, 16]);//10

      this.data.position.push([W_06, H_04]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_07, H_06]);
      this.data.endPos.push([-1]);//12

      this.data.position.push([W_02, H_06]);
      this.data.endPos.push([15]);//13    

      this.data.position.push([W_02, H_05]);
      this.data.endPos.push([-1]);//14

      this.data.position.push([W_01, H_06]);
      this.data.endPos.push([16]);//15

      this.data.position.push([W_09, H_01]);
      this.data.endPos.push([-1]);//16         
    } else if (node == 96) {
      this.data.position.push([W_02, H_09]);
      this.data.endPos.push([3, 4, 5, 7]);//0

      this.data.position.push([W_08, H_09]);
      this.data.endPos.push([2, 3, 4, 8, 9, 10, 13, 15, 16]);//1

      this.data.position.push([W_08, H_02]);
      this.data.endPos.push([3, 4, 9, 11]);//2

      this.data.position.push([W_01, H_02]);
      this.data.endPos.push([4, 8, 9, 11]);//3
      
      this.data.position.push([W_03, H_03]);
      this.data.endPos.push([10, 12]);//4

      this.data.position.push([W_09, H_08]);
      this.data.endPos.push([3, 4]);//5

      this.data.position.push([W_03, H_08]);
      this.data.endPos.push([1, 3, 4, 5, 8, 10, 12, 14]);//6

      this.data.position.push([W_08, H_06]);
      this.data.endPos.push([3, 4]);//7

      this.data.position.push([W_04, H_04]);
      this.data.endPos.push([-1]);//8

      this.data.position.push([W_05, H_04]);
      this.data.endPos.push([11]);//9

      this.data.position.push([W_05, H_06]);
      this.data.endPos.push([12, 13, 14, 15, 16]);//10

      this.data.position.push([W_05, H_02]);
      this.data.endPos.push([-1]);//11

      this.data.position.push([W_07, H_06]);
      this.data.endPos.push([-1]);//12

      this.data.position.push([W_03, H_06]);
      this.data.endPos.push([15]);//13    

      this.data.position.push([W_03, H_05]);
      this.data.endPos.push([-1]);//14

      this.data.position.push([W_01, H_05]);
      this.data.endPos.push([16]);//15

      this.data.position.push([W_05, H_01]);
      this.data.endPos.push([-1]);//16         
    }
    console.log('pos:' + this.data.position);  
  },

  updateMiddlePos:function(){
    this.data.middlePos = [];
    for (var i = 0; i < this.data.lines.length; i++) {
      var x = parseInt((this.data.lines[i][0] + this.data.lines[i][2]) / 2);
      var y = parseInt((this.data.lines[i][1] + this.data.lines[i][3]) / 2);
      console.log(' get line ' + i + ' middle pos:' + x + '-' + y);
      this.data.middlePos.push([x, y]);
    }
  },

    tapStart: function(e){
      console.log(' touchEventHandler x:' + e.touches[0].pageX + ',y:' + e.touches[0].pageY);
      this.data.longPressListion = true;
      var that = this;
      if (this.data.longTimer != null)
        clearTimeout(this.data.longTimer);

      this.data.longTimer = setTimeout(function () {
        that.data.longTimer = null;
        if (that.data.longPressListion)
          that.doLongPress();
      }, 1000);
    },

    doLongPress:function(){
      this.data.longPressListion = false;
      if (this.data.longTimer != null)
        clearTimeout(this.data.longTimer);
      this.data.uerRemoveMode = !this.data.uerRemoveMode;
      console.log(' doLongPress !!!');
      if (!this.data.uerRemoveMode){
        this.data.removeLineStartPos = -1;
        this.data.removeLineEndPos = -1;
      }
      this.updateMiddlePos();
      this.drawLines(0, 0, -1, null, this.data.uerRemoveMode);
    },

    checkSamePosition:function(x, y, exinclude){
      for (var i = 0; i < this.data.position.length; i++) {
        if (exinclude != i
        && Math.abs(x - this.data.position[i][0]) <= 3
        && Math.abs(y - this.data.position[i][1]) <= 3){
          return i;
        }
      }
      return -1;
    },

    getLinesForPostion:function(posIndex){
      var cnt = 0;
      for (var i = 0; i < this.data.lines.length; i++) {
        if ((this.data.position[posIndex][0] == this.data.lines[i][0]
          && this.data.position[posIndex][1] == this.data.lines[i][1])
          || (this.data.position[posIndex][0] == this.data.lines[i][2]
            && this.data.position[posIndex][1] == this.data.lines[i][3])) {
          cnt ++;
        }
      }
      console.log(' getLines '+ cnt+' in position '+posIndex);
      return cnt;
    },
    printPosition:function(text){
      console.log('end printPosition ' + text);
      for (var i = 0; i < this.data.position.length; i++) {
        console.log(' cur position ' + i + ':' + this.data.position[i][0] + '-' + this.data.position[i][1]);
      }
    },
    tapMove: function(event){
      if (this.data.disableTapEvent){
        console.log('disableTapEvent');
        return;
      }
      this.data.longPressListion = false;
      if (this.data.longTimer != null)
        clearTimeout(this.data.longTimer);
        
      if(this.data.uerRemoveMode){
        console.log('uerRemoveMode');
        return;
      }
      var circleR = 12;
      var x = event.touches[0].pageX;
      var y = event.touches[0].pageY;
      if(this.data.debug)
        console.log(' tapMove orgin x:' + x +' y:'+y+ ' offset:' + this.data.offSetY);
      if (x < circleR)
        x = circleR;
      else if (x > this.data.windowW - circleR)
        x = this.data.windowW - circleR;

      if (y < circleR)
        y = circleR;
      else if (y >= this.data.windowH - circleR)
        y = this.data.windowH - circleR;

        if (y >= this.data.offSetY)
          y -= this.data.offSetY;

        if (this.data.targetPos < 0) {
          this.data.targetPos = this.getTargetPos(x, y);
        }
        if (this.data.targetPos >= 0){
          for(;;){
            var index = this.checkSamePosition(x, y, this.data.targetPos);
            if(index >= 0){
              y += 2;
              console.log('check same position is '+index);
            }else{
              break;
            }
          }
          for (var i = 0; i < this.data.lines.length; i++) {
            if (this.data.position[this.data.targetPos][0] == this.data.lines[i][0]
              && this.data.position[this.data.targetPos][1] == this.data.lines[i][1]) {
              this.data.lines[i][0] = x;
              this.data.lines[i][1] = y;
            }
            if (this.data.position[this.data.targetPos][0] == this.data.lines[i][2]
              && this.data.position[this.data.targetPos][1] == this.data.lines[i][3]) {
              this.data.lines[i][2] = x;
              this.data.lines[i][3] = y;
            }
          }
          this.data.position[this.data.targetPos][0] = x;
          this.data.position[this.data.targetPos][1] = y;
        }
        this.caluFocus();
        this.drawLines(x, y, -1, null, this.data.uerRemoveMode);
        /*
        //var ret = this.getNodes();
        var count = parseInt(this.data.nodes) + this.data.lines.length;
        this.setData({
          nodes: count,
        });*/
    },

    levelSelect:function(){
      console.log(' levelSelect ');
      wx.reportAnalytics('guanqia', {
        steps: this.data.steps,
        times: this.getTime(),
        cur_progress: this.data.progress,
      });
      var level = this.data.progress > this.data.maxProgress ? this.data.progress : this.data.maxProgress;
      wx.navigateTo({
        url: '../level/level' + '?lockLevel=' + (this.data.maxProgress+1)+'&maxLevel='+this.data.maxGates
      })
    },

    tapEnd: function(event){
      if (this.data.disableTapEvent){
        console.log('tap end disableTapEvent');
        return;
      }
      this.data.longPressListion = false;
      this.data.targetPos = -1;
      if (this.data.uerRemoveMode) {
        console.log('tap end uerRemoveMode');
        return;
      }
 
      this.drawLines(0, 0, -1, null, this.data.uerRemoveMode);
      this.data.steps ++;
      var ret = this.getNodes();
      this.next(ret);
    },

    longpress:function(e){
      if (this.data.disableTapEvent) {
        console.log('disableTapEvent');
        return;
      }
      console.log('longtap !!!');
    },

    convertXY:function(x, y){
      var circleR = 12;
      if (this.data.debug)
        console.log(' tapMove orgin x:' + x + ' y:' + y + ' offset:' + this.data.offSetY);
      if (x < circleR)
        x = circleR;
      else if (x > this.data.windowW - circleR)
        x = this.data.windowW - circleR;

      if (y < circleR)
        y = circleR;
      else if (y >= this.data.windowH - circleR)
        y = this.data.windowH - circleR;

      if (y >= this.data.offSetY)
        y -= this.data.offSetY;
    },

    onClick: function (e){
      console.log(' onClick x:' + e.touches[0].pageX + ',y:' + e.touches[0].pageY);
      if (this.data.disableTapEvent) {
        console.log('disableTapEvent');
        return;
      }
      if (!this.data.uerRemoveMode) {
        console.log('no uerRemoveMode');
        return;
      }
      var x = e.touches[0].pageX;
      var y = e.touches[0].pageY;
      console.log(' convert before x:'+x+',y:'+y);
      //this.convertXY(x, y);
      var circleR = 12;
      if (this.data.debug)
        console.log(' tapMove orgin x:' + x + ' y:' + y + ' offset:' + this.data.offSetY);
      if (x < circleR)
        x = circleR;
      else if (x > this.data.windowW - circleR)
        x = this.data.windowW - circleR;

      if (y < circleR)
        y = circleR;
      else if (y >= this.data.windowH - circleR)
        y = this.data.windowH - circleR;

      if (y >= this.data.offSetY)
        y -= this.data.offSetY;

      console.log(' convert after x:' + x + ',y:' + y);
      var index = this.getMiddleTargetIndex(x, y, this.data.middlePos);
      if (index >= 0){
        var pos1 = this.getTargetPos(this.data.lines[index][0], this.data.lines[index][1]);
        var lines = this.getLinesForPostion(pos1);
        var pos2 = this.getTargetPos(this.data.lines[index][2], this.data.lines[index][3]);
        var lines2 = this.getLinesForPostion(pos2);
        if (lines < 3 || lines2 < 3){
          this.drawLines(0, 0, -1, '圆点'+(lines < 3?pos1:pos2)+'连线少于3条,请选择其它', this.data.uerRemoveMode);
          return;
        }else{
          this.data.disableTapEvent = true;
          var that = this;
          console.log(' post remove line:'+index);
          var timer = setTimeout(function () {
            that.removeSelectLine(index);
          }, 200);
        }
      }
    },

    removeSelectLine:function(index){
      console.log('remove removeSelectLine ' + index);
      this.data.lines.splice(index, 1);
      this.data.focus.splice(index, 1);
      this.updateMiddlePos();
      this.drawLines(0, 0, -1, null, this.data.uerRemoveMode);
      this.data.disableTapEvent = false;
    },
  
    saveTime:function(progress){
      var timestamp = Date.parse(new Date());
      var gap = timestamp / 1000 - this.data.times;
      var time = this.data.duration[this.data.progress-1];
      console.log(' progress: ' + progress + ' old time:' + time+', new time:'+gap);
      if (time <= 0 || time > gap){
        this.data.duration[this.data.progress - 1] = gap;
        console.log(' update ' + this.data.duration + ' old time:' + time + ', new time:' + gap);
        wx.setStorageSync('durations', this.data.duration);
      }
    },

    getTime:function(){
      var timestamp = Date.parse(new Date());
      var gap = timestamp / 1000 - this.data.times;
      return app.convertTimes(gap);
    },

    convertTimes:function(gap){
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

    next:function(nodes){
      if(nodes == 0){
        var count = parseInt(this.data.nodes) + this.data.lines.length;
        var gap = parseInt(1000/this.data.lines.length);
        if(gap > 80)
          gap = 80;
        this.showScore(this, count, gap);
        this.saveTime(this.data.progress);
        if (this.data.progress > this.data.maxProgress) {
          this.setData({
            maxProgress: this.data.progress,
          });
          wx.setStorageSync('maxProgress', this.data.maxProgress);
        }
        this.drawLines(0, 0, -1, "第" + this.data.progress + '关: 移动' + this.data.steps + '次 用时 ' + this.getTime(), this.data.uerRemoveMode);
        this.postNext(this);
      }
    },

    postNext: function (that) {
      var timer = setTimeout(function () {
        that.enterNext();
      }, 1000);
    },
    
    showScore:function(that, score, gap){
      if( this.data.nodes< score){
        this.setData({
          nodes: this.data.nodes+1,
        });
        var timer = setTimeout(function () {
          that.showScore(that, score, gap < 20 ?gap : gap-5);
        }, gap);
      }
    },

    caluFocus:function(){
      for (var i = 0; i < this.data.focus.length; i++) {
        this.data.focus[i] = 0;
      }
      for (var i = 0; i < this.data.lines.length; i++) {
        for (var j = i + 1; j < this.data.lines.length; j++) {
          var ret = this.getIntersection(
            this.data.lines[i][0], this.data.lines[i][1], this.data.lines[i][2], this.data.lines[i][3],       this.data.lines[j][0], this.data.lines[j][1], this.data.lines[j][2], this.data.lines[j][3]);
          if (ret > 0) {
            //console.log(' getIntersection: ' + i + ' with ' + j);
            this.data.focus[i] = 1;
            this.data.focus[j] = 1;
          }
        }
      }
    },

    drawLines: function(x, y, lines, context, showDigit){

      if (this.data.moving){
        console.log(' drop event:'+x+"-"+y);
        return;
      }
      this.data.moving = true;
      const ctx = wx.createCanvasContext('myCanvas');
      ctx.setLineWidth(3);
      if (this.data.lines.length > 16)
        ctx.setLineWidth(2);
      ctx.setFillStyle('red');
      var pos = [];
      if(context == null){
        if (this.data.progress == 1)
          this.drawRuleText(ctx, this.data.windowW/2, 40, "移动圆点，使所有线条不相交");
      }else{
          this.drawRuleText(ctx, this.data.windowW / 2, 40, context);
      }

      for (var i = 0; i < this.data.lines.length; i++) {
        if (lines > 0 && lines <= i) {
          break;
        }
        if (this.data.focus[i] == 0)
          ctx.setStrokeStyle('#eec700');
        else
          ctx.setStrokeStyle('#665446');

        if ((this.data.lines[i][0] == x && this.data.lines[i][1] == y)
          || (this.data.lines[i][2] == x && this.data.lines[i][3] == y))
          ctx.setStrokeStyle('#ed995e');

        if(this.getNodes() == 0){
          ctx.setStrokeStyle('#eec700');
        }

        this.drawLine(ctx, this.data.lines[i][0], this.data.lines[i][1], this.data.lines[i][2], this.data.lines[i][3]);
        ctx.setFillStyle('#665446');
        if ((this.data.lines[i][0] == x && this.data.lines[i][1] == y)
          || (this.data.lines[i][2] == x && this.data.lines[i][3] == y)){
          if (!pos.includes([this.data.lines[i][0], this.data.lines[i][1]]))
            pos.push([this.data.lines[i][0], this.data.lines[i][1]]);
          if (!pos.includes([this.data.lines[i][2], this.data.lines[i][3]]))
            pos.push([this.data.lines[i][2], this.data.lines[i][3]]);
        }
        /*
        this.drawCircle(ctx, this.data.lines[i][0], this.data.lines[i][1]);
        this.drawCircle(ctx, this.data.lines[i][2], this.data.lines[i][3]);
        ctx.setFillStyle('#F0F8FF');
        var cnt = this.data.focus[i];
        for (var j = 0; j < this.data.lines.length; j++) {
          if (i != j && this.data.lines[i][0] == this.data.lines[j][0]
            && this.data.lines[j][1] == this.data.lines[j][1]) {
            cnt += this.data.focus[j];
          }
        }*/
      }
      for (var ind = 0; ind < this.data.position.length; ind++) {
        this.drawCircle(ctx, this.data.position[ind][0], this.data.position[ind][1]);
      }
      if (this.data.uerRemoveMode){
        for (var ind = 0; ind < this.data.middlePos.length; ind++) {
          ctx.setFillStyle('#FF0000');
          this.drawCircle(ctx, this.data.middlePos[ind][0], this.data.middlePos[ind][1]);
          ctx.setFillStyle('#F0F8FF');
          this.drawText(ctx, this.data.middlePos[ind][0], this.data.middlePos[ind][1] + 5, 'X');
        }
      }

      if(x > 0 && y > 0){
        ctx.setFillStyle('#ed995e');
        for(var idx =0; idx < pos.length; idx++){
          this.drawCircle(ctx, pos[idx][0], pos[idx][1]);
        }
      }
      if (showDigit){
        ctx.setFillStyle('#F0F8FF');
        for (var ind = 0; ind < this.data.position.length; ind++) {
          this.drawText(ctx, this.data.position[ind][0], this.data.position[ind][1] + 5, ind);
        }
      }
      ctx.draw();
      this.data.moving = false;
    },

    getNodes:function(){
      var cnt = 0;
      for (var i = 0; i < this.data.lines.length; i++) {
        if (this.data.focus[i] > 0)
          cnt ++;
      }
      return cnt;
    },

    getTargetPos: function (x, y) {
      var val = 0, value = 0, index = -1;
      for (var i = 0; i < this.data.position.length;i++){
        if (Math.abs(x - this.data.position[i][0]) > 20
          || Math.abs(y - this.data.position[i][1]) > 20){
            continue;
          }
        val = Math.abs(x - this.data.position[i][0]) + Math.abs(y - this.data.position[i][1]);
        if (value == 0) {
          value = val;
          index = i;
        }
        if (val < value) {
          index = i;
          value = val;
        }
      }
      console.log('getTargetPos:'+index);
      return index;
    },

    getMiddleTargetIndex: function (x, y, positions) {
      var val = 0, value = 0, index = -1;
      for (var i = 0; i < positions.length; i++) {
        if (Math.abs(x - positions[i][0]) > 20
          || Math.abs(y - positions[i][1]) > 20) {
          continue;
        }
        val = Math.abs(x - positions[i][0]) + Math.abs(y - positions[i][1]);
        if (value == 0) {
          value = val;
          index = i;
        }
        if (val < value) {
          index = i;
          value = val;
        }
      }
      console.log('getMiddleTargetIndex:' + index);
      return index;
    },

    getTargetLine:function(x, y){
      var val =0, value=0, index = -1;
      for(var i=0; i< this.data.lines.length; i++){
        if ((Math.abs(x - this.data.lines[i][0]) > 20 
          && Math.abs(y - this.data.lines[i][1]) >20)
          || (Math.abs(x - this.data.lines[i][2]) > 20
          && Math.abs(y - this.data.lines[i][3]) > 20))
          continue;

        val = Math.abs(x - this.data.lines[i][0]) + Math.abs(y - this.data.lines[i][1]);
        console.log(val);
        console.log('----------------x:' + x + 'y:' + y + ',startX:' + this.data.lines[i][0] + '-startY:' + this.data.lines[i][1]);
        if(value == 0){
          value = val;
        }
        console.log('val'+val);
        console.log('value'+value);
        if(val < value){
          index = i;
          value = val;
        }
      }
      console.log('targetLine');
      console.log(value);
      return index;
    },

    drawLineOneByOne:function(that) {
      if (that.data.drawLines < that.data.lines.length){
        that.data.drawLines += 1;
        console.log('drawLineOneByOne: ' + that.data.drawLines);
        that.drawLines(0, 0, that.data.drawLines, null, this.data.uerRemoveMode);
        var hz = 100;
        if (that.data.lines.length > 50)
          hz = 30;
        else if (that.data.lines.length > 30)
          hz = 40;
        else if (that.data.lines.length > 15)
          hz = 60;
        else if (that.data.lines.length > 10)
          hz = 80;
        var timer = setTimeout(function (){
          that.drawLineOneByOne(that);
        }, hz);
      }else{
        this.data.disableTapEvent = false;
      }
  },

drawLine:function(ctx, x, y, x1, y1){
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x1, y1);
  ctx.stroke();      
},

drawCircle:function(ctx, x, y){
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, 2 * Math.PI);
  ctx.fill();
},

drawBall: function (x, y) {
  const ctx = wx.createCanvasContext('myCanvas');

  for (var ind = 0; ind < this.data.blockValue.length; ind++) {
    ctx.setFillStyle('#ed995e');
    this.drawCircle(ctx, this.data.blockPos[ind][0], this.data.blockPos[ind][1]);
    ctx.setFillStyle('#F0F8FF');
    this.drawText(ctx, this.data.blockPos[ind][0], this.data.blockPos[ind][1] + 5, this.data.blockValue[ind]);
  }
  ctx.setFillStyle('#000000');
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.draw();
},

drawRuleText: function (ctx, x, y, cnt) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.setFontSize(20);
  ctx.setFillStyle('#665446');
  ctx.setTextAlign('center');
  ctx.fillText(cnt, x, y);
},

drawText:function(ctx, x, y, cnt){
  ctx.setFontSize(13);
  ctx.setTextAlign('center');
  ctx.fillText(cnt, x, y);
},

getIntersection:function( p0_x,  p0_y,  p1_x,  p1_y,
  p2_x,  p2_y,  p3_x,  p3_y){
  var s02_x, s02_y, s10_x, s10_y, s32_x, s32_y, s_numer, t_numer, denom, t;
  s10_x = p1_x - p0_x;
  s10_y = p1_y - p0_y;
  s32_x = p3_x - p2_x;
  s32_y = p3_y - p2_y;
  var denom = s10_x * s32_y - s32_x * s10_y;
  if(denom == 0)//平行或共线
      return 0; // Collinear
    var denomPositive = denom > 0;

  s02_x = p0_x - p2_x;
  s02_y = p0_y - p2_y;
  s_numer = s10_x * s02_y - s10_y * s02_x;
  if((s_numer < 0) == denomPositive)//参数是大于等于0且小于等于1的，分子分母必须同号且分子小于等于分母
    return 0; // No collision

  t_numer = s32_x * s02_y - s32_y * s02_x;
  if ((t_numer < 0) == denomPositive)
    return 0; // No collision

  if (((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
    return 0; // No collision
  // Collision detected
  t = t_numer / denom;
  var i_x = p0_x + (t * s10_x);
  var i_y = p0_y + (t * s10_y);
  if ((i_x == p0_x && i_y == p0_y)
  || (i_x == p2_x && i_y == p2_y)
  || i_x == p1_x && i_y == p1_y
  || i_x == p3_x && i_y == p3_y)
    return 0;

  return 1;
}
});