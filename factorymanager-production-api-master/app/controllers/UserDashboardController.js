var express = require('express');
var Task = require('../models/TaskModel');
var Timesheet = require('../models/TimesheetModel');
var Notifications = require("../models/NotificationModel");
var api = express.Router();
var moment = require('moment');

api.get('/user-dashboard', function (req, res) {
  var token = req.decoded;
  filter3 = {};
  filter4 = {};
  if (req.query.userId && req.query.categoryId) {
    if (token.role.indexOf('ADMIN') > -1 || token.role.indexOf('MANAGER') > -1 || token.role.indexOf('LEAD') > -1 || token.role.indexOf('GUEST') > -1) {
      if (req.query.role == 'DEVELOPER') {
        filter3.developerId = req.query.userId;
      }
      if (req.query.role == 'LEAD') {
        filter3.leadId = req.query.userId;
      }

    }
    if (token.role.indexOf('ADMIN') > -1 || token.role.indexOf('MANAGER') > -1 || token.role.indexOf('LEAD') > -1 || token.role.indexOf('GUEST') > -1) {
      if (req.query.role == 'DEVELOPER') {
        filter4.taskOwnerId = req.query.userId;
      }
      if (req.query.role == 'LEAD') {
        filter4.categoryId = req.query.categoryId;
      }

    }
    Task.find(filter3).then(function (doc, err) {
      console.log(filter3.developerId);
      if (doc && doc.length > 0) {
        console.log(doc.length);
        var total = 0;
        var overallTotal = 0;
        var lastMonthTotal = 0;
        var lastWeekTotal = 0;
        var totalSpend = 0;
        var dueToday = 0;
        var cDate = new Date().setHours(0, 0, 0, 0);
        var dueWeek = 0;
        var overDue = 0;
        var totalTask = doc.length;
        var taskPending = 0;
        var inTake = 0;
        var cab = 0;
        var build = 0;
        var test = 0;
        var hold = 0;
        var overallOTD = 0;
        var lastWeekOTD = 0;
        var lastMonthOTD = 0;
        var overallOT = 0;
        var lastWeekOT = 0;
        var lastMonthOT = 0;
        var overallITD = 0;
        var overallIT = 0;
        var lastMonthITD = 0;
        var lastMonthIT = 0;
        var lastWeekITD = 0;
        var lastWeekIT = 0;
        var d = new Date().getDay();
        var m = new Date().getMonth() - 1;
        var y = new Date().getFullYear();
        console.log(m);
        //console.log(y);
        var firstDay = new Date(y, m);
        var lastDay = new Date(y, m + 1);
        lastDay = new Date(lastDay.getTime() - (1 * 24 * 60 * 60 * 1000));
        console.log('FD------' + firstDay);
        console.log('LD--------' + lastDay);
        firstDay = firstDay.setHours(0, 0, 0, 0);
        lastDay = lastDay.setHours(0, 0, 0, 0);
        var n = 1 + d;
        var n2 = new Date(new Date().getTime() - (n * 24 * 60 * 60 * 1000));
        var n3 = new Date(n2.getTime() + (6 * 24 * 60 * 60 * 1000));
        var n4 = new Date(n2.getTime() - (7 * 24 * 60 * 60 * 1000));
        var n5 = new Date(n3.getTime() - (7 * 24 * 60 * 60 * 1000));
        var myDate = new Date();
        myDate.setHours(0, 0, 0, 0);
        n2 = n2.setHours(0, 0, 0, 0);
        n3 = n3.setHours(0, 0, 0, 0);
        n4 = n4.setHours(0, 0, 0, 0);
        n5 = n5.setHours(0, 0, 0, 0);
        console.log(cDate);
        for (var i = 0; i < doc.length; i++) {
          (function (j) {
            if (doc[i].plannedEndDate) {
              if (cDate === doc[i].plannedEndDate.setHours(0, 0, 0, 0) && (doc[i].status != 'DELIVERED' && doc[i].status != 'CANCELLED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS')) {
                dueToday++;
              }
              if (n2 <= doc[i].plannedEndDate.setHours(0, 0, 0, 0) && doc[i].plannedEndDate.setHours(0, 0, 0, 0) <= n3 && (doc[i].status != 'DELIVERED' && doc[i].status != 'CANCELLED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS')) {
                dueWeek++;
              }
              if (cDate > doc[i].plannedEndDate.setHours(0, 0, 0, 0) && (doc[i].status != 'DELIVERED' && doc[i].status != 'CANCELLED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS')) {
                overDue++;
              }
            }
            if (doc[i].status !== 'CANCELLED' && doc[i].status !== 'DELIVERED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS') {
              taskPending++;
              var t = doc[i].estimatedHours;
              if (doc[i].estimatedHours == undefined) {
                var t = 0;
                console.log(t);
              } else {
                now1 = parseInt(t) * 60 * 60;
                total += now1;
              }
              if (doc[i].hoursSpend && doc[i].hoursSpend != '0') {
                var ts = doc[i].hoursSpend.split('.');
                now2 = (+parseInt(ts[0])) * 60 * 60 + (+parseInt(ts[1])) * 60;
                totalSpend += now2;
              } else {
                totalSpend += 0;
              }
            }
            if (doc[i].status == 'NOT-STARTED' || doc[i].status == 'ESTIMATION-IN-PROGRESS') {
              inTake++;
            }
            if (doc[i].status == 'WAITING-FOR-CAB-APPROVAL') {
              cab++;
            }
            if (doc[i].status == 'TS-IN-PROGRESS' || doc[i].status == 'DEV-IN-PROGRESS') {
              build++;
            }
            if (doc[i].status == 'FUT-IN-PROGRESS' || doc[i].status == 'TESTING-IN-PROGRESS') {
              test++;
            }
            if (doc[i].status == 'DEV-ON-HOLD' || doc[i].status == 'TEST-ON-HOLD') {
              hold++;
            }
            if (doc[i].estimatedHours == 0 || doc[i].estimatedHours == '' || doc[i].estimatedHours == null || doc[i].estimatedHours == undefined) {
              //return res.send({status:'fill estimated Hours for all task'})
              var estimatedHours = 0;
            }
            // else {
            //   if (doc[i].status == 'NOT-STARTED' || doc[i].status == 'ESTIMATION-IN-PROGRESS') {
            //     inTake++;
            //   }
            //   if (doc[i].status == 'WAITING-FOR-CAB-APPROVAL') {
            //     cab++;
            //   }
            //   if (doc[i].status == 'TS-IN-PROGRESS' || doc[i].status == 'DEV-IN-PROGRESS') {
            //     build++;
            //   }
            //   if (doc[i].status == 'FUT-IN-PROGRESS' || doc[i].status == 'TESTING-IN-PROGRESS') {
            //     test++;
            //   }
            //   if (doc[i].status == 'DEV-ON-HOLD' || doc[i].status == 'TEST-ON-HOLD') {
            //     hold++;
            //   }
            // }
            if (doc[i].status == 'DELIVERED') {
              if (doc[i].actualEndDate && doc[i].plannedEndDate == undefined) {
                var seconds = 0;
                //var seconds2 = (+parseInt(doc[i].estimatedHours)) * 60 * 60 ;
                overallOTD++;
                if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= seconds) {
                  overallOT++;
                }
                if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                  lastMonthOTD++;
                  if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= seconds) {
                    lastMonthOT++;
                  }
                }
                if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                  lastWeekOTD++;
                  if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= seconds) {
                    lastWeekOT++;
                  }
                }
              } else {
                overallOTD++;
                if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= doc[i].plannedEndDate.setHours(0, 0, 0, 0)) {
                  overallOT++;
                }
                if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                  lastMonthOTD++;
                  if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= doc[i].plannedEndDate.setHours(0, 0, 0, 0)) {
                    lastMonthOT++;
                  }
                }
                if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                  lastWeekOTD++;
                  if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= doc[i].plannedEndDate.setHours(0, 0, 0, 0)) {
                    lastWeekOT++;
                  }
                }
              }
              if (doc[i].hoursSpend || doc[i].hoursSpend == undefined) {
                if (doc[i].hoursSpend == undefined) {
                  var seconds = 0;
                  var seconds2 = (+parseInt(doc[i].estimatedHours)) * 60 * 60;
                  overallITD++;
                  console.log('OITD--------------------------------------------------------------------' + overallITD);
                  if (seconds <= seconds2) {
                    overallIT++;
                    console.log('OIT-------------------------------------------------------------------------------------------------' + overallIT);
                  }
                  if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                    lastMonthITD++;
                    if (seconds <= seconds2) {
                      lastMonthIT++;
                    }
                  }
                  if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                    lastWeekITD++;
                    if (seconds <= seconds2) {
                      lastWeekIT++;
                    }
                  }
                } else {
                  var a = doc[i].hoursSpend.split('.');
                  var seconds = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
                  var seconds2 = (+parseInt(doc[i].estimatedHours)) * 60 * 60;
                  overallITD++;
                  console.log('OITD--------------------------------------------------------------------' + overallITD);
                  if (seconds <= seconds2) {
                    overallIT++;
                    console.log('OIT-------------------------------------------------------------------------------------------------' + overallIT);
                  }
                  if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                    lastMonthITD++;
                    if (seconds <= seconds2) {
                      lastMonthIT++;
                    }
                  }
                  if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                    lastWeekITD++;
                    if (seconds <= seconds2) {
                      lastWeekIT++;
                    }
                  }
                }

              } else {
                overallITD = 0; overallIT = 0; lastMonthITD = 0; lastMonthIT = 0; lastWeekITD = 0; lastWeekIT = 0;
              }
            }
            //console.log('i------'+i);
            //console.log(doc[i]._id);
          })(i);
        }
        console.log('t--------' + total);
        console.log('TS-------' + totalSpend);
        if (totalSpend > total) {
          var availableHours = 0;
        } else {
          var availableHours = total - totalSpend;
        }

        var hours = Math.floor(availableHours / 3600);
        var min = Math.floor((availableHours - (hours * 3600)) / 60);
        console.log(hours + '.' + min);
        availableHours = hours + '.' + min;
        var hours = Math.floor(total / 3600);
        var min = Math.floor((total - (hours * 3600)) / 60);
        console.log(hours + '.' + min);
        total = hours + '.' + min;
        var taskCompleted = doc.length - taskPending;
        //console.log('tc-----------'+taskCompleted);

        if (overallOT == 0 && overallOTD == 0) {
          var oot = 100;
        } else {
          var oot = Math.round((overallOT / overallOTD) * 100);
        }
        if (lastMonthOT == 0 && lastMonthOTD == 0) {
          var mot = 100;
        } else {
          var mot = Math.round((lastMonthOT / lastMonthOTD) * 100);
        }
        if (lastWeekOT == 0 && lastWeekOTD == 0) {
          var wot = 100;
        } else {
          var wot = Math.round((lastWeekOT / lastWeekOTD) * 100);
        }
        if (overallIT == 0 && overallITD == 0) {
          var oit = 100;
        } else {
          var oit = Math.round((overallIT / overallITD) * 100);
        }
        if (lastMonthIT == 0 && lastMonthITD == 0) {
          var mit = 100;
        } else {
          var mit = Math.round((lastMonthIT / lastMonthITD) * 100);
        }
        if (lastWeekIT == 0 && lastWeekITD == 0) {
          var wit = 100;
        } else {
          var wit = Math.round((lastWeekIT / lastWeekITD) * 100);
        }
        Timesheet.find(filter4).populate('taskDetails').then(function (doc2, err) {
          if (doc2 && doc2.length > 0) {
            var overallProductiveHours = 0;
            var overallMeetingHours = 0;
            var overallAvailableHours = 0;
            var overallCoordinationHours = 0;
            var lastMonthProductiveHours = 0;
            var lastMonthMeetingHours = 0;
            var lastMonthAvailableHours = 0;
            var lastMonthCoordinationHours = 0;
            var lastWeekProductiveHours = 0;
            var lastWeekMeetingHours = 0;
            var lastWeekAvailableHours = 0;
            var lastWeekCoordinationHours = 0;
            console.log(doc2.length);
            var blank = [];
            for (var k = 0; k < doc2.length; k++) {
              (function (l) {
                if (doc2[k].type == 'productive') {
                  var ks = doc2[k].hours;
                  console.log(ks);
                  //now3 = (+parseInt(ks[0])) * 60 * 60 + (+parseInt(ks[1])) * 60;
                  now3 = moment.duration({ hours: ks }) / 1000;
                  console.log(now3);
                  overallProductiveHours += now3;
                }
                if (doc2[k].type == 'non-productive') {
                  if (doc2[k].subType == 'co-ordination') {
                    var ks2 = doc2[k].hours;
                    // now4 = (+parseInt(ks2[0])) * 60 * 60 + (+parseInt(ks2[1])) * 60;
                    now4 = moment.duration({ hours: ks2 }) / 1000;
                    overallCoordinationHours += now4;
                  }
                  if (doc2[k].subType == 'meeting') {
                    var ks3 = doc2[k].hours;
                    // now5 = (+parseInt(ks3[0])) * 60 * 60 + (+parseInt(ks3[1])) * 60;
                    now5 = moment.duration({ hours: ks3 }) / 1000;
                    overallMeetingHours += now5;
                  }
                  if (doc2[k].subType == 'time-available') {
                    var ks4 = doc2[k].hours;
                    // now6 = (+parseInt(ks4[0])) * 60 * 60 + (+parseInt(ks4[1])) * 60;
                    now6 = moment.duration({ hours: ks4 }) / 1000;
                    overallAvailableHours += now6;
                  }
                }
                if (firstDay <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= lastDay) {
                  //console.log(firstDay);
                  if (doc2[k].type == 'productive') {
                    //console.log('w----------------------'+doc2[k].type);
                    var ks5 = doc2[k].hours;
                    // now7 = (+parseInt(ks5[0])) * 60 * 60 + (+parseInt(ks5[1])) * 60;
                    now7 = moment.duration({ hours: ks5 }) / 1000;
                    lastMonthProductiveHours += now7;
                  }
                  if (doc2[k].type == 'non-productive') {
                    //console.log('w----------------------'+doc2[k].subType);
                    if (doc2[k].subType == 'co-ordination') {
                      var ks6 = doc2[k].hours;
                      // now8 = (+parseInt(ks6[0])) * 60 * 60 + (+parseInt(ks6[1])) * 60;
                      now8 = moment.duration({ hours: ks6 }) / 1000;
                      lastMonthCoordinationHours += now8;
                    }
                    if (doc2[k].subType == 'meeting') {
                      var ks7 = doc2[k].hours;
                      // now9 = (+parseInt(ks7[0])) * 60 * 60 + (+parseInt(ks7[1])) * 60;
                      now9 = moment.duration({ hours: ks7 }) / 1000;
                      lastMonthMeetingHours += now9;
                    }
                    if (doc2[k].subType == 'time-available') {
                      var ks8 = doc2[k].hours;
                      // now10 = (+parseInt(ks8[0])) * 60 * 60 + (+parseInt(ks8[1])) * 60;
                      now10 = moment.duration({ hours: ks8 }) / 1000;
                      lastMonthAvailableHours += now10;
                    }
                  }
                }
                if (n4 <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= n5) {
                  if (doc2[k].type == 'productive') {
                    //console.log('w----------------------'+doc2[k].type);
                    //console.log(doc2[k].type);
                    var ks9 = doc2[k].hours;
                    // now11 = (+parseInt(ks9[0])) * 60 * 60 + (+parseInt(ks9[1])) * 60;
                    now11 = moment.duration({ hours: ks9 }) / 1000;
                    lastWeekProductiveHours += now11;
                  }
                  if (doc2[k].type == 'non-productive') {
                    //console.log('w----------------------'+doc2[k].subType);
                    if (doc2[k].subType == 'co-ordination') {
                      var ks10 = doc2[k].hours;
                      //now12 = (+parseInt(ks10[0])) * 60 * 60 + (+parseInt(ks10[1])) * 60;
                      now12 = moment.duration({ hours: ks10 }) / 1000;
                      lastWeekCoordinationHours += now12;
                    }
                    if (doc2[k].subType == 'meeting') {
                      var ks11 = doc2[k].hours;
                      //now13 = (+parseInt(ks11[0])) * 60 * 60 + (+parseInt(ks11[1])) * 60;
                      now13 = moment.duration({ hours: ks11 }) / 1000;
                      lastWeekMeetingHours += now13;
                    }
                    if (doc2[k].subType == 'time-available') {
                      var ks12 = doc2[k].hours;
                      //now14 = (+parseInt(ks12[0])) * 60 * 60 + (+parseInt(ks12[1])) * 60;
                      now14 = moment.duration({ hours: ks12 }) / 1000;
                      lastWeekAvailableHours += now14;
                    }
                  }
                }

              })(k);
            }

            if (overallProductiveHours == '') {
              oph = 0
            } else {
              var oph = (overallProductiveHours / (overallProductiveHours + overallMeetingHours + overallCoordinationHours + overallAvailableHours)) * 100;
            }

            if (lastMonthProductiveHours == '') {
              lmph = 0;
            } else {
              var lmph = (lastMonthProductiveHours / (lastMonthProductiveHours + lastMonthMeetingHours + lastMonthCoordinationHours + lastMonthAvailableHours)) * 100;
            }

            if (lastWeekProductiveHours == '') {
              lwph = 0;
            } else {
              lwph = (lastWeekProductiveHours / (lastWeekProductiveHours + lastWeekMeetingHours + lastWeekCoordinationHours + lastWeekAvailableHours)) * 100;
            }

            Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
              res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
            });

          } else {
            var oph = 0;
            var lmph = 0;
            var lwph = 0;
            Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
              res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
            });
          }
        })

      } else if (doc.developerId == undefined && doc.leadId == undefined) {
        var total = 0;
        var availableHours = 0;
        var dueToday = 0;
        var dueWeek = 0;
        var overDue = 0;
        var taskPending = 0;
        var taskCompleted = 0;
        var inTake = 0;
        var cab = 0;
        var build = 0;
        var test = 0;
        var hold = 0;
        var overallOTD = 0;
        var lastWeekOTD = 0;
        var lastMonthOTD = 0;
        var overallOT = 0;
        var lastWeekOT = 0;
        var lastMonthOT = 0;
        var overallITD = 0;
        var overallIT = 0;
        var lastMonthITD = 0;
        var lastMonthIT = 0;
        var lastWeekITD = 0;
        var lastWeekIT = 0;
        var oot = 100;
        var mot = 100;
        var wot = 100;
        var oit = 100;
        var mit = 100;
        var wit = 100;

        Timesheet.find(filter4).populate('taskDetails').then(function (doc2, err) {
          if (doc2 && doc2.length > 0) {
            var overallProductiveHours = 0;
            var overallMeetingHours = 0;
            var overallAvailableHours = 0;
            var overallCoordinationHours = 0;
            var lastMonthProductiveHours = 0;
            var lastMonthMeetingHours = 0;
            var lastMonthAvailableHours = 0;
            var lastMonthCoordinationHours = 0;
            var lastWeekProductiveHours = 0;
            var lastWeekMeetingHours = 0;
            var lastWeekAvailableHours = 0;
            var lastWeekCoordinationHours = 0;
            console.log(doc2.length);
            var blank = [];
            for (var k = 0; k < doc2.length; k++) {
              (function (l) {
                if (doc2[k].type == 'productive') {
                  var ks = doc2[k].hours.split('.');
                  now3 = (+parseInt(ks[0])) * 60 * 60 + (+parseInt(ks[1])) * 60;
                  overallProductiveHours += now3;
                }
                if (doc2[k].type == 'non-productive') {
                  if (doc2[k].subType == 'co-ordination') {
                    var ks2 = doc2[k].hours.split('.')
                    now4 = (+parseInt(ks2[0])) * 60 * 60 + (+parseInt(ks2[1])) * 60;
                    overallCoordinationHours += now4;
                  }
                  if (doc2[k].subType == 'meeting') {
                    var ks3 = doc2[k].hours.split('.')
                    now5 = (+parseInt(ks3[0])) * 60 * 60 + (+parseInt(ks3[1])) * 60;
                    overallMeetingHours += now5;
                  }
                  if (doc2[k].subType == 'time-available') {
                    var ks4 = doc2[k].hours.split('.')
                    now6 = (+parseInt(ks4[0])) * 60 * 60 + (+parseInt(ks4[1])) * 60;
                    overallAvailableHours += now6;
                  }
                }
                if (firstDay <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= lastDay) {
                  //console.log(firstDay);
                  if (doc2[k].type == 'productive') {
                    //console.log('w----------------------'+doc2[k].type);
                    var ks5 = doc2[k].hours.split('.');
                    now7 = (+parseInt(ks5[0])) * 60 * 60 + (+parseInt(ks5[1])) * 60;
                    lastMonthProductiveHours += now7;
                  }
                  if (doc2[k].type == 'non-productive') {
                    //console.log('w----------------------'+doc2[k].subType);
                    if (doc2[k].subType == 'co-ordination') {
                      var ks6 = doc2[k].hours.split('.')
                      now8 = (+parseInt(ks6[0])) * 60 * 60 + (+parseInt(ks6[1])) * 60;
                      lastMonthCoordinationHours += now8;
                    }
                    if (doc2[k].subType == 'meeting') {
                      var ks7 = doc2[k].hours.split('.')
                      now9 = (+parseInt(ks7[0])) * 60 * 60 + (+parseInt(ks7[1])) * 60;
                      lastMonthMeetingHours += now9;
                    }
                    if (doc2[k].subType == 'time-available') {
                      var ks8 = doc2[k].hours.split('.')
                      now10 = (+parseInt(ks8[0])) * 60 * 60 + (+parseInt(ks8[1])) * 60;
                      lastMonthAvailableHours += now10;
                    }
                  }
                }
                if (n4 <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= n5) {
                  if (doc2[k].type == 'productive') {
                    console.log('w----------------------' + doc2[k].type);
                    console.log(doc2[k].type);
                    var ks9 = doc2[k].hours.split('.');
                    now11 = (+parseInt(ks9[0])) * 60 * 60 + (+parseInt(ks9[1])) * 60;
                    lastWeekProductiveHours += now11;
                  }
                  if (doc2[k].type == 'non-productive') {
                    console.log('w----------------------' + doc2[k].subType);
                    if (doc2[k].subType == 'co-ordination') {
                      var ks10 = doc2[k].hours.split('.')
                      now12 = (+parseInt(ks10[0])) * 60 * 60 + (+parseInt(ks10[1])) * 60;
                      lastWeekCoordinationHours += now12;
                    }
                    if (doc2[k].subType == 'meeting') {
                      var ks11 = doc2[k].hours.split('.')
                      now13 = (+parseInt(ks11[0])) * 60 * 60 + (+parseInt(ks11[1])) * 60;
                      lastWeekMeetingHours += now13;
                    }
                    if (doc2[k].subType == 'time-available') {
                      var ks12 = doc2[k].hours.split('.')
                      now14 = (+parseInt(ks12[0])) * 60 * 60 + (+parseInt(ks12[1])) * 60;
                      lastWeekAvailableHours += now14;
                    }
                  }
                }

              })(k);
            }

            if (overallProductiveHours == '') {
              oph = 0
            } else {
              var oph = (overallProductiveHours / (overallProductiveHours + overallMeetingHours + overallCoordinationHours + overallAvailableHours)) * 100;
            }

            if (lastMonthProductiveHours == '') {
              lmph = 0;
            } else {
              var lmph = (lastMonthProductiveHours / (lastMonthProductiveHours + lastMonthMeetingHours + lastMonthCoordinationHours + lastMonthAvailableHours)) * 100;
            }

            if (lastWeekProductiveHours == '') {
              lwph = 0;
            } else {
              lwph = (lastWeekProductiveHours / (lastWeekProductiveHours + lastWeekMeetingHours + lastWeekCoordinationHours + lastWeekAvailableHours)) * 100;
            }


            Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
              res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
            });
          } else {
            var oph = 0;
            var lmph = 0;
            var lwph = 0;
            Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {

              res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
            });
          }
        })

        // return res.send({total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph});
        console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", oph);

        Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
          console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", oph);
          res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
        });
      } else {
        res.send(0, 0)
        //res.status(200).send({0,0})
        //res.send('no task there');
      }
    });
  }

  else if (req.query.categoryId) {
    filter5 = {};
    filter5.categoryId = req.query.categoryId
    var userFilter = { status: 'active', categoryId: req.query.categoryId, role: { $in: ['DEVELOPER', 'LEAD'] } };
    if (token.role.indexOf('ADMIN') > -1 || token.role.indexOf('MANAGER') > -1 || token.role.indexOf('GUEST') > -1) {
      Task.find(filter5).then(function (doc, err) {
        console.log(JSON.stringify(doc.categoryId));
        //console.log(JSON.stringify(req.query.categoryId == doc.categoryId));
        //console.log(doc);

        if (doc && doc.length > 0) {
          var total = 0;
          var overallTotal = 0;
          var lastMonthTotal = 0;
          var lastWeekTotal = 0;
          var totalSpend = 0;
          var dueToday = 0;
          var cDate = new Date().setHours(0, 0, 0, 0);
          var dueWeek = 0;
          var overDue = 0;
          var totalTask = doc.length;
          var taskPending = 0;
          var inTake = 0;
          var cab = 0;
          var build = 0;
          var test = 0;
          var hold = 0;
          var overallOTD = 0;
          var lastWeekOTD = 0;
          var lastMonthOTD = 0;
          var overallOT = 0;
          var lastWeekOT = 0;
          var lastMonthOT = 0;
          var overallITD = 0;
          var overallIT = 0;
          var lastMonthITD = 0;
          var lastMonthIT = 0;
          var lastWeekITD = 0;
          var lastWeekIT = 0;
          var d = new Date().getDay();
          var m = new Date().getMonth() - 1;
          var y = new Date().getFullYear();
          // var openNotifications = Notifications.find({user: req.query.userId, status: {$in: ['new', 'renotified']}).count();
          console.log(m);
          //console.log(y);
          var firstDay = new Date(y, m);
          var lastDay = new Date(y, m + 1);
          lastDay = new Date(lastDay.getTime() - (1 * 24 * 60 * 60 * 1000));
          console.log('FD------' + firstDay);
          console.log('LD--------' + lastDay);
          firstDay = firstDay.setHours(0, 0, 0, 0);
          lastDay = lastDay.setHours(0, 0, 0, 0);
          var n = 1 + d;
          var n2 = new Date(new Date().getTime() - (n * 24 * 60 * 60 * 1000));
          var n3 = new Date(n2.getTime() + (6 * 24 * 60 * 60 * 1000));
          var n4 = new Date(n2.getTime() - (7 * 24 * 60 * 60 * 1000));
          var n5 = new Date(n3.getTime() - (7 * 24 * 60 * 60 * 1000));
          var myDate = new Date();
          myDate.setHours(0, 0, 0, 0);
          n2 = n2.setHours(0, 0, 0, 0);
          n3 = n3.setHours(0, 0, 0, 0);
          n4 = n4.setHours(0, 0, 0, 0);
          n5 = n5.setHours(0, 0, 0, 0);
          console.log(cDate);
          for (var i = 0; i < doc.length; i++) {
            (function (j) {
              console.log(req.query.categoryId == doc[i].categoryId);
              if (req.query.categoryId = doc[i].categoryId) {
                if (doc[i].plannedEndDate) {
                  if (cDate === doc[i].plannedEndDate.setHours(0, 0, 0, 0) && (doc[i].status != 'DELIVERED' && doc[i].status != 'CANCELLED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS')) {
                    dueToday++;
                  }
                  if (n2 <= doc[i].plannedEndDate.setHours(0, 0, 0, 0) && doc[i].plannedEndDate.setHours(0, 0, 0, 0) <= n3 && (doc[i].status != 'DELIVERED' && doc[i].status != 'CANCELLED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS')) {
                    dueWeek++;
                  }
                  if (cDate > doc[i].plannedEndDate.setHours(0, 0, 0, 0) && (doc[i].status != 'DELIVERED' && doc[i].status != 'CANCELLED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS')) {
                    overDue++;
                  }
                }
                if (doc[i].status !== 'CANCELLED' && doc[i].status !== 'DELIVERED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS') {
                  taskPending++;
                  var t = doc[i].estimatedHours;
                  if (doc[i].estimatedHours == undefined) {
                    var t = 0;
                    console.log(t);
                  } else {
                    now1 = parseInt(t) * 60 * 60;
                    total += now1;
                  }
                  if (doc[i].hoursSpend && doc[i].hoursSpend != '0') {
                    var ts = doc[i].hoursSpend.split('.');
                    now2 = (+parseInt(ts[0])) * 60 * 60 + (+parseInt(ts[1])) * 60;
                    totalSpend += now2;
                  } else {
                    totalSpend += 0;
                  }
                }
                if (doc[i].status == 'NOT-STARTED' || doc[i].status == 'ESTIMATION-IN-PROGRESS') {
                  inTake++;
                }
                if (doc[i].status == 'WAITING-FOR-CAB-APPROVAL') {
                  cab++;
                }
                if (doc[i].status == 'TS-IN-PROGRESS' || doc[i].status == 'DEV-IN-PROGRESS') {
                  build++;
                }
                if (doc[i].status == 'FUT-IN-PROGRESS' || doc[i].status == 'TESTING-IN-PROGRESS') {
                  test++;
                }
                if (doc[i].status == 'DEV-ON-HOLD' || doc[i].status == 'TEST-ON-HOLD') {
                  hold++;
                }
                if (doc[i].estimatedHours == 0 || doc[i].estimatedHours == '' || doc[i].estimatedHours == null || doc[i].estimatedHours == undefined) {
                  //return res.send({status:'fill estimated Hours for all task'})
                  var estimatedHours = 0;
                }
                if (doc[i].status == 'DELIVERED') {
                  if (doc[i].actualEndDate && doc[i].plannedEndDate == undefined) {
                    var seconds = 0;
                    //var seconds2 = (+parseInt(doc[i].estimatedHours)) * 60 * 60 ;
                    overallOTD++;
                    if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= seconds) {
                      overallOT++;
                    }
                    if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                      lastMonthOTD++;
                      if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= seconds) {
                        lastMonthOT++;
                      }
                    }
                    if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                      lastWeekOTD++;
                      if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= seconds) {
                        lastWeekOT++;
                      }
                    }
                  } else {
                    overallOTD++;
                    if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= doc[i].plannedEndDate.setHours(0, 0, 0, 0)) {
                      overallOT++;
                    }
                    if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                      lastMonthOTD++;
                      if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= doc[i].plannedEndDate.setHours(0, 0, 0, 0)) {
                        lastMonthOT++;
                      }
                    }
                    if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                      lastWeekOTD++;
                      if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= doc[i].plannedEndDate.setHours(0, 0, 0, 0)) {
                        lastWeekOT++;
                      }
                    }
                  }
                  if (doc[i].hoursSpend || doc[i].hoursSpend == undefined) {
                    if (doc[i].hoursSpend == undefined) {
                      var seconds = 0;
                      var seconds2 = (+parseInt(doc[i].estimatedHours)) * 60 * 60;
                      overallITD++;
                      console.log('OITD--------------------------------------------------------------------' + overallITD);
                      if (seconds <= seconds2) {
                        overallIT++;
                        console.log('OIT-------------------------------------------------------------------------------------------------' + overallIT);
                      }
                      if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                        lastMonthITD++;
                        if (seconds <= seconds2) {
                          lastMonthIT++;
                        }
                      }
                      if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                        lastWeekITD++;
                        if (seconds <= seconds2) {
                          lastWeekIT++;
                        }
                      }
                    } else {
                      var a = doc[i].hoursSpend.split('.');
                      var seconds = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
                      var seconds2 = (+parseInt(doc[i].estimatedHours)) * 60 * 60;
                      overallITD++;
                      console.log('OITD--------------------------------------------------------------------' + overallITD);
                      if (seconds <= seconds2) {
                        overallIT++;
                        console.log('OIT-------------------------------------------------------------------------------------------------' + overallIT);
                      }
                      if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                        lastMonthITD++;
                        if (seconds <= seconds2) {
                          lastMonthIT++;
                        }
                      }
                      if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                        lastWeekITD++;
                        if (seconds <= seconds2) {
                          lastWeekIT++;
                        }
                      }
                    }

                  } else {
                    overallITD = 0; overallIT = 0; lastMonthITD = 0; lastMonthIT = 0; lastWeekITD = 0; lastWeekIT = 0;
                  }
                }
              } else {
                var oph = 0;
                var lmph = 0;
                var lwph = 0;
                Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
                  res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
                });
              }

              //console.log('i------'+i);
              //console.log(doc[i]._id);
            })(i);
          }
          console.log('t--------' + total);
          console.log('TS-------' + totalSpend);
          if (totalSpend > total) {
            var availableHours = 0;
          } else {
            var availableHours = total - totalSpend;
          }

          var hours = Math.floor(availableHours / 3600);
          var min = Math.floor((availableHours - (hours * 3600)) / 60);
          console.log(hours + '.' + min);
          availableHours = hours + '.' + min;
          var hours = Math.floor(total / 3600);
          var min = Math.floor((total - (hours * 3600)) / 60);
          console.log(hours + '.' + min);
          total = hours + '.' + min;
          var taskCompleted = doc.length - taskPending;
          //console.log('tc-----------'+taskCompleted);

          if (overallOT == 0 && overallOTD == 0) {
            var oot = 100;
          } else {
            var oot = Math.round((overallOT / overallOTD) * 100);
          }
          if (lastMonthOT == 0 && lastMonthOTD == 0) {
            var mot = 100;
          } else {
            var mot = Math.round((lastMonthOT / lastMonthOTD) * 100);
          }
          if (lastWeekOT == 0 && lastWeekOTD == 0) {
            var wot = 100;
          } else {
            var wot = Math.round((lastWeekOT / lastWeekOTD) * 100);
          }
          if (overallIT == 0 && overallITD == 0) {
            var oit = 100;
          } else {
            var oit = Math.round((overallIT / overallITD) * 100);
          }
          if (lastMonthIT == 0 && lastMonthITD == 0) {
            var mit = 100;
          } else {
            var mit = Math.round((lastMonthIT / lastMonthITD) * 100);
          }
          if (lastWeekIT == 0 && lastWeekITD == 0) {
            var wit = 100;
          } else {
            var wit = Math.round((lastWeekIT / lastWeekITD) * 100);
          }
          Timesheet.find(filter5).populate('taskDetails').then(function (doc2, err) {
            if (doc2 && doc2.length > 0) {
              var overallProductiveHours = 0;
              var overallMeetingHours = 0;
              var overallAvailableHours = 0;
              var overallCoordinationHours = 0;
              var lastMonthProductiveHours = 0;
              var lastMonthMeetingHours = 0;
              var lastMonthAvailableHours = 0;
              var lastMonthCoordinationHours = 0;
              var lastWeekProductiveHours = 0;
              var lastWeekMeetingHours = 0;
              var lastWeekAvailableHours = 0;
              var lastWeekCoordinationHours = 0;
              console.log(doc2.length);
              var blank = [];
              for (var k = 0; k < doc2.length; k++) {
                (function (l) {
                  if (doc2[k].type == 'productive') {
                    var ks = doc2[k].hours;
                    console.log(ks);
                    //now3 = (+parseInt(ks[0])) * 60 * 60 + (+parseInt(ks[1])) * 60;
                    now3 = moment.duration({ hours: ks }) / 1000;
                    console.log(now3);
                    overallProductiveHours += now3;
                  }
                  if (doc2[k].type == 'non-productive') {
                    if (doc2[k].subType == 'co-ordination') {
                      var ks2 = doc2[k].hours;
                      // now4 = (+parseInt(ks2[0])) * 60 * 60 + (+parseInt(ks2[1])) * 60;
                      now4 = moment.duration({ hours: ks2 }) / 1000;
                      overallCoordinationHours += now4;
                    }
                    if (doc2[k].subType == 'meeting') {
                      var ks3 = doc2[k].hours;
                      // now5 = (+parseInt(ks3[0])) * 60 * 60 + (+parseInt(ks3[1])) * 60;
                      now5 = moment.duration({ hours: ks3 }) / 1000;
                      overallMeetingHours += now5;
                    }
                    if (doc2[k].subType == 'time-available') {
                      var ks4 = doc2[k].hours;
                      // now6 = (+parseInt(ks4[0])) * 60 * 60 + (+parseInt(ks4[1])) * 60;
                      now6 = moment.duration({ hours: ks4 }) / 1000;
                      overallAvailableHours += now6;
                    }
                  }
                  if (firstDay <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= lastDay) {
                    //console.log(firstDay);
                    if (doc2[k].type == 'productive') {
                      //console.log('w----------------------'+doc2[k].type);
                      var ks5 = doc2[k].hours;
                      // now7 = (+parseInt(ks5[0])) * 60 * 60 + (+parseInt(ks5[1])) * 60;
                      now7 = moment.duration({ hours: ks5 }) / 1000;
                      lastMonthProductiveHours += now7;
                    }
                    if (doc2[k].type == 'non-productive') {
                      //console.log('w----------------------'+doc2[k].subType);
                      if (doc2[k].subType == 'co-ordination') {
                        var ks6 = doc2[k].hours;
                        // now8 = (+parseInt(ks6[0])) * 60 * 60 + (+parseInt(ks6[1])) * 60;
                        now8 = moment.duration({ hours: ks6 }) / 1000;
                        lastMonthCoordinationHours += now8;
                      }
                      if (doc2[k].subType == 'meeting') {
                        var ks7 = doc2[k].hours;
                        // now9 = (+parseInt(ks7[0])) * 60 * 60 + (+parseInt(ks7[1])) * 60;
                        now9 = moment.duration({ hours: ks7 }) / 1000;
                        lastMonthMeetingHours += now9;
                      }
                      if (doc2[k].subType == 'time-available') {
                        var ks8 = doc2[k].hours;
                        // now10 = (+parseInt(ks8[0])) * 60 * 60 + (+parseInt(ks8[1])) * 60;
                        now10 = moment.duration({ hours: ks8 }) / 1000;
                        lastMonthAvailableHours += now10;
                      }
                    }
                  }
                  if (n4 <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= n5) {
                    if (doc2[k].type == 'productive') {
                      //console.log('w----------------------'+doc2[k].type);
                      //console.log(doc2[k].type);
                      var ks9 = doc2[k].hours;
                      // now11 = (+parseInt(ks9[0])) * 60 * 60 + (+parseInt(ks9[1])) * 60;
                      now11 = moment.duration({ hours: ks9 }) / 1000;
                      lastWeekProductiveHours += now11;
                    }
                    if (doc2[k].type == 'non-productive') {
                      //console.log('w----------------------'+doc2[k].subType);
                      if (doc2[k].subType == 'co-ordination') {
                        var ks10 = doc2[k].hours;
                        //now12 = (+parseInt(ks10[0])) * 60 * 60 + (+parseInt(ks10[1])) * 60;
                        now12 = moment.duration({ hours: ks10 }) / 1000;
                        lastWeekCoordinationHours += now12;
                      }
                      if (doc2[k].subType == 'meeting') {
                        var ks11 = doc2[k].hours;
                        //now13 = (+parseInt(ks11[0])) * 60 * 60 + (+parseInt(ks11[1])) * 60;
                        now13 = moment.duration({ hours: ks11 }) / 1000;
                        lastWeekMeetingHours += now13;
                      }
                      if (doc2[k].subType == 'time-available') {
                        var ks12 = doc2[k].hours;
                        //now14 = (+parseInt(ks12[0])) * 60 * 60 + (+parseInt(ks12[1])) * 60;
                        now14 = moment.duration({ hours: ks12 }) / 1000;
                        lastWeekAvailableHours += now14;
                      }
                    }
                  }

                })(k);
              }

              if (overallProductiveHours == '') {
                oph = 0
              } else {
                var oph = (overallProductiveHours / (overallProductiveHours + overallMeetingHours + overallCoordinationHours + overallAvailableHours)) * 100;
              }

              if (lastMonthProductiveHours == '') {
                lmph = 0;
              } else {
                var lmph = (lastMonthProductiveHours / (lastMonthProductiveHours + lastMonthMeetingHours + lastMonthCoordinationHours + lastMonthAvailableHours)) * 100;
              }

              if (lastWeekProductiveHours == '') {
                lwph = 0;
              } else {
                lwph = (lastWeekProductiveHours / (lastWeekProductiveHours + lastWeekMeetingHours + lastWeekCoordinationHours + lastWeekAvailableHours)) * 100;
              }

              Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
                res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
              });
            } else {
              var oph = 0;
              var lmph = 0;
              var lwph = 0;
              Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
                res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
              });
            }
          })

        } else if (!doc.categoryId) {
          //console.log('kshduwiudiuwiuduwdiuduwu');
          var total = 0;
          var availableHours = 0;
          var dueToday = 0;
          var dueWeek = 0;
          var overDue = 0;
          var taskPending = 0;
          var taskCompleted = 0;
          var inTake = 0;
          var cab = 0;
          var build = 0;
          var test = 0;
          var hold = 0;
          var overallOTD = 0;
          var lastWeekOTD = 0;
          var lastMonthOTD = 0;
          var overallOT = 0;
          var lastWeekOT = 0;
          var lastMonthOT = 0;
          var overallITD = 0;
          var overallIT = 0;
          var lastMonthITD = 0;
          var lastMonthIT = 0;
          var lastWeekITD = 0;
          var lastWeekIT = 0;
          var oot = 100;
          var mot = 100;
          var wot = 100;
          var oit = 100;
          var mit = 100;
          var wit = 100;
          var oph = 0;
          var lmph = 0;
          var lwph = 0;
          // return 

          Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
            res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
          });
        } else {
          res.send(0, 0)
          //res.status(200).send({0,0})
          //res.send('no task there');
        }
      });



    }
  }

  // userid (or) !userid (or) !userid and !catergorid
  else {
    filter = {};
    //overview
    if (!req.query.userId) {
      if (token.role.indexOf('LEAD') > -1) {
        filter.leadId = token.userId;
      } else if (token.role.indexOf('ADMIN') > -1 || token.role.indexOf('MANAGER') > -1 || token.role.indexOf('GUEST') > -1) {
        filter = filter;
      } else {
        filter.developerId = token.userId;
      }
    } else { //userid
      filter.developerId = token.userId;
    }
    filter2 = {};
    if (!req.query.userId) {
      if (token.role.indexOf('DEVELOPER') > -1) {
        filter2.taskOwnerId = token.userId;
      } else if (token.role.indexOf('LEAD') > -1) {
        filter2.categoryId = token.categoryId;
      } else if (token.role.indexOf('ADMIN') > -1 || token.role.indexOf('MANAGER') > -1) {
        filter2 = filter2;
      }
    } else {
      filter2.categoryId = token.categoryId;
    }

    Task.find(filter).then(function (doc, err) {
      if (doc && doc.length > 0) {
        //console.log(JSON.stringify(filter));
        //console.log(doc);
        var total = 0;
        var overallTotal = 0;
        var lastMonthTotal = 0;
        var lastWeekTotal = 0;
        var totalSpend = 0;
        var dueToday = 0;
        var cDate = new Date().setHours(0, 0, 0, 0);
        var dueWeek = 0;
        var overDue = 0;
        var totalTask = doc.length;
        var taskPending = 0;
        var inTake = 0;
        var cab = 0;
        var build = 0;
        var test = 0;
        var hold = 0;
        var overallOTD = 0;
        var lastWeekOTD = 0;
        var lastMonthOTD = 0;
        var overallOT = 0;
        var lastWeekOT = 0;
        var lastMonthOT = 0;
        var overallITD = 0;
        var overallIT = 0;
        var lastMonthITD = 0;
        var lastMonthIT = 0;
        var lastWeekITD = 0;
        var lastWeekIT = 0;
        var d = new Date().getDay();
        var m = new Date().getMonth() - 1;
        var y = new Date().getFullYear();

        console.log(m);
        //console.log(y);
        var firstDay = new Date(y, m);
        var lastDay = new Date(y, m + 1);
        lastDay = new Date(lastDay.getTime() - (1 * 24 * 60 * 60 * 1000));
        console.log('FD------' + firstDay);
        console.log('LD--------' + lastDay);
        firstDay = firstDay.setHours(0, 0, 0, 0);
        lastDay = lastDay.setHours(0, 0, 0, 0);
        var n = 1 + d;
        var n2 = new Date(new Date().getTime() - (n * 24 * 60 * 60 * 1000));
        var n3 = new Date(n2.getTime() + (6 * 24 * 60 * 60 * 1000));
        var n4 = new Date(n2.getTime() - (7 * 24 * 60 * 60 * 1000));
        var n5 = new Date(n3.getTime() - (7 * 24 * 60 * 60 * 1000));
        var myDate = new Date();
        myDate.setHours(0, 0, 0, 0);
        n2 = n2.setHours(0, 0, 0, 0);
        n3 = n3.setHours(0, 0, 0, 0);
        n4 = n4.setHours(0, 0, 0, 0);
        n5 = n5.setHours(0, 0, 0, 0);
        console.log(cDate);

        for (var i = 0; i < doc.length; i++) {
          (function (j) {
            if (doc[i].plannedEndDate) {
              if (cDate === doc[i].plannedEndDate.setHours(0, 0, 0, 0) && (doc[i].status != 'DELIVERED' && doc[i].status != 'CANCELLED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS')) {
                dueToday++;
              }
              if (n2 <= doc[i].plannedEndDate.setHours(0, 0, 0, 0) && doc[i].plannedEndDate.setHours(0, 0, 0, 0) <= n3 && (doc[i].status != 'DELIVERED' && doc[i].status != 'CANCELLED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS')) {
                dueWeek++;
              }
              if (cDate > doc[i].plannedEndDate.setHours(0, 0, 0, 0) && (doc[i].status != 'DELIVERED' && doc[i].status != 'CANCELLED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS')) {
                overDue++;
              }
            }
            //console.log('s-----------------------------------------------------------------------------------'+doc[i].status);
            if (doc[i].status != 'CANCELLED' && doc[i].status != 'DELIVERED' && doc[i].status != 'FUT-IN-PROGRESS' && doc[i].status != 'TEST-ON-HOLD' && doc[i].status != 'TESTING-IN-PROGRESS') {
              taskPending++;
              var t = doc[i].estimatedHours;
              if (doc[i].estimatedHours == undefined) {
                var t = 0;
              } else {
                now1 = parseInt(t) * 60 * 60;
                total += now1;
              }

              if (doc[i].hoursSpend && doc[i].hoursSpend != '0') {
                var ts = doc[i].hoursSpend.split('.');
                now2 = (+parseInt(ts[0])) * 60 * 60 + (+parseInt(ts[1])) * 60;
                totalSpend += now2;
              } else {
                totalSpend += 0;
              }

            }
            if (doc[i].status == 'NOT-STARTED' || doc[i].status == 'ESTIMATION-IN-PROGRESS') {
              inTake++;
            }
            if (doc[i].status == 'WAITING-FOR-CAB-APPROVAL') {
              cab++;
            }
            if (doc[i].status == 'TS-IN-PROGRESS' || doc[i].status == 'DEV-IN-PROGRESS') {
              build++;
            }
            if (doc[i].status == 'FUT-IN-PROGRESS' || doc[i].status == 'TESTING-IN-PROGRESS') {
              test++;
            }
            if (doc[i].status == 'DEV-ON-HOLD' || doc[i].status == 'TEST-ON-HOLD') {
              hold++;
            }
            //  console.log('s-----------------------------------------------------------------------------------'+doc[i].status);
            if (doc[i].estimatedHours == 0 || doc[i].estimatedHours == '' || doc[i].estimatedHours == null || doc[i].estimatedHours == undefined) {
              //return res.send({status:'fill estimated Hours for all task'})
              var estimatedHours = 0;
            }

            if (doc[i].status == 'DELIVERED') {
              if (doc[i].actualEndDate && doc[i].plannedEndDate == undefined) {
                var seconds = 0;
                //var seconds2 = (+parseInt(doc[i].estimatedHours)) * 60 * 60 ;
                overallOTD++;
                if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= seconds) {
                  overallOT++;
                }
                if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                  lastMonthOTD++;
                  if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= seconds) {
                    lastMonthOT++;
                  }
                }
                if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                  lastWeekOTD++;
                  if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= seconds) {
                    lastWeekOT++;
                  }
                }
              } else {
                overallOTD++;
                if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= doc[i].plannedEndDate.setHours(0, 0, 0, 0)) {
                  overallOT++;
                }
                if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                  lastMonthOTD++;
                  if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= doc[i].plannedEndDate.setHours(0, 0, 0, 0)) {
                    lastMonthOT++;
                  }
                }
                if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                  lastWeekOTD++;
                  if (doc[i].actualEndDate.setHours(0, 0, 0, 0) <= doc[i].plannedEndDate.setHours(0, 0, 0, 0)) {
                    lastWeekOT++;
                  }
                }
              }

              if (doc[i].hoursSpend || doc[i].hoursSpend == undefined) {
                if (doc[i].hoursSpend == undefined) {
                  var seconds = 0;
                  var seconds2 = (+parseInt(doc[i].estimatedHours)) * 60 * 60;
                  overallITD++;
                  console.log('OITD--------------------------------------------------------------------' + overallITD);
                  if (seconds <= seconds2) {
                    overallIT++;
                    console.log('OIT-------------------------------------------------------------------------------------------------' + overallIT);
                  }
                  if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                    lastMonthITD++;
                    if (seconds <= seconds2) {
                      lastMonthIT++;
                    }
                  }
                  if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                    lastWeekITD++;
                    if (seconds <= seconds2) {
                      lastWeekIT++;
                    }
                  }
                } else {
                  var a = doc[i].hoursSpend.split('.');
                  var seconds = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
                  var seconds2 = (+parseInt(doc[i].estimatedHours)) * 60 * 60;
                  overallITD++;
                  console.log('OITD--------------------------------------------------------------------' + overallITD);
                  if (seconds <= seconds2) {
                    overallIT++;
                    console.log('OIT-------------------------------------------------------------------------------------------------' + overallIT);
                  }
                  if (firstDay <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= lastDay) {
                    lastMonthITD++;
                    if (seconds <= seconds2) {
                      lastMonthIT++;
                    }
                  }
                  if (n4 <= doc[i].actualEndDate.setHours(0, 0, 0, 0) && doc[i].actualEndDate.setHours(0, 0, 0, 0) <= n5) {
                    lastWeekITD++;
                    if (seconds <= seconds2) {
                      lastWeekIT++;
                    }
                  }
                }

              } else {
                overallITD = 0; overallIT = 0; lastMonthITD = 0; lastMonthIT = 0; lastWeekITD = 0; lastWeekIT = 0;
              }
            }
            //console.log('i------'+i);
            //console.log(doc[i]._id);
          })(i);
        }
        console.log('t-------' + total);
        console.log('TS===============================' + totalSpend);
        if (totalSpend > total) {
          var availableHours = 0;
        } else {
          var availableHours = total - totalSpend;
        }

        var hours = Math.floor(availableHours / 3600);
        var min = Math.floor((availableHours - (hours * 3600)) / 60);
        console.log(hours + '.' + min);
        availableHours = hours + '.' + min;
        var hours = Math.floor(total / 3600);
        var min = Math.floor((total - (hours * 3600)) / 60);
        console.log(hours + '.' + min);
        total = hours + '.' + min;
        var taskCompleted = doc.length - taskPending;
        //console.log('tc-----------'+taskCompleted);

        if (overallOT == 0 && overallOTD == 0) {
          var oot = 100;
        } else {
          var oot = Math.round((overallOT / overallOTD) * 100);
        }
        if (lastMonthOT == 0 && lastMonthOTD == 0) {
          var mot = 100;
        } else {
          var mot = Math.round((lastMonthOT / lastMonthOTD) * 100);
        }
        if (lastWeekOT == 0 && lastWeekOTD == 0) {
          var wot = 100;
        } else {
          var wot = Math.round((lastWeekOT / lastWeekOTD) * 100);
        }
        if (overallIT == 0 && overallITD == 0) {
          var oit = 100;
        } else {
          var oit = Math.round((overallIT / overallITD) * 100);
        }
        if (lastMonthIT == 0 && lastMonthITD == 0) {
          var mit = 100;
        } else {
          var mit = Math.round((lastMonthIT / lastMonthITD) * 100);
        }
        if (lastWeekIT == 0 && lastWeekITD == 0) {
          var wit = 100;
        } else {
          var wit = Math.round((lastWeekIT / lastWeekITD) * 100);
        }
        Timesheet.find(filter2).populate('taskDetails').then(function (doc2, err) {
          if (doc2 && doc2.length > 0) {
            var overallProductiveHours = 0;
            var overallMeetingHours = 0;
            var overallAvailableHours = 0;
            var overallCoordinationHours = 0;
            var lastMonthProductiveHours = 0;
            var lastMonthMeetingHours = 0;
            var lastMonthAvailableHours = 0;
            var lastMonthCoordinationHours = 0;
            var lastWeekProductiveHours = 0;
            var lastWeekMeetingHours = 0;
            var lastWeekAvailableHours = 0;
            var lastWeekCoordinationHours = 0;
            console.log('timesheet---------------------' + doc2.length);
            var blank = [];
            for (var k = 0; k < doc2.length; k++) {
              (function (l) {
                if (doc2[k].type == 'productive') {
                  var ks = doc2[k].hours;
                  console.log(ks);
                  //now3 = (+parseInt(ks[0])) * 60 * 60 + (+parseInt(ks[1])) * 60;
                  now3 = moment.duration({ hours: ks }) / 1000;
                  console.log(now3);
                  overallProductiveHours += now3;
                }
                if (doc2[k].type == 'non-productive') {
                  if (doc2[k].subType == 'co-ordination') {
                    var ks2 = doc2[k].hours;
                    // now4 = (+parseInt(ks2[0])) * 60 * 60 + (+parseInt(ks2[1])) * 60;
                    now4 = moment.duration({ hours: ks2 }) / 1000;
                    overallCoordinationHours += now4;
                  }
                  if (doc2[k].subType == 'meeting') {
                    var ks3 = doc2[k].hours;
                    // now5 = (+parseInt(ks3[0])) * 60 * 60 + (+parseInt(ks3[1])) * 60;
                    now5 = moment.duration({ hours: ks3 }) / 1000;
                    overallMeetingHours += now5;
                  }
                  if (doc2[k].subType == 'time-available') {
                    var ks4 = doc2[k].hours;
                    // now6 = (+parseInt(ks4[0])) * 60 * 60 + (+parseInt(ks4[1])) * 60;
                    now6 = moment.duration({ hours: ks4 }) / 1000;
                    overallAvailableHours += now6;
                  }
                }
                if (firstDay <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= lastDay) {
                  //console.log(firstDay);
                  if (doc2[k].type == 'productive') {
                    //console.log('w----------------------'+doc2[k].type);
                    var ks5 = doc2[k].hours;
                    // now7 = (+parseInt(ks5[0])) * 60 * 60 + (+parseInt(ks5[1])) * 60;
                    now7 = moment.duration({ hours: ks5 }) / 1000;
                    lastMonthProductiveHours += now7;
                  }
                  if (doc2[k].type == 'non-productive') {
                    //console.log('w----------------------'+doc2[k].subType);
                    if (doc2[k].subType == 'co-ordination') {
                      var ks6 = doc2[k].hours;
                      // now8 = (+parseInt(ks6[0])) * 60 * 60 + (+parseInt(ks6[1])) * 60;
                      now8 = moment.duration({ hours: ks6 }) / 1000;
                      lastMonthCoordinationHours += now8;
                    }
                    if (doc2[k].subType == 'meeting') {
                      var ks7 = doc2[k].hours;
                      // now9 = (+parseInt(ks7[0])) * 60 * 60 + (+parseInt(ks7[1])) * 60;
                      now9 = moment.duration({ hours: ks7 }) / 1000;
                      lastMonthMeetingHours += now9;
                    }
                    if (doc2[k].subType == 'time-available') {
                      var ks8 = doc2[k].hours;
                      // now10 = (+parseInt(ks8[0])) * 60 * 60 + (+parseInt(ks8[1])) * 60;
                      now10 = moment.duration({ hours: ks8 }) / 1000;
                      lastMonthAvailableHours += now10;
                    }
                  }
                }
                if (n4 <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= n5) {
                  if (doc2[k].type == 'productive') {
                    //console.log('w----------------------'+doc2[k].type);
                    //console.log(doc2[k].type);
                    var ks9 = doc2[k].hours;
                    // now11 = (+parseInt(ks9[0])) * 60 * 60 + (+parseInt(ks9[1])) * 60;
                    now11 = moment.duration({ hours: ks9 }) / 1000;
                    lastWeekProductiveHours += now11;
                  }
                  if (doc2[k].type == 'non-productive') {
                    //console.log('w----------------------'+doc2[k].subType);
                    if (doc2[k].subType == 'co-ordination') {
                      var ks10 = doc2[k].hours;
                      //now12 = (+parseInt(ks10[0])) * 60 * 60 + (+parseInt(ks10[1])) * 60;
                      now12 = moment.duration({ hours: ks10 }) / 1000;
                      lastWeekCoordinationHours += now12;
                    }
                    if (doc2[k].subType == 'meeting') {
                      var ks11 = doc2[k].hours;
                      //now13 = (+parseInt(ks11[0])) * 60 * 60 + (+parseInt(ks11[1])) * 60;
                      now13 = moment.duration({ hours: ks11 }) / 1000;
                      lastWeekMeetingHours += now13;
                    }
                    if (doc2[k].subType == 'time-available') {
                      var ks12 = doc2[k].hours;
                      //now14 = (+parseInt(ks12[0])) * 60 * 60 + (+parseInt(ks12[1])) * 60;
                      now14 = moment.duration({ hours: ks12 }) / 1000;
                      lastWeekAvailableHours += now14;
                    }
                  }
                }

              })(k);
            }

            if (overallProductiveHours == '') {
              oph = 0
            } else {
              var oph = (overallProductiveHours / (overallProductiveHours + overallMeetingHours + overallCoordinationHours + overallAvailableHours)) * 100;
            }

            if (lastMonthProductiveHours == '') {
              lmph = 0;
            } else {
              var lmph = (lastMonthProductiveHours / (lastMonthProductiveHours + lastMonthMeetingHours + lastMonthCoordinationHours + lastMonthAvailableHours)) * 100;
            }

            if (lastWeekProductiveHours == '') {
              lwph = 0;
            } else {
              lwph = (lastWeekProductiveHours / (lastWeekProductiveHours + lastWeekMeetingHours + lastWeekCoordinationHours + lastWeekAvailableHours)) * 100;
            }

            Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
              res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
            });
          } else {
            var oph = 0;
            var lmph = 0;
            var lwph = 0;
            Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
              res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
            });
          }
        })

      } else if (doc.developerId == undefined && doc.leadId == undefined) {
        var total = 0;
        var availableHours = 0;
        var dueToday = 0;
        var dueWeek = 0;
        var overDue = 0;
        var taskPending = 0;
        var taskCompleted = 0;
        var inTake = 0;
        var cab = 0;
        var build = 0;
        var test = 0;
        var hold = 0;
        var overallOTD = 0;
        var lastWeekOTD = 0;
        var lastMonthOTD = 0;
        var overallOT = 0;
        var lastWeekOT = 0;
        var lastMonthOT = 0;
        var overallITD = 0;
        var overallIT = 0;
        var lastMonthITD = 0;
        var lastMonthIT = 0;
        var lastWeekITD = 0;
        var lastWeekIT = 0;
        var oot = 100;
        var mot = 100;
        var wot = 100;
        var oit = 100;
        var mit = 100;
        var wit = 100;
        // var openNotifications = Notifications.find({user: req.query.userId, status: {$in: ['new', 'renotified']}).count();
        Timesheet.find(filter4).populate('taskDetails').then(function (doc2, err) {
          if (doc2 && doc2.length > 0) {
            var overallProductiveHours = 0;
            var overallMeetingHours = 0;
            var overallAvailableHours = 0;
            var overallCoordinationHours = 0;
            var lastMonthProductiveHours = 0;
            var lastMonthMeetingHours = 0;
            var lastMonthAvailableHours = 0;
            var lastMonthCoordinationHours = 0;
            var lastWeekProductiveHours = 0;
            var lastWeekMeetingHours = 0;
            var lastWeekAvailableHours = 0;
            var lastWeekCoordinationHours = 0;
            console.log(doc2.length);
            var blank = [];
            for (var k = 0; k < doc2.length; k++) {
              (function (l) {
                if (doc2[k].type == 'productive') {
                  var ks = doc2[k].hours.split('.');
                  now3 = (+parseInt(ks[0])) * 60 * 60 + (+parseInt(ks[1])) * 60;
                  overallProductiveHours += now3;
                }
                if (doc2[k].type == 'non-productive') {
                  if (doc2[k].subType == 'co-ordination') {
                    var ks2 = doc2[k].hours.split('.')
                    now4 = (+parseInt(ks2[0])) * 60 * 60 + (+parseInt(ks2[1])) * 60;
                    overallCoordinationHours += now4;
                  }
                  if (doc2[k].subType == 'meeting') {
                    var ks3 = doc2[k].hours.split('.')
                    now5 = (+parseInt(ks3[0])) * 60 * 60 + (+parseInt(ks3[1])) * 60;
                    overallMeetingHours += now5;
                  }
                  if (doc2[k].subType == 'time-available') {
                    var ks4 = doc2[k].hours.split('.')
                    now6 = (+parseInt(ks4[0])) * 60 * 60 + (+parseInt(ks4[1])) * 60;
                    overallAvailableHours += now6;
                  }
                }
                if (firstDay <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= lastDay) {
                  //console.log(firstDay);
                  if (doc2[k].type == 'productive') {
                    //console.log('w----------------------'+doc2[k].type);
                    var ks5 = doc2[k].hours.split('.');
                    now7 = (+parseInt(ks5[0])) * 60 * 60 + (+parseInt(ks5[1])) * 60;
                    lastMonthProductiveHours += now7;
                  }
                  if (doc2[k].type == 'non-productive') {
                    //console.log('w----------------------'+doc2[k].subType);
                    if (doc2[k].subType == 'co-ordination') {
                      var ks6 = doc2[k].hours.split('.')
                      now8 = (+parseInt(ks6[0])) * 60 * 60 + (+parseInt(ks6[1])) * 60;
                      lastMonthCoordinationHours += now8;
                    }
                    if (doc2[k].subType == 'meeting') {
                      var ks7 = doc2[k].hours.split('.')
                      now9 = (+parseInt(ks7[0])) * 60 * 60 + (+parseInt(ks7[1])) * 60;
                      lastMonthMeetingHours += now9;
                    }
                    if (doc2[k].subType == 'time-available') {
                      var ks8 = doc2[k].hours.split('.')
                      now10 = (+parseInt(ks8[0])) * 60 * 60 + (+parseInt(ks8[1])) * 60;
                      lastMonthAvailableHours += now10;
                    }
                  }
                }
                if (n4 <= doc2[k].aDate.setHours(0, 0, 0, 0) && doc2[k].aDate.setHours(0, 0, 0, 0) <= n5) {
                  if (doc2[k].type == 'productive') {
                    console.log('w----------------------' + doc2[k].type);
                    console.log(doc2[k].type);
                    var ks9 = doc2[k].hours.split('.');
                    now11 = (+parseInt(ks9[0])) * 60 * 60 + (+parseInt(ks9[1])) * 60;
                    lastWeekProductiveHours += now11;
                  }
                  if (doc2[k].type == 'non-productive') {
                    console.log('w----------------------' + doc2[k].subType);
                    if (doc2[k].subType == 'co-ordination') {
                      var ks10 = doc2[k].hours.split('.')
                      now12 = (+parseInt(ks10[0])) * 60 * 60 + (+parseInt(ks10[1])) * 60;
                      lastWeekCoordinationHours += now12;
                    }
                    if (doc2[k].subType == 'meeting') {
                      var ks11 = doc2[k].hours.split('.')
                      now13 = (+parseInt(ks11[0])) * 60 * 60 + (+parseInt(ks11[1])) * 60;
                      lastWeekMeetingHours += now13;
                    }
                    if (doc2[k].subType == 'time-available') {
                      var ks12 = doc2[k].hours.split('.')
                      now14 = (+parseInt(ks12[0])) * 60 * 60 + (+parseInt(ks12[1])) * 60;
                      lastWeekAvailableHours += now14;
                    }
                  }
                }

              })(k);
            }

            if (overallProductiveHours == '') {
              oph = 0
            } else {
              var oph = (overallProductiveHours / (overallProductiveHours + overallMeetingHours + overallCoordinationHours + overallAvailableHours)) * 100;
            }

            if (lastMonthProductiveHours == '') {
              lmph = 0;
            } else {
              var lmph = (lastMonthProductiveHours / (lastMonthProductiveHours + lastMonthMeetingHours + lastMonthCoordinationHours + lastMonthAvailableHours)) * 100;
            }

            if (lastWeekProductiveHours == '') {
              lwph = 0;
            } else {
              lwph = (lastWeekProductiveHours / (lastWeekProductiveHours + lastWeekMeetingHours + lastWeekCoordinationHours + lastWeekAvailableHours)) * 100;
            }

            Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
              res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
            });
          } else {
            var oph = 0;
            var lmph = 0;
            var lwph = 0;
            Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
              res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
            });
          }
        })
        Notifications.count({ user: token.userId, status: { $in: ['new', 'renotified'] } }, (err, openNotifications) => {
          res.send({ total, availableHours, dueToday, dueWeek, overDue, taskPending, taskCompleted, openNotifications, inTake, cab, build, test, hold, overallOTD, overallOT, lastMonthOTD, lastMonthOT, lastWeekOTD, lastWeekOT, oot, mot, wot, overallITD, overallIT, lastMonthITD, lastMonthIT, lastWeekITD, lastWeekIT, oit, mit, wit, oph, lmph, lwph });
        });
      } else {
        res.send(0, 0)
        //res.status(200).send({0,0})
        //res.send('no task there');
      }
    });
  }

});

module.exports = api;
