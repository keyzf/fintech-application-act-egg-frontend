import axios from 'axios'
import ServerUrl from './server'
import axiosCustom from '../utils/request.js'

// const activityCode = ServerUrl.getActivityCode

// 获取验证码接口
function getUserSmsCode(params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(ServerUrl.SEND_API, {
        ...params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        console.log('失败', error)
      })
  })
}
// 手机号登录接口
function getUserLoginInfo(params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(ServerUrl.ACTION_API, {
        ...params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        console.log('失败', error)
      })
  })
}
// 获取用户信息的接口
// function getUserInfo (params = {}) {
//   return new Promise((resolve, reject) => {
//     axiosCustom.post(ServerUrl.ISNOT_API, {
//         ...params
//       })
//       .then(response => {
//         resolve(response.data)
//       })
//       .catch(error => {
//         console.log('失败', error)
//       })
//   })
// }
// 抽奖的接口
function joinLuckyDraw (params = {}) {
  return new Promise((resolve, reject) => {
    axiosCustom.post(ServerUrl.DRAW_API, {
        ...params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        console.log('失败', error)
      })
  })
}
// 我的奖品的接口
function getMyPrizeAction (params = {}) {
  return new Promise((resolve, reject) => {
    axiosCustom.post(ServerUrl.PRIZE_API, {
        ...params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        console.log('失败', error)
      })
  })
}
// 所有奖品的接口
function getDrawAction (params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(ServerUrl.ALL_API, {
        ...params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        console.log('失败', error)
      })
  })
}
export {
  getUserSmsCode,
  getUserLoginInfo,
  // getUserInfo,
  joinLuckyDraw,
  getMyPrizeAction,
  getDrawAction
}
