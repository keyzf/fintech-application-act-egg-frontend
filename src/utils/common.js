import store from '../store/index.js'

// 获取url中的参数
const getUrlKey = function(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
}

/**
 * 判断是否是微信平台
 */
function isWechatPlatform() {
  var ua = window.navigator.userAgent.toLocaleLowerCase()
  var isWechat = ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)[0] === 'micromessenger'
  if (isWechat) {
    return true
  } else {
    return false
  }
}

/**
 * 判断是否APP中
 */
function getIsAppPlatform() {
  const userAgentUse = navigator.userAgent.toLowerCase() // 获取判断用的对象
  const isApp = userAgentUse.match('customuseragent_c')
  return isApp && isApp[0] === 'customuseragent_c' ? 1 : 0
}

/**
 * 获取传递sessionID 的参数
 */
function getSendParams() {
  var jsonData = JSON.parse(sessionStorage.getItem('userInfo'))
  if (jsonData) {
    const token = jsonData.access_token
    const sessionid = jsonData.sessionid
    const timestamp = Date.parse(new Date()) // 时间戳
    const nonce = Math.random().toString().slice(-6) // 6位随机数
    const signature = sha1(`access_token=${token}&nonce=${nonce}&timestamp=${timestamp}`) // sha1加密
    const obj = {
      timestamp,
      nonce,
      sessionid,
      signature
    }
    return obj
  } else {
    return {}
  }
}

// 获取唤起app的地址@param {*} url  @param {*} type
function getAppTypeLink(url, type) {
  if (!url) {
    return false
  }
  // 动态获取域名&端口
  const { hostname, port, protocol } = window.location
  const host = hostname + (port ? `:${port}` : '')
  // app中打开地址
  const pointHtml = protocol + '//' + (host) + url
  // 默认正式环境
  const useHost = hostname
  // type=指向环境[1=测试环境，2=研发环境]
  let Agreement = 'cgwswealth://' /// 生产环境
  if (hostname === 'devfintech.cgws.com') { // 开发环境
    Agreement = 'cgwswealthdev://'
  } else if (hostname === 'stgfintech.cgws.com') { // 测试环境
    Agreement = 'cgwswealthtest://'
  }
  const res = `${Agreement}${useHost}?type=h5&url=${encodeURIComponent(pointHtml)}`
  return res
}

/**
 * 在微信中的跳转
 */
function getSkipInwechat() {
  // const weChat = isWechatPlatform()
  const href = window.location.href
  // 动态获取域名&端口
  const { hostname, port, protocol } = window.location
  const host = hostname + (port ? `:${port}` : '')
  // app中打开地址
  // const pointHtml = protocol + '//' + 'fintech.cgws.com' + '/act/fintech-application-act-egg/#/?channel=gold'
  // const Agreement = 'cgwswealth://' /// 生产环境
  // const useHost = 'fintech.cgws.com'
  let url
  if (port) {
    url = `https://${hostname}:8443/oss-guidance/index.html?type=h5&url=${encodeURIComponent(href)}`
  } else {
    url = `https://fintechapp.cgws.com/oss-guidance/index.html?type=h5&url=${encodeURIComponent(href)}`
  }
  return url
}
// 获取登录信息
function updateUserInfo(data) {
  // 更新用户登录信息
  const userInfo = JSON.parse(data)
  // 已登录并且拿到登录信息-<进入信息解析
  if (userInfo.access_token && userInfo.access_token.length) {
    // 缓存到本地
    var strVal = JSON.stringify(userInfo)
    sessionStorage.setItem('userInfo', strVal)
    // 存储到vuex
    store.dispatch('setAuthorization', true)
    store.dispatch('setsuer', userInfo)
  } else if (!userInfo.access_token && !userInfo.sessionid) {
    // 未登录并且无登录信息->进入登录界面
    // window.goNativeLogin();
  }
}

// 展示底部的说明文字
function activeDescription() {
  var u = navigator.userAgent
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // Android终端
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // IOS 终端
  var explainArr = [
    '1.活动时间：2020.6.15-2020.7.20',
    '2.活动期间每人有一次免费砸金蛋的机会。',
    '3.抽中积分的客户请下载并登录长城炼金术app查看积分详情；抽中卡券的客户请下载并登录长城炼金术，前往我的奖品查看卡号卡密。',
    '4.针对恶意刷取奖励等现象，一经核实将取消奖励发放及追回奖励。',
    '5.活动最终解释权归长城证券所有。'
  ]
  if (isIOS) {
    explainArr.push('6.本活动与APPLE INC.无关。')
  }
  return explainArr
}

export { getUrlKey, isWechatPlatform, getIsAppPlatform, getSendParams, getSkipInwechat, updateUserInfo, activeDescription }
