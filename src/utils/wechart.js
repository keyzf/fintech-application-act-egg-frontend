import envConfig from '../env'

const shareTitle = '金哥邀你砸金蛋'
const shareContent = '砸金蛋享壕礼，百万积分送不停'
const shareImage = 'https://fintechapp-prd-1258285289.cos.ap-guangzhou.myqcloud.com/ops/2019-12/1577329167238-3ddc9f07708d44239149b3b592f0290f.png'

// 请注意，原有的 wx.onMenuShareTimeline、wx.onMenuShareAppMessage、wx.onMenuShareQQ、wx.onMenuShareQZone 接口，即将废弃。请尽快迁移使用客户端6.7.2及JSSDK 1.4.0以上版本支持的 wx.updateAppMessageShareData、wx.updateTimelineShareData接口。
const showWechartShare = function(cb) {
  var newUrl = window.location.href.split('&')[0]
  var oimgUrl = shareImage // 测试
  var xhr = new XMLHttpRequest()
  xhr.open('POST', envConfig.wechatHost + '/m/rest/wechat/getJssdkSignature')
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xhr.send(`url=${newUrl}`)
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText)
      if (data.status === '1') {
        var newAppID = data.data.appid
        var newTime = data.data.timestamp
        var newNonceStr = data.data.nonceStr
        var newSign = data.data.signature
        window.wx.config({
          debug: false,
          appId: newAppID,
          timestamp: newTime,
          nonceStr: newNonceStr,
          signature: newSign,
          jsApiList: [
            // 调用了两个分享接口,分别是朋友圈和个人
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
          ]
        })
        window.wx.ready(function() {
          const obj = {
            title: shareTitle, //  标题
            desc: shareContent, //  描述
            link: newUrl, //  分享的URL，必须和当前打开的网页的URL是一样的
            imgUrl: oimgUrl //  缩略图地址
          }
          window.wx.onMenuShareAppMessage({
            title: obj.title,
            desc: obj.desc,
            link: obj.link,
            imgUrl: obj.imgUrl,
            success: function() {
              // 是否首次分享
              //   trackEventShare('wechat');
              //   if (cb) {
              //     cb();
              //   }
              //   window.appConnect.firstShare();
            }
          })
          window.wx.onMenuShareTimeline({
            title: obj.title,
            link: obj.link,
            imgUrl: obj.imgUrl,
            success: function() {
              // 是否首次分享
              //   trackEventShare('wechatTimeline');
              //   setTimeout(() => {
              //     if (cb) {
              //       cb();
              //     }
              //     window.appConnect.firstShare();
              //   }, 200);
            },
            cancel: function() {
              //   setTimeout(() => {
              //     if (cb) {
              //       cb();
              //     }
              //     window.appConnect.firstShare();
              //   }, 200);
            }
          })
        })
      }
    }
  }
}

export { showWechartShare }
