var http = require("http"),
  express = require("express"),
  api = express(),
  moment = require('moment'),
  Timesheet = require("../models/TimesheetModel"),
  Task = require("../models/TaskModel")
Category = require("../models/CategoryModel"),
  User = require("../models/UserModel");

let getProductivityReport = (filter, res) => {

  let developers = 0,
    leads = 0,
    taskInProgress = 0;
  let total1 = 0,
    total2 = 0,
    total3 = 0,
    total4 = 0,
    total5 = 0,
    total6 = 0,
    total7 = 0,
    total8 = 0,
    total9 = 0,
    total10 = 0,
    total11 = 0,
    total12 = 0,

    total13 = 0,
    total14 = 0,
    total15 = 0,
    total16 = 0,
    total17 = 0,
    total18 = 0,
    total19 = 0,
    total20 = 0,
    total21 = 0,
    total22 = 0,
    total23 = 0,
    total24 = 0,

    total25 = 0,
    total26 = 0,
    total27 = 0,
    total28 = 0,
    total29 = 0,
    total30 = 0,
    total31 = 0,
    total32 = 0,
    total33 = 0,
    total34 = 0,
    total35 = 0,
    total36 = 0,
    productiveHours = 0,
    training = 0;


  var obj1 = {};
  var obj2 = {};
  var obj3 = {};
  var obj4 = {};
  var obj5 = {};
  var obj6 = {};
  var weeks = {};

  obj1['productive'] = 0;
  obj1['training'] = 0;
  obj1['coordination'] = 0;
  obj1['meeting'] = 0;
  obj1['idleTime'] = 0;
  obj1['vacation'] = 0;
  obj1['includingVacation'] = 0;

  obj2['productive'] = 0;
  obj2['training'] = 0;
  obj2['coordination'] = 0;
  obj2['meeting'] = 0;
  obj2['idleTime'] = 0;
  obj2['vacation'] = 0;
  obj2['includingVacation'] = 0;

  obj3['productive'] = 0;
  obj3['training'] = 0;
  obj3['coordination'] = 0;
  obj3['meeting'] = 0;
  obj3['idleTime'] = 0;
  obj3['vacation'] = 0;
  obj3['includingVacation'] = 0;

  obj4['productive'] = 0;
  obj4['training'] = 0;
  obj4['coordination'] = 0;
  obj4['meeting'] = 0;
  obj4['idleTime'] = 0;
  obj4['vacation'] = 0;
  obj4['includingVacation'] = 0;

  obj5['productive'] = 0;
  obj5['training'] = 0;
  obj5['coordination'] = 0;
  obj5['meeting'] = 0;
  obj5['idleTime'] = 0;
  obj5['vacation'] = 0;
  obj5['includingVacation'] = 0;

  obj6['productive'] = 0;
  obj6['training'] = 0;
  obj6['coordination'] = 0;
  obj6['meeting'] = 0;
  obj6['idleTime'] = 0;
  obj6['vacation'] = 0;
  obj6['includingVacation'] = 0;

  let currentDay = moment(new Date()).day(),
    n = currentDay + 2,
    firstWeekEndDate = new Date(new Date().getTime() - (n * 24 * 60 * 60 * 1000)),
    firstWeekStartDate = new Date(firstWeekEndDate.getTime() - (6 * 24 * 60 * 60 * 1000)),
    secondWeekEndDate = new Date(firstWeekStartDate.getTime() - (1 * 24 * 60 * 60 * 1000)),
    secondWeekStartDate = new Date(firstWeekStartDate.getTime() - (7 * 24 * 60 * 60 * 1000)),

    thirdWeekEndDate = new Date(secondWeekStartDate.getTime() - (1 * 24 * 60 * 60 * 1000)),
    thirdWeekStartDate = new Date(secondWeekStartDate.getTime() - (7 * 24 * 60 * 60 * 1000)),
    forthWeekEndDate = new Date(thirdWeekStartDate.getTime() - (1 * 24 * 60 * 60 * 1000)),
    forthWeekStartDate = new Date(thirdWeekStartDate.getTime() - (7 * 24 * 60 * 60 * 1000)),

    fifthWeekEndDate = new Date(forthWeekStartDate.getTime() - (1 * 24 * 60 * 60 * 1000)),
    fifthWeekStartDate = new Date(forthWeekStartDate.getTime() - (7 * 24 * 60 * 60 * 1000)),
    sixthWeekEndDate = new Date(fifthWeekStartDate.getTime() - (1 * 24 * 60 * 60 * 1000)),
    sixthdWeekStartDate = new Date(fifthWeekStartDate.getTime() - (7 * 24 * 60 * 60 * 1000));

  User.find(filter).then(function (user, user_err) {

    Task.find(filter).then(function (task, task_err) {

      Timesheet.find(filter).find({ status: 'submitted' }).then(function (timesheet, timesheet_err) {

        // category.forEach((item) => {
        //   productivityobj[item._id] = {
        //     category:item.category,
        //     developers: 0,
        //     leads: 0,
        //     taskInProgress: 0,
        //     weeks: {
        //       week1: {training: 0, co_ordination: 0, meeting: 0, vacation: 0, time_available: 0},
        //       week2: {training: 0, co_ordination: 0, meeting: 0, vacation: 0, time_available: 0},
        //       week3: {training: 0, co_ordination: 0, meeting: 0, vacation: 0, time_available: 0},
        //       week4: {training: 0, co_ordination: 0, meeting: 0, vacation: 0, time_available: 0},
        //       week5: {training: 0, co_ordination: 0, meeting: 0, vacation: 0, time_available: 0},
        //       week6: {training: 0, co_ordination: 0, meeting: 0, vacation: 0, time_available: 0}
        //     }
        //   };
        // });

        user.forEach((item) => {
          if (item.role.indexOf('DEVELOPER') > -1 && item.status == 'active') {
            developers++;
          };
          if (item.role.indexOf('LEAD') > -1 && item.status == 'active') {
            leads++;
          }
        })

        task.forEach((item) => {
          if (item.status != 'CANCELLED' && item.status != 'DELIVERED') {
            taskInProgress++;
          }
        })

        timesheet.forEach((item) => {
          if (item.aDate.setHours(0, 0, 0, 0) >= firstWeekStartDate.setHours(0, 0, 0, 0) && item.aDate.setHours(0, 0, 0, 0) <= firstWeekEndDate.setHours(0, 0, 0, 0)) {
            if (item.type == 'productive') {
              let seconds = (+parseInt(item.hours)) * 60 * 60;
              total1 += seconds;
              let hours = Math.floor(total1 / 3600);
              let min = Math.floor(((total1 - (hours * 3600)) / 60) / 100);
              obj1[item.type] = hours + min;
            }
            if (item.type == 'non-productive') {
              // console.log(item);
              if (item.subType == 'training') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total2 += seconds1;
                let hours = Math.floor(total2 / 3600);
                let min = Math.floor(((total2 - (hours * 3600)) / 60) / 100);
                obj1[item.subType] = hours + min;
              }
              if (item.subType == 'co-ordination') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total3 += seconds1;
                let hours = Math.floor(total3 / 3600);
                let min = Math.floor(((total3 - (hours * 3600)) / 60) / 100);
                obj1.coordination = hours + min;
              }
              if (item.subType == 'meeting') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total4 += seconds1;
                let hours = Math.floor(total4 / 3600);
                let min = Math.floor(((total4 - (hours * 3600)) / 60) / 100);
                obj1[item.subType] = hours + min;
              }
              if (item.subType == 'time-available') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total5 += seconds1;
                let hours = Math.floor(total5 / 3600);
                let min = Math.floor(((total5 - (hours * 3600)) / 60) / 100);
                obj1.idleTime = hours + min;
              }
            }
            if (item.type == 'vacation') {
              let seconds1 = (+parseInt(item.hours)) * 60 * 60;
              total6 += seconds1;
              let hours = Math.floor(total6 / 3600);
              let min = Math.floor(((total6 - (hours * 3600)) / 60) / 100);
              obj1[item.type] = hours + min;
            }
            // console.log(typeof training);
            // console.log(productiveHours);
          }

          if (item.aDate.setHours(0, 0, 0, 0) >= secondWeekStartDate.setHours(0, 0, 0, 0) && item.aDate.setHours(0, 0, 0, 0) <= secondWeekEndDate.setHours(0, 0, 0, 0)) {
            if (item.type == 'productive') {
              let seconds = (+parseInt(item.hours)) * 60 * 60;
              total7 += seconds;
              let hours = Math.floor(total7 / 3600);
              let min = Math.floor(((total7 - (hours * 3600)) / 60) / 100);
              obj2[item.type] = hours + min;
            }
            if (item.type == 'non-productive') {
              // console.log(item);
              if (item.subType == 'training') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total8 += seconds1;
                let hours = Math.floor(total8 / 3600);
                let min = Math.floor(((total8 - (hours * 3600)) / 60) / 100);
                obj2[item.subType] = hours + min;
              }
              if (item.subType == 'co-ordination') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total9 += seconds1;
                let hours = Math.floor(total9 / 3600);
                let min = Math.floor(((total9 - (hours * 3600)) / 60) / 100);
                obj2.coordination = hours + min;
              }
              if (item.subType == 'meeting') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total10 += seconds1;
                let hours = Math.floor(total10 / 3600);
                let min = Math.floor(((total10 - (hours * 3600)) / 60) / 100);
                obj2[item.subType] = hours + min;
              }
              if (item.subType == 'time-available') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total11 += seconds1;
                let hours = Math.floor(total11 / 3600);
                let min = Math.floor(((total11 - (hours * 3600)) / 60) / 100);
                obj2.idleTime = hours + min;
              }
            }
            if (item.type == 'vacation') {
              let seconds1 = (+parseInt(item.hours)) * 60 * 60;
              total12 += seconds1;
              let hours = Math.floor(total12 / 3600);
              let min = Math.floor(((total12 - (hours * 3600)) / 60) / 100);
              obj2[item.type] = hours + min;
            }
            // console.log(typeof training);
            // console.log(productiveHours);
          }

          if (item.aDate.setHours(0, 0, 0, 0) >= thirdWeekStartDate.setHours(0, 0, 0, 0) && item.aDate.setHours(0, 0, 0, 0) <= thirdWeekEndDate.setHours(0, 0, 0, 0)) {
            if (item.type == 'productive') {
              let seconds = (+parseInt(item.hours)) * 60 * 60;
              total13 += seconds;
              let hours = Math.floor(total13 / 3600);
              let min = Math.floor(((total13 - (hours * 3600)) / 60) / 100);
              obj3[item.type] = hours + min;
            }
            if (item.type == 'non-productive') {
              // console.log(item);
              if (item.subType == 'training') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total14 += seconds1;
                let hours = Math.floor(total14 / 3600);
                let min = Math.floor(((total14 - (hours * 3600)) / 60) / 100);
                obj3[item.subType] = hours + min;
              }
              if (item.subType == 'co-ordination') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total15 += seconds1;
                let hours = Math.floor(total15 / 3600);
                let min = Math.floor(((total15 - (hours * 3600)) / 60) / 100);
                obj3.coordination = hours + min;
              }
              if (item.subType == 'meeting') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total16 += seconds1;
                let hours = Math.floor(total16 / 3600);
                let min = Math.floor(((total16 - (hours * 3600)) / 60) / 100);
                obj3[item.subType] = hours + min;
              }
              if (item.subType == 'time-available') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total17 += seconds1;
                let hours = Math.floor(total17 / 3600);
                let min = Math.floor(((total17 - (hours * 3600)) / 60) / 100);
                obj3.idleTime = hours + min;
              }
            }
            if (item.type == 'vacation') {
              let seconds1 = (+parseInt(item.hours)) * 60 * 60;
              total18 += seconds1;
              let hours = Math.floor(total18 / 3600);
              let min = Math.floor(((total18 - (hours * 3600)) / 60) / 100);
              obj3[item.type] = hours + min;
            }
            // console.log(typeof training);
            // console.log(productiveHours);
          }

          if (item.aDate.setHours(0, 0, 0, 0) >= forthWeekStartDate.setHours(0, 0, 0, 0) && item.aDate.setHours(0, 0, 0, 0) <= forthWeekEndDate.setHours(0, 0, 0, 0)) {
            if (item.type == 'productive') {
              let seconds = (+parseInt(item.hours)) * 60 * 60;
              total19 += seconds;
              let hours = Math.floor(total19 / 3600);
              let min = Math.floor(((total19 - (hours * 3600)) / 60) / 100);
              obj4[item.type] = hours + min;
            }
            if (item.type == 'non-productive') {
              // console.log(item);
              if (item.subType == 'training') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total20 += seconds1;
                let hours = Math.floor(total20 / 3600);
                let min = Math.floor(((total20 - (hours * 3600)) / 60) / 100);
                obj4[item.subType] = hours + min;
              }
              if (item.subType == 'co-ordination') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total21 += seconds1;
                let hours = Math.floor(total21 / 3600);
                let min = Math.floor(((total21 - (hours * 3600)) / 60) / 100);
                obj4.coordination = hours + min;
              }
              if (item.subType == 'meeting') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total22 += seconds1;
                let hours = Math.floor(total22 / 3600);
                let min = Math.floor(((total22 - (hours * 3600)) / 60) / 100);
                obj4[item.subType] = hours + min;
              }
              if (item.subType == 'time-available') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total23 += seconds1;
                let hours = Math.floor(total23 / 3600);
                let min = Math.floor(((total23 - (hours * 3600)) / 60) / 100);
                obj4.idleTime = hours + min;
              }
            }
            if (item.type == 'vacation') {
              let seconds1 = (+parseInt(item.hours)) * 60 * 60;
              total24 += seconds1;
              let hours = Math.floor(total24 / 3600);
              let min = Math.floor(((total24 - (hours * 3600)) / 60) / 100);
              obj4[item.type] = hours + min;
            }
            // console.log(typeof training);
            // console.log(productiveHours);
          }

          if (item.aDate.setHours(0, 0, 0, 0) >= fifthWeekStartDate.setHours(0, 0, 0, 0) && item.aDate.setHours(0, 0, 0, 0) <= fifthWeekEndDate.setHours(0, 0, 0, 0)) {
            if (item.type == 'productive') {
              let seconds = (+parseInt(item.hours)) * 60 * 60;
              total25 += seconds;
              let hours = Math.floor(total25 / 3600);
              let min = Math.floor(((total25 - (hours * 3600)) / 60) / 100);
              obj5[item.type] = hours + min;
            }
            if (item.type == 'non-productive') {
              // console.log(item);
              if (item.subType == 'training') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total26 += seconds1;
                let hours = Math.floor(total26 / 3600);
                let min = Math.floor(((total26 - (hours * 3600)) / 60) / 100);
                obj5[item.subType] = hours + min;
              }
              if (item.subType == 'co-ordination') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total27 += seconds1;
                let hours = Math.floor(total27 / 3600);
                let min = Math.floor(((total27 - (hours * 3600)) / 60) / 100);
                obj5.coordination = hours + min;
              }
              if (item.subType == 'meeting') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total28 += seconds1;
                let hours = Math.floor(total28 / 3600);
                let min = Math.floor(((total28 - (hours * 3600)) / 60) / 100);
                obj5[item.subType] = hours + min;
              }
              if (item.subType == 'time-available') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total29 += seconds1;
                let hours = Math.floor(total29 / 3600);
                let min = Math.floor(((total29 - (hours * 3600)) / 60) / 100);
                obj5.idleTime = hours + min;
              }
            }
            if (item.type == 'vacation') {
              let seconds1 = (+parseInt(item.hours)) * 60 * 60;
              total30 += seconds1;
              let hours = Math.floor(total30 / 3600);
              let min = Math.floor((total30 - (hours * 3600)) / 60);
              obj5[item.type] = hours + min;
            }
            // console.log(typeof training);
            // console.log(productiveHours);
          }

          if (item.aDate.setHours(0, 0, 0, 0) >= sixthdWeekStartDate.setHours(0, 0, 0, 0) && item.aDate.setHours(0, 0, 0, 0) <= sixthWeekEndDate.setHours(0, 0, 0, 0)) {
            if (item.type == 'productive') {
              let seconds = (+parseInt(item.hours)) * 60 * 60;
              total31 += seconds;
              let hours = Math.floor(total31 / 3600);
              let min = Math.floor(((total31 - (hours * 3600)) / 60) / 100);
              obj6[item.type] = hours + min;
            }
            if (item.type == 'non-productive') {
              // console.log(item);
              if (item.subType == 'training') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total32 += seconds1;
                let hours = Math.floor(total32 / 3600);
                let min = Math.floor(((total32 - (hours * 3600)) / 60) / 100);
                obj6[item.subType] = hours + min;
              }
              if (item.subType == 'co-ordination') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total33 += seconds1;
                let hours = Math.floor(total33 / 3600);
                let min = Math.floor(((total33 - (hours * 3600)) / 60) / 100);
                obj6.coordination = hours + min;
              }
              if (item.subType == 'meeting') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total34 += seconds1;
                let hours = Math.floor(total34 / 3600);
                let min = Math.floor(((total34 - (hours * 3600)) / 60) / 100);
                obj6[item.subType] = hours + min;
              }
              if (item.subType == 'time-available') {
                let seconds1 = (+parseInt(item.hours)) * 60 * 60;
                total35 += seconds1;
                let hours = Math.floor(total35 / 3600);
                let min = Math.floor(((total35 - (hours * 3600)) / 60) / 100);
                obj6.idleTime = hours + min;
              }
            }
            if (item.type == 'vacation') {
              let seconds1 = (+parseInt(item.hours)) * 60 * 60;
              total36 += seconds1;
              let hours = Math.floor(total36 / 3600);
              let min = Math.floor((total36 - (hours * 3600)) / 60);
              obj6[item.type] = hours + min;
            }
            // console.log(typeof training);
            // console.log(productiveHours);
          }

        })

        Object.keys(obj1).forEach(function (key, index) {
          week6_value = obj1[key];
          if (week6_value) {
            obj1.includingVacation += week6_value;
          }
        });
        Object.keys(obj2).forEach(function (key, index) {
          week5_value = obj2[key];
          if (week5_value) {
            obj2.includingVacation += week5_value;
          }
        });
        Object.keys(obj3).forEach(function (key, index) {
          week4_value = obj3[key];
          if (week4_value) {
            obj3.includingVacation += week4_value;
          }
        });
        Object.keys(obj4).forEach(function (key, index) {
          week3_value = obj4[key];
          if (week3_value) {
            obj4.includingVacation += week3_value;
          }
        });
        Object.keys(obj5).forEach(function (key, index) {
          week2_value = obj5[key];
          if (week2_value) {
            obj5.includingVacation += week2_value;
          }
        });
        Object.keys(obj6).forEach(function (key, index) {
          week1_value = obj6[key];
          if (week1_value) {
            obj6.includingVacation += week1_value;
          }
        });

        obj1.includingVacation = week6_value;
        obj1.excludingVacation = obj1.includingVacation - obj1.vacation;

        obj2.includingVacation = week5_value;
        obj2.excludingVacation = obj2.includingVacation - obj2.vacation;

        obj3.includingVacation = week4_value;
        obj3.excludingVacation = obj3.includingVacation - obj3.vacation;

        obj4.includingVacation = week3_value;
        obj4.excludingVacation = obj4.includingVacation - obj4.vacation;

        obj5.includingVacation = week2_value;
        obj5.excludingVacation = obj5.includingVacation - obj5.vacation;

        obj6.includingVacation = week1_value;
        obj6.excludingVacation = obj6.includingVacation - obj6.vacation;

        weeks["week6"] = obj1;
        weeks["week5"] = obj2;
        weeks["week4"] = obj3;
        weeks["week3"] = obj4;
        weeks["week2"] = obj5;
        weeks["week1"] = obj6;

        res.send({ developers, leads, taskInProgress, weeks });
      })

    })

  })

}

let getProductivityReportOverall = (filter, res) => {
  let total1 = 0,
    total2 = 0,
    total3 = 0,
    total4 = 0,
    total5 = 0,
    total6 = 0,
    productiveHours = 0,
    training = 0;

  var obj1 = {};
  obj1['productive'] = 0;
  obj1['training'] = 0;
  obj1['coordination'] = 0;
  obj1['meeting'] = 0;
  obj1['idleTime'] = 0;
  obj1['vacation'] = 0;
  obj1['includingVacation'] = 0;

  return Timesheet.find(filter).then(function (timesheet, timesheet_err) {

    timesheet.forEach((item) => {
      if (item.type == 'productive') {
        let seconds = (+parseInt(item.hours)) * 60 * 60;
        total1 += seconds;
        let hours = Math.floor(total1 / 3600);
        let min = Math.floor(((total1 - (hours * 3600)) / 60) / 100);
        obj1[item.type] = hours + min;
      }
      if (item.type == 'non-productive') {
        // console.log(item);
        if (item.subType == 'training') {
          let seconds1 = (+parseInt(item.hours)) * 60 * 60;
          total2 += seconds1;
          let hours = Math.floor(total2 / 3600);
          let min = Math.floor(((total2 - (hours * 3600)) / 60) / 100);
          obj1[item.subType] = hours + min;
        }
        if (item.subType == 'co-ordination') {
          let seconds1 = (+parseInt(item.hours)) * 60 * 60;
          total3 += seconds1;
          let hours = Math.floor(total3 / 3600);
          let min = Math.floor(((total3 - (hours * 3600)) / 60) / 100);
          obj1.coordination = hours + min;
        }
        if (item.subType == 'meeting') {
          let seconds1 = (+parseInt(item.hours)) * 60 * 60;
          total4 += seconds1;
          let hours = Math.floor(total4 / 3600);
          let min = Math.floor(((total4 - (hours * 3600)) / 60) / 100);
          obj1[item.subType] = hours + min;
        }
        if (item.subType == 'time-available') {
          let seconds1 = (+parseInt(item.hours)) * 60 * 60;
          total5 += seconds1;
          let hours = Math.floor(total5 / 3600);
          let min = Math.floor(((total5 - (hours * 3600)) / 60) / 100);
          obj1.idleTime = hours + min;
        }
      }
      if (item.type == 'vacation') {
        let seconds1 = (+parseInt(item.hours)) * 60 * 60;
        total6 += seconds1;
        let hours = Math.floor(total6 / 3600);
        let min = Math.floor(((total6 - (hours * 3600)) / 60) / 100);
        obj1[item.type] = hours + min;
      }

      // console.log(item.aDate.moment().format(YYYY-MM-DD));
    })

    Object.keys(obj1).forEach(function (key, index) {
      total_vlaue = obj1[key];
      if (total_vlaue) {
        obj1.includingVacation += total_vlaue;
      }
    });

    obj1.includingVacation = total_vlaue;
    obj1.excludingVacation = obj1.includingVacation - obj1.vacation;

    res.send(obj1)
  })
}

api.get('/productivity-report', function (req, res) {
  let filter = {};
  req.query.categoryId ? filter.categoryId = req.query.categoryId : "";
  getProductivityReport(filter, res);
})

api.get('/productivity-report-overall', function (req, res) {
  let filter = {};
  req.query.categoryId ? filter.categoryId = req.query.categoryId : "";
  if (req.query.year) {
    filter['$or'] = [
      {
        aDate: {
          '$lte': moment().year(req.query.year).endOf('year').format('YYYY-MM-DD'),
          '$gte': moment().year(req.query.year).startOf('year').format('YYYY-MM-DD')
        }
      }
    ]
  }
  // {'$or': {aDate: {'$lte':ISODate("2017-12-31"),'$gte':ISODate("2017-01-01")}}}

  getProductivityReportOverall(filter, res);
})

module.exports = api;
