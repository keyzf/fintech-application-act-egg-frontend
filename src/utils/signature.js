import sha1 from 'crypto-js/sha1'

/* 本地数据操作封装 */
const addData = function(key, val) {
  var strVal = JSON.stringify(val)
  sessionStorage.setItem(key, strVal)
}

const getData = function(key) {
  var jsonData = sessionStorage.getItem(key)
  if (jsonData) {
    return JSON.parse(jsonData)
  } else {
    return undefined
  }
}

// 随机数helper
const randomNum = (times) => {
  let num = ''
  for (let i = 0; i < times; i++) {
    num += Math.floor(Math.random() * 10)
  }
  return num
}

// 请求头添加数字签名
const customizeHeaders = (url, params, method) => {
  let userInfo
  const info = getData('userInfo')
  if (typeof info === 'object') {
    userInfo = info
  } else if (typeof info === 'string') {
    userInfo = JSON.parse(info)
  }
  userInfo = {
    access_token: '1245adsfaf',
    sessionid: '125dateawewgfdsfsafds'
  }
  if (!userInfo) { // 如果没有用户信息 则拉取本地token
    // const { access_token } = this.$store.getters.user
    // 本地开发读取缓存token
    // const localToken = getUseDevelop() ? localStorage.getItem('wxToken') : ''
    // 获取token
    // var resToken = this.$store.getters.user.access_token || ''
    // resToken = resToken.replace(/"/gi, '')
    return { 'credit-mall-token': '', activity_token: '', 'Content-Type': 'application/json' }
  } else {
    // 无数字签名白名单集合
    // const whiteList = [ServerUrl.getCount, ServerUrl.getQuotesList]
    // const whiteStatus = whiteList.some(item => item === url)
    // if (whiteStatus) {
    //   return {}
    // }
    // get条件下拼接query
    // let queryString = ''
    // if (method === 'get' && params) {
    //   queryString = Object.keys(params)
    //     .map(key => key + '=' + params[key])
    //     .join('&')
    //   queryString = '&' + queryString
    // }
    const nonce = randomNum(6)
    const timestamp = new Date().getTime()
    const sha1Str = `access_token=${userInfo.access_token}&nonce=${nonce}&timestamp=${timestamp}`
    const signature = sha1(sha1Str).toString()

    return {
      nonce: nonce,
      signature: signature,
      timestamp: timestamp,
      sessionid: userInfo.sessionid
    }
  }
}

export {
  addData,
  getData,
  customizeHeaders
}
