import sensors from 'sa-sdk-javascript'
// import envConfig from '../env';
// import { addData } from './index';

const ActName = '欢乐砸金蛋20200601'
const page_name = 'Act_zjd_20200601'

function getSensorsServerUrl() {
  if (window.location.hostname === 'fintechapp.cgws.com') {
    // 生产环境地址
    return 'https://data.cgws.com/sa_statistics/sa?project=production'
  } else {
    // 测试环境地址
    return 'https://data.cgws.com/sa_statistics/sa?project=default'
  }
}

let newId
const serverUrl = getSensorsServerUrl()
// 神策埋点初始化
const initSensors = function(userId) {
  newId = userId
  sensors.init({
    server_url: serverUrl,
    heatmap: {
      clickmap: 'default',
      scroll_notice_map: 'not_collect'
    },
    // 单页面的时候跳转路由也会触发神策的埋点浏览，关闭则是进入整个项目只会触发一次神策的埋点
    is_track_single_page: false, // SPA采集开关
    use_app_track: true // 打通App 和 H5
  })
  sensors.quick('isReady', function() {
    const wxOpenId = sensors.store.getDistinctId()
    // addData('wxOpenId', wxOpenId);
  })
  sensors.quick('autoTrack', {
    ActName: ActName,
    page_name: page_name,
    ShareUserId: userId || ''
  })

  // 以异步加载 SDK 为例，神策 SDK 初始化完成，此时调用设置公共属性的方法，来保证之后的事件都有这些属性。
  sensors.registerPage({
    platform_type: 'H5',
    ActName: ActName,
    page_name: page_name,
    ShareUserId: userId || ''
  })
}
// 添加事件埋点
const trackEvent = function(name, props) {
  sensors.track(name, {
    ...props,
    ShareUserId: newId || ''
  })
}
export { initSensors, trackEvent }
