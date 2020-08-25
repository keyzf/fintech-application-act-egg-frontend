import axios from 'axios'
import { customizeHeaders } from './signature.js'
// import store from '../store/index.js'

const axiosCustom = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 10000 // request timeout
})

// 请求拦截
axiosCustom.interceptors.request.use(config => {
  // 挂载请求头设置签名
  // config.headers = {
  //   ...config.headers,
  //   ...customizeHeaders(config.url, config.params, config.method)
  // }
  // get条件下拼接query
  let queryString = ''
  if (config.method === 'get' && config.params) {
    queryString = Object.keys(config.params).map(key => key + '=' + config.params[key]).join('&')
    queryString = '&' + queryString
  }
  var jsonData = JSON.parse(sessionStorage.getItem('userInfo'))
  // var vuexData = store.state.user
  // console.log('vuexData', vuexData)
  let obj
  if (jsonData) {
    const token = jsonData.access_token
    const sessionid = jsonData.sessionid
    const timestamp = Date.parse(new Date()) // 时间戳
    const nonce = Math.random().toString().slice(-6) // 6位随机数
    const signature = sha1(`access_token=${token}&nonce=${nonce}&timestamp=${timestamp}&url=${config.url}${queryString}`) // sha1加密
    obj = {
      timestamp,
      nonce,
      sessionid,
      signature,
      url: config.url
    }
  } else {
    obj = {}
  }
  if (config.method === 'post') {
    config.data = {
      ...config.data,
      ...obj
    }
  } else if (config.method === 'get') {
    config.params = {
      ...obj,
      ...config.params
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
axiosCustom.interceptors.response.use(response => {
  // endLoading()
  return response
}, error => {
  // Message.error(error.response.data)
  // endLoading();

  // 获取状态码
  // const { status } = error.response;

  // 当借口报错 服务挂掉的时候增加页面提示
  const body = document.querySelector('body')
  body.style.display = 'flex'
  body.style.justifyContent = 'center'
  body.style.alignItems = 'center'
  body.innerHTML = `<div style="padding: 10px;background-color: rgba(58, 58, 58, .9);font-size: 12px;color: #fff;border-radius: 5px;">系统拥堵，请稍后尝试</div>`

  if (status === 401) {
    // Message.error("token失效,请重新登录");
    // 清除token
    // localStorage.removeItem('eleToken');
    // 重新登录
    // router.push('/login')
  }

  return Promise.reject(error)
})

export default axiosCustom
