/**
 * 夜间模式和分享信息传递
 * @param {function} cb 夜间模式样式
 * @param {string} msg 传给原生的分享信息
 */

function getUserAgent () {
  var content = '砸金蛋享壕礼，百万积分送不停'
  var title = '金哥邀你砸金蛋'
  // var imgUrl = 'https://fintechapp-prd-1258285289.cos.ap-guangzhou.myqcloud.com/ops/2019-12/1577329167238-3ddc9f07708d44239149b3b592f0290f.png'
  var msg = `{"text": "${content}"}`.replace(/\s+/g, '')
  var newObjStr = `{"title": "${title}","content":"${content.replace(
        /\s+/g,
        ''
      )}","imgUrl":"","httpUrl":"${window.location.href}"}` // 暂时配置在测试环境
  msg = msg || null
  var u = navigator.userAgent
  var isApp = /C_\d+(\.)\d+(\.)\d+/.test(u)
  var appStr
  var appVerName
  var firstVer
  var secondVer
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端

  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // 判断是否为iphone终端
  if (isApp) {
    appStr = u.match(/C_\d+(\.)\d+(\.)\d+/)
    appVerName = appStr[0].split('_')[1]
    firstVer = appVerName.split('.')[0]
    secondVer = appVerName.split('.')[1]
  }
  if (isAndroid) {
    if (window.CgwsH5JS) {
      // 分享信息
      if (firstVer <= '1' && secondVer <= '10') {
        if (msg && window.CgwsH5JS.setShareInfo) {
          window.CgwsH5JS.setShareInfo(msg)
        }
      } else {
        if (newObjStr && window.CgwsH5JS.setShareInfo) {
          window.CgwsH5JS.setShareInfo(newObjStr)
        }
      }
      // 夜间模式
      var obj = JSON.parse(window.CgwsH5JS.isNightMode()) // alert('obj:' + JSON.stringify(obj));

      if (obj.nightmode === true) {
        // alert('nightmode:' + JSON.stringify(obj.nightmode));
        // cb();
      }
    }
  }

  if (isiOS) {
    var setupWebViewJavascriptBridge = function setupWebViewJavascriptBridge(
      callback
    ) {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge)
      }

      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback)
      }

      window.WVJBCallbacks = [callback]
      var WVJBIframe = document.createElement('iframe')
      WVJBIframe.style.display = 'none'
      WVJBIframe.src = 'https://__bridge_loaded__'
      document.documentElement.appendChild(WVJBIframe)
      setTimeout(function() {
        document.documentElement.removeChild(WVJBIframe)
      }, 0)
    }

    setupWebViewJavascriptBridge(function(bridge) {
      // 夜间模式
      bridge.callHandler(
        'themeMode', {
          '': ''
        },
        function responseCallback(responseData) {
          // console.log(responseData)
          if (responseData === 1) {
            // cb();
          }
        }
      )

      // 分享信息
      if (msg) {
        bridge.registerHandler('getContentText', function(
          data,
          responseCallback
        ) {
          // 获取IOS返回的数据
          // alert(data);
          // 把处理好的结果返回给OC
          responseCallback(msg)
        })
      }
      if (firstVer >= '1' && secondVer > '10') {
        if (newObjStr) {
          setTimeout(function() {
            bridge.callHandler(
              'setShareInfo',
              newObjStr,
              function responseCallback(responseData) {
                // console.log(responseData)
                if (responseData === 1) {}
              }
            )
          }, 200)
        }
      }
    })
  }
}

export { getUserAgent }
