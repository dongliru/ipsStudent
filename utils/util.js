import * as echarts from '../ec-canvas/echarts.js';
// 是否是生产环境
const production = true

const http = options => {
  // header.Token = wx.getStorageSync('TOKEN')
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      data: options.data,
      // header: header,
      method: options.method || 'POST',
      // dataType: 'json',
      success: res => {
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject('服务器异常，请稍后重试')
        }
      },
      fail: err => {
        reject('服务器异常，请稍后重试')
      }
    })
  })
}

/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

function initChartCreator(option) {
  return function initChart(canvas, width, height) {
    var chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    canvas.setChart(chart);
    chart.setOption(option);
    return chart;
  }
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

const baseUrl = production ? 'https://dw.speiyou.cn' : 'https://dw-test.speiyou.cn'

module.exports = {
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs:getCurrentPageUrlWithArgs,
  initChartCreator: initChartCreator,
  baseUrl: baseUrl,
  http:http
}
