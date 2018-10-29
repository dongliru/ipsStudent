import utils from './util.js'

let root = utils.baseUrl;
//  课中表现
let getClassPerformanceByStuIdAndClaId = root + "/teacher-app-data/getClassPerformanceByStuIdAndClaId";
// 获取所有班级
let listClassByStuIdAndTeacherId = root + "/teacher-app-data/listClassByStuIdAndTeacherId";
// 获取学员班级数据统计
let getStuAnswerStatByCla = root + "/teacher-app-data/getStuAnswerStatByCla";
// 本班级
let listRankByCla = root + "/teacher-app-data/listRankByCla";
// 同型
let listRankByClaLev = root + "/teacher-app-data/listRankByClaLev";
// 未提交作业
let listNotSubmitHomeworkCourse = root + "/teacher-app-data/listNotSubmitHomeworkCourse"
// 正确率排名走势
let listRightRatioCourse = root + "/teacher-app-data/listRightRatioCourse"
// 薄弱知识点
let listOneKnlgRightRatio = root + "/teacher-app-data/listOneKnlgRightRatio"
module.exports = {
  root: root,
  getClassPerformanceByStuIdAndClaId: getClassPerformanceByStuIdAndClaId,
  listClassByStuIdAndTeacherId: listClassByStuIdAndTeacherId,
  getStuAnswerStatByCla: getStuAnswerStatByCla,
  listRankByCla: listRankByCla,
  listRankByClaLev: listRankByClaLev,
  listNotSubmitHomeworkCourse: listNotSubmitHomeworkCourse,
  listRightRatioCourse: listRightRatioCourse,
  listOneKnlgRightRatio: listOneKnlgRightRatio,
}