import { updateUserInfo } from './common.js'
// 和原生交互的方法
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  const WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'https://__bridge_loaded__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}
export default {
  callhandler(name, data, callback) {
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler(name, data, callback)
    })
  },
  registerhandler(name, callback) {
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.registerHandler(name, function(data, responseCallback) {
        callback(data, responseCallback)
      })
    })
  },
  registerhandler_share(name, callback) { // 注册点击app分享按钮的回调方法
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.registerHandler(name, function(data, responseCallback) {
        callback(data, responseCallback)
      })
    })
  },
  registerhandler_shareSuccess(name, callback) { // 注册分享成功回调方法
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.registerHandler(name, function(data, responseCallback) {
        callback(data, responseCallback)
      })
    })
  },
  // 进入页面获取 Token
  getAccessToken(fn) {
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // Android终端
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // IOS 终端
    if (isAndroid) {
      try {
        var data = CgwsH5JS.getAccessToken()
        updateUserInfo(data)
        fn && fn(data)
      } catch (e) {
        console.log(e.message)
      }
    } else {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('getAccessToken', 1, function(data) {
          updateUserInfo(data)
          fn && fn(data)
        })
      })
    }
  },
  // 拉起原生登录
  goNativeLogin(fn) {
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // Android终端
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // IOS 终端
    var params = JSON.stringify({
      loginType: 1
    })
    if (isAndroid) {
      try {
        CgwsH5JS.login(params)
        fn && fn()
      } catch (e) {
        console.log(e.message)
      }
    } else {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('login', params, function(response) {
          fn && fn()
        })
      })
    }
  },
  // 跳转积分商城
  jumpNative(jumpUrl) {
    var u = navigator.userAgent
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // Android终端
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // IOS 终端
    if (isAndroid) {
      try {
        window.CgwsH5JS.jumpToNative(jumpUrl)
      } catch (e) {
        console.log(e.message)
      }
    } else if (isIOS) {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('jumpToNative', jumpUrl, function() {
          // fn && fn();
        })
      })
    }
  }
}
