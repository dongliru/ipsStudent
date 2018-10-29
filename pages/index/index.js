//index.js
//获取应用实例
import utils from '../../utils/util.js';
import api from '../../utils/api.js'
import * as echarts from '../../ec-canvas/echarts.js';

const app = getApp()
let chart1 = {};
let chart = {};

const initChart = function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  return chart;
}

const initChart1 = function initChart1(canvas, width, height) {
  chart1 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart1);
  return chart1;
}
Page({
  data: {
    ec: {
      onInit: initChart
    },
    ec1: {
      onInit: initChart1
    },
    UrlParams: {
      cityCode: null,
      classId: null,
      stuId: null,
      teacherType: null,
      teacherId: null
    },
    userImageSign: true,
    currentClassList: {
      cityCode: null,
      classDate: null,
      classId: null,
      passCount: null,
      className: null
    },
    currentList: {
      className: null
    },
    options: "",
    activeCharts: 0,
    activeCharts2: 0,
    listClass: [],
    hasHeader: true,
    defaultName: "",
    userInfoObj: {
      userImageSrc: "",
      userName: "",
      userAttend: "",
      userGoal: ""
    },
    stuAnswer: {
      mathAnswerNum: null, //Math.floor((answerNum➗qstNum)*100) = <=30显示提示
      mathStuAnswer: null, //  Math.floor((题目数➗首次正确)*100) = 正确率
      mathhomework: null, //  Math.floor(submitHomeworkNum➗homeworkNum)*100)
      qstNum: null, //题目数   题目数➗首次正确 = 正确率
      firstRightNum: null, // 首次正确
      submitHomeworkNum: null, //提交作业次数
      homeworkNum: null, // 应提交总次数
      rank: null, // 第xxx名
      stuNum: null, // 本班共xxx人
      answerNum: 0 // 学生答题数
    },
    performance: {
      onScreens: null,
      remarkTags: null
    },
    classCourse: {
      //本班级走势
      courseOrder: [], // 横坐标
      rank: [] // 数据
    },
    knlgRightRatio: [], // 薄弱知识点
    homeworkCourse: [],
    showClassList: false,
    knowledegIndex: null,
    showHomework: 3,
    chartsData: "",
    chartsData2: "",
    chartsBarData: "",
    errorTxt: null,
    userInfoObj: {
      userImageSrc: "",
      userName: "哈哈",
      userAttend: "北京小学",
      userGoal: "北京大学"
    },
    motto: 'Hello World',
    userInfo: {},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getRequest(str) {
    var theRequest = new Object();
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
    }
    return theRequest;
  },
  changeURLArg(url, arg, arg_val) {
    var pattern = arg + "=([^&]*)";
    var replaceText = arg + "=" + arg_val;
    if (url.match(pattern)) {
      var tmp = "/(" + arg + "=)([^&]*)/gi";
      tmp = url.replace(eval(tmp), replaceText);
      return tmp;
    } else {
      if (url.match("[?]")) {
        return url + "&" + replaceText;
      } else {
        return url + "?" + replaceText;
      }
    }
    return url + "\n" + arg + "\n" + arg_val;
  },
  // 获取所有班级
  listClassByStuIdAndTeacherId(params) {
    utils.http({
      url: api.listClassByStuIdAndTeacherId + '?' + params,
      method: 'GET',
    }).then(response => {
      if (response.data) {
        this.listClass = response.data;
        console.log(response.data[0].className);
        this.setData({
          "currentClassList.className": response.data[0].className,
          "currentClassList.passCount": response.data[0].passCount
        })
      }
    })
  },
  // 获取学员班级数据统计
  getStuAnswerStatByCla(params) {
    utils.http({
        url: api.getStuAnswerStatByCla + '?' + params,
        method: 'GET',
      })
      .then(response => {
        // var answerNum = parseInt(response.data.answerNum);
        // console.log(response)
        this.setData({
          "stuAnswer.answerNum": parseInt(response.data.answerNum),
        })
        if (this.data.stuAnswer.answerNum > 0) {
          this.setData({
            "stuAnswer.mathAnswerNum": Math.floor(response.data.answerNum / response.data.qstNum * 100),
            "stuAnswer.mathStuAnswer": Math.round(response.data.firstRightNum / response.data.qstNum * 100),
            "stuAnswer.mathhomework": Math.floor(
              response.data.submitHomeworkNum / response.data.homeworkNum * 100
            ),
          })
        } else {
          this.setData({
            "stuAnswer.mathAnswerNum": 0,
            "stuAnswer.mathStuAnswer": 0,
            "stuAnswer.mathhomework": 0,
          })
        }
        this.setData({
          "stuAnswer.qstNum": parseInt(response.data.qstNum),
          "stuAnswer.firstRightNum": response.data.firstRightNum,
          "stuAnswer.submitHomeworkNum": response.data.submitHomeworkNum,
          "stuAnswer.homeworkNum": response.data.homeworkNum,
          "stuAnswer.rank": response.data.rank,
          "stuAnswer.stuNum": response.data.stuNum,
        })
        console.log(this.data.stuAnswer.mathStuAnswer);
        this.data.knlgRightRatio = [];
        this.data.homeworkCourse = [];

        this.getChartData(params);
        this.listRightRatioCourse(params);
        if (this.data.stuAnswer.answerNum) {
          // this.data.listNotSubmitHomeworkCourse(classId, params);
          this.listOneKnlgRightRatio(params);
        }
      })
      .catch(error => {
        this.errorMth();
        console.log(error);
      });
  },
  // 薄弱知识点
  listOneKnlgRightRatio(params) {
    utils.http({
        url: api.listOneKnlgRightRatio + '?' + params,
      }).then(response => {
        this.knlgRightRatio = response;
        this.setData({
          'knlgRightRatio': response.data
        })
        console.log(this.knlgRightRatio, 2222);
      })
      .catch(error => {
        this.errorMth();
        console.log(error);
      });
  },
  // 正确率排名走势
  listRightRatioCourse(params) {
    utils.http({
        url: api.listRightRatioCourse + '?' + params,
        method: 'GET'
      })
      .then(response => {
        let option1 = {
          courseOrder: response.data.courseOrder,
          rightRatioCourse: response.data.fixedClassRightRatio,
          rightRatioCourse2: response.data.fixedRightRatio
        };
        let option2 = {
          courseOrder: response.data.courseOrder,
          rightRatioCourse: response.data.firstClassRightRatio,
          rightRatioCourse2: response.data.firstRightRatio
        };
        if (this.data.activeCharts2 === 1) {
          this.setData({
            "chartsData2": option1
          })
        } else {
          this.setData({
            "chartsData2": option2
          })
        }

        chart.setOption({
          xAxis: {
            type: "category",
            data: []
              .concat(this.data.chartsData2.courseOrder)
              .concat([this.data.chartsData2.courseOrder.length + 1]),
            axisLabel: {
              formatter: "第{value}讲",
              color: "#a8a8a8",
              showMinLabel: false,
              showMaxLabel: false,
              interval: 0
            },
            axisLine: {
              show: false
            },
            axisTick: {
              interval: 0,
              show: false
            },
            splitLine: {
              interval: 0,
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#dadce6"
              }
            },
            minInterval: 1,
            boundaryGap: false
          },
          yAxis: {
            name: "正确率",
            type: "value",
            minInterval: 1,
            min: "dataMin",
            //                    maxInterval: 20,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#a8a8a8"
              }
            },
            axisLabel: {
              formatter: "{value} %",
              color: "#a8a8a8"
            }
          },
          series: [{
              lineStyle: {
                shadowColor: "#dadce6",
                shadowBlur: 10,
                shadowOffsetY: 15
              },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    formatter: "{c}%",
                    color: "#b2bac8"
                  },
                  color: "#7ED981"
                }
              },
              selectedMode: false,
              smooth: false, //设置折线图平滑
              data: [null].concat(this.data.chartsData2.rightRatioCourse).concat(null),
              type: "line",
              symbolSize: 10
            },
            {
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    formatter: "{c}%",
                    color: "#b2bac8"
                  },
                  color: "#5894FF"
                }
              },
              selectedMode: false,
              smooth: false, //设置折线图平滑
              data: [null].concat(this.data.chartsData2.rightRatioCourse2).concat(null),
              type: "line",
              symbolSize: 10
            }
          ]
        })
        // this.chartsData2 = this.activeCharts2 === 1 ? option1 : option2; //response;

        // if (this.activeCharts2 == 1) {
        //   this.dataClick("学习情况订正后人数");
        // }
      })
      .catch(error => {
        // this.errorMth();
        console.log(error);
      });
  },
  // 课次排名走势
  getChartData(params) {
    var dataurl;
    if (!this.data.stuAnswer.answerNum) {
      this.data.chartsData = "";
      return;
    }
    if (this.data.activeCharts === 0) {
      dataurl = api.listRankByCla + '?' + params;
    } else {
      // 同班型
      dataurl = api.listRankByClaLev + '?' + params;
      // this.dataClick("学习情况本地同班型");
    }
    utils.http({
        url: dataurl,
        method: 'GET'
      }).then(response => {
        // console.log("课次排名走势", response.data);
        let option1 = {
          courseOrder: response.data.courseOrder,
          rank: response.data.rank
        };
        let option2 = {
          courseOrder: response.data.courseOrder,
          rank: response.data.rank
        };
        // console.log(option2)
        this.setData({
          'chartsData': option2
        })

        chart1.setOption({
          xAxis: {
            type: "category",
            data: []
              .concat(this.data.chartsData.courseOrder)
              .concat([this.data.chartsData.courseOrder.length + 1]),
            axisLabel: {
              formatter: "第{value}讲",
              color: "#a8a8a8",
              showMinLabel: false,
              showMaxLabel: false,
              interval: 0
            },
            axisLine: {
              show: false
            },
            axisTick: {
              interval: 0,
              show: false
            },
            nameTextStyle: {
              align: "center"
            },
            splitLine: {
              interval: 0,
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#dadce6"
              }
            },
            minInterval: 1,
            nameLocation: "center",
            boundaryGap: false
          },
          yAxis: {
            name: "名次",
            type: "value",
            minInterval: 1,
            inverse: true,
            min: Math.max.apply(Math, this.data.chartsData.rank) <= 1 ? 2 : 1,
            max: Math.max.apply(Math, this.data.chartsData.rank),
            splitLine: {
              show: false
            },
            axisLabel: {
              color: "#a8a8a8"
            },
            axisLine: {
              lineStyle: {
                color: "#a8a8a8"
              }
            }
          },
          series: [{
            lineStyle: {
              shadowColor: "#dadce6",
              shadowBlur: 10,
              shadowOffsetY: 15
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  color: "#b2bac8"
                },
                color: "#7ED981"
              }
            },
            selectedMode: false,
            smooth: false, //设置折线图平滑
            data: [null].concat(this.data.chartsData.rank).concat(null),
            type: "line",
            symbolSize: 10
          }]
        })
        // this.data.chartsData = this.data.activeCharts === 1 ? option1 : option2; 
        console.log(this.data.chartsData)
      })
      .catch(error => {
        // this.errorMth();
        console.log("课次排名走势", error);
      });
  },
  knowledge(index) {
    console.log(1111);
    if (this.data.knowledegIndex == index) {
      this.data.knowledegIndex = null;
    } else {
      this.data.knowledegIndex = index;
      // this.data.dataClick("学习情况知识点");
    }
  },
  headerToggle() {
    var href = utils.getCurrentPageUrlWithArgs()
    if (href.indexOf("encode") > 0) {
      this.hasHeader = false;
    } else {
      this.hasHeader = true;
    }
  },
  onLoad: function() {
    const params = 'cityCode=010&stuId=ff80808165a4bc1c0165b4a06c8517bd&teacherType=0&teacherId=ff8080814da63215014da92748741274&classId=ff8080816009294201600b8fe13d74f8&uid=ff80808165a4bc1c0165b4a06c8517bd';
    // this.listClassByStuIdAndTeacherId('ff8080816009294201600b8fe13d74f8',params);
    this.listClassByStuIdAndTeacherId(params);
    // utils.getCurrentPageUrlWithArgs()
    this.headerToggle();
    this.getStuAnswerStatByCla(params);
    this.listOneKnlgRightRatio(params);
    this.listRightRatioCourse(params);
    //  chart.setOption({
    //     xAxis: {
    //       type: "category",
    //       data: []
    //         .concat(this.chartsData.courseOrder)
    //         .concat([this.chartsData.courseOrder.length + 1]),
    //       axisLabel: {
    //         formatter: "第{value}讲",
    //         color: "#a8a8a8",
    //         showMinLabel: false,
    //         showMaxLabel: false,
    //         interval: 0
    //       },
    //       axisLine: {
    //         show: false
    //       },
    //       axisTick: {
    //         interval: 0,
    //         show: false
    //       },
    //       splitLine: {
    //         interval: 0,
    //         show: true,
    //         lineStyle: {
    //           type: "dashed",
    //           color: "#dadce6"
    //         }
    //       },
    //       minInterval: 1,
    //       boundaryGap: false
    //     },
    //     yAxis: {
    //       name: "正确率",
    //       type: "value",
    //       minInterval: 1,
    //       min: "dataMin",
    //       //                    maxInterval: 20,
    //       splitLine: {
    //         show: false
    //       },
    //       axisLine: {
    //         lineStyle: {
    //           color: "#a8a8a8"
    //         }
    //       },
    //       axisLabel: {
    //         formatter: "{value} %",
    //         color: "#a8a8a8"
    //       }
    //     },
    //     series: [
    //       {
    //         lineStyle: {
    //           shadowColor: "#dadce6",
    //           shadowBlur: 10,
    //           shadowOffsetY: 15
    //         },
    //         itemStyle: {
    //           normal: {
    //             label: {
    //               show: true,
    //               formatter: "{c}%",
    //               color: "#b2bac8"
    //             },
    //             color: "#7ED981"
    //           }
    //         },
    //         selectedMode: false,
    //         smooth: false, //设置折线图平滑
    //         data: [null].concat(this.chartsData.rightRatioCourse).concat(null),
    //         type: "line",
    //         symbolSize: 10
    //       },
    //       {
    //         itemStyle: {
    //           normal: {
    //             label: {
    //               show: true,
    //               formatter: "{c}%",
    //               color: "#b2bac8"
    //             },
    //             color: "#5894FF"
    //           }
    //         },
    //         selectedMode: false,
    //         smooth: false, //设置折线图平滑
    //         data: [null].concat(this.chartsData.rightRatioCourse2).concat(null),
    //         type: "line",
    //         symbolSize: 10
    //       }
    //     ]
    //   });

  },

})