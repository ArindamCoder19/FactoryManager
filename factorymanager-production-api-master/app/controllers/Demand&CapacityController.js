var express = require('express');
var cors = require('cors');
var User = require('../models/UserModel');
var Task = require('../models/TaskModel');
var Timesheet = require('../models/TimesheetModel');
var Subcategory = require('../models/SubcategoryModel');
var FutureScope = require('../models/FutureScopeModel');
var StatusFS = require('../models/StatusFSModel');
var Response = require('../utils/response');
var unionBy = require('lodash.unionby');
var api = express.Router();
var moment = require('moment');

api.get('/demand-capacity', function(req, res) {
  var token = req.decoded;
  var filter = {};


  req.query.categoryId ? filter.categoryId = req.query.categoryId : "";
  
    User.find(filter).exec(function(err, doc){
      //console.log(doc);
      if (doc && doc.length>=0) {
        var developers = 0;
        var leads = 0;
        var taskInProgress = 0;
        for (var i = 0; i < doc.length; i++) {
          (function(j){
            if (doc[i].role.indexOf('DEVELOPER')>-1 && doc[i].status == 'active') {
              developers++;
            }
            if (doc[i].role.indexOf('LEAD')>-1 &&  doc[i].status == 'active') {
              leads++;
            }
          })(i);
        }
        console.log('leads======='+leads);
        var estimated = 0;
        var productive =0;
        var a = moment().week();
        var b = moment(new Date()).day();
        var n = 1+b;

        if (b == 6) {
          console.log('iquwyuywq');
          var n2 = new Date(new Date().getTime());
          var n3 = new Date(n2.getTime() + (6 * 24 * 60 * 60 * 1000));
          var n4 = new Date(n2.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n5 = new Date(n3.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n6 = new Date(n4.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n7 = new Date(n5.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n8 = new Date(n6.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n9 = new Date(n7.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n10 = new Date(n8.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n11 = new Date(n9.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n12 = new Date(n10.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n13 = new Date(n11.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n14 = new Date(n12.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n15 = new Date(n13.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n16 = new Date(n14.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n17 = new Date(n15.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n18 = new Date(n16.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n19 = new Date(n17.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n20 = new Date(n18.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n21 = new Date(n19.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n22 = new Date(n20.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n23 = new Date(n21.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n24 = new Date(n22.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n25 = new Date(n23.getTime() + (7 * 24 * 60 * 60 * 1000));
        } else {
          console.log('qwerty');
          var n2 = new Date(new Date().getTime() - (n * 24 * 60 * 60 * 1000));
          var n3 = new Date(n2.getTime() + (6 * 24 * 60 * 60 * 1000));
          var n4 = new Date(n2.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n5 = new Date(n3.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n6 = new Date(n4.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n7 = new Date(n5.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n8 = new Date(n6.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n9 = new Date(n7.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n10 = new Date(n8.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n11 = new Date(n9.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n12 = new Date(n10.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n13 = new Date(n11.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n14 = new Date(n12.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n15 = new Date(n13.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n16 = new Date(n14.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n17 = new Date(n15.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n18 = new Date(n16.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n19 = new Date(n17.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n20 = new Date(n18.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n21 = new Date(n19.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n22 = new Date(n20.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n23 = new Date(n21.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n24 = new Date(n22.getTime() + (7 * 24 * 60 * 60 * 1000));
          var n25 = new Date(n23.getTime() + (7 * 24 * 60 * 60 * 1000));
        }

        console.log('b=='+b);
        console.log(n2);
        console.log(n3);

        n3 = n3.setHours(0,0,0,0);
        n5 = n5.setHours(0,0,0,0);
        n7 = n7.setHours(0,0,0,0);
        n9 = n9.setHours(0,0,0,0);
        n11 = n11.setHours(0,0,0,0);
        n13 = n13.setHours(0,0,0,0);
        n15 = n15.setHours(0,0,0,0);
        n17 = n17.setHours(0,0,0,0);
        n19 = n19.setHours(0,0,0,0);
        n21 = n21.setHours(0,0,0,0);
        n23 = n23.setHours(0,0,0,0);
        n25 = n25.setHours(0,0,0,0);

        var obj1 = {};
        var obj2 = {};
        var obj3 = {};
        var obj4 = {};
        var obj5 = {};
        var obj6 = {};
        var obj7 = {};
        var obj8 = {};
        var obj9 = {};
        var obj10 = {};
        var obj11 = {};
        var obj12 = {};
        var weeks = {};

        var obj13 = {};
        var arr2 =[];

        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        var c4 = 0;
        var c5 = 0;
        var c6 = 0;
        var c7 = 0;
        var c8 = 0;
        var c9 = 0;
        var c10 = 0;
        var c11 = 0;
        var c12 = 0;
        var c13 = 0;
        var c14 = 0;
        var c15 = 0;
        var c16 = 0;
        var c17 = 0;
        var c18 = 0;
        var c19 = 0;
        var c20 = 0;
        var c21 = 0;
        var c22 = 0;
        var c23 = 0;
        var c24 = 0;

        var fDemand1 = 0;
        var fDemand2 = 0;
        var fDemand3 = 0;
        var fDemand4 = 0;
        var fDemand5 = 0;
        var fDemand6 = 0;
        var fDemand7 = 0;
        var fDemand8 = 0;
        var fDemand9 = 0;
        var fDemand10 = 0;
        var fDemand11 = 0;
        var fDemand12 = 0;

        var amsTotal = 0;

        var totalDemand1 = 0;
        var totalDemand2 = 0;
        var totalDemand3 = 0;
        var totalDemand4 = 0;
        var totalDemand5 = 0;
        var totalDemand6 = 0;
        var totalDemand7 = 0;
        var totalDemand8 = 0;
        var totalDemand9 = 0;
        var totalDemand10 = 0;
        var totalDemand11 = 0;
        var totalDemand12 = 0;

        var idleTime1 = 0;
        var idleTime2 = 0;
        var idleTime3 = 0;
        var idleTime4 = 0;
        var idleTime5 = 0;
        var idleTime6 = 0;
        var idleTime7 = 0;
        var idleTime8 = 0;
        var idleTime9 = 0;
        var idleTime10 = 0;
        var idleTime11 = 0;
        var idleTime12 = 0;

        var overTime1 = 0;
        var overTime2 = 0;
        var overTime3 = 0;
        var overTime4 = 0;
        var overTime5 = 0;
        var overTime6 = 0;
        var overTime7 = 0;
        var overTime8 = 0;
        var overTime9 = 0;
        var overTime10 = 0;
        var overTime11 = 0;
        var overTime12 = 0;

        var d = new Date().getDay();
        var m = new Date().getMonth() - 3;
        var y = new Date().getFullYear();
        var firstDay = new Date(y, m);
        var lastDay = new Date(y, m+1);
        lastDay = new Date(lastDay.getTime() - (1*24*60*60*1000));
        console.log('FD------'+firstDay);
        console.log('LD--------'+lastDay);
        last3Month_1 = firstDay.setHours(0,0,0,0);
        last3Month_2 = lastDay.setHours(0,0,0,0);
        var subcategoryDemand =[];
        var subcategoryDemand2 =[];
        var fDemand = [0,0,0,0,0,0,0,0,0,0,0,0];

        //var obj = {};
        console.log('auishduisidhiuhsdiu======'+n3);
        for (var m = 0; m < doc.length; m++) {
          if (doc[m].status == 'active' && (doc[m].role.indexOf('DEVELOPER')>-1 || doc[m].role.indexOf('LEAD')>-1)) {
            var ed1 = doc[m].endDate.setHours(0,0,0,0);
            if (n3 <= ed1) {
              c1++
              //console.log('c1======================'+c1);
              var c2 = c1*45;
            }
            if (n5 <= ed1) {
              c3++
              //console.log('c3======================'+c3);
              var c4 = c3*45;
            } if (n7 <= ed1) {
              c5++
              //console.log('c5======================'+c5);
              var c6 = c5*45;
            }
            if (n9 <= ed1) {
              c7++
              //console.log('c7======================'+c7);
              var c8 = c7*45;
            }
            if (n11 <= ed1) {
              c9++
              //console.log('c9======================'+c9);
              var c10 = c9*45;
            }
            if (n13 <= ed1) {
              c11++
              //console.log('c11======================'+c11);
              var c12 = c11*45;
            }
            if (n15 <= ed1) {
              c13++
              //console.log('c13======================'+c13);
              var c14 = c13*45;
            }
            if (n17 <= ed1) {
              c15++
              //console.log('c15======================'+c15);
              var c16 = c15*45;
            }
            if (n19 <= ed1) {
              c17++
              //console.log('c17======================'+c17);
              var c18 = c17*45;
            }
            if (n21 <= ed1) {
              c19++
              //console.log('c19======================'+c19);
              var c20 = c19*45;
            }
            if (n23 <= ed1) {
              c21++
              //console.log('c21======================'+c21);
              var c22 = c21*45;
            }
            if (n25 <= ed1) {
              c23++
              //console.log('c23======================'+c23);
              var c24 = c23*45;
            }
          }
        }

        var d = 0;
        var taskCount = 0;
        var arr = [];
        var arr2 =[];
        var asm = false;
        //var filter2 ={status: {$nin:['CANCELLED', 'DELIVERED']}};
        Task.find(filter).exec(function(err, doc2){
          Subcategory.find().exec(function(err, doc3){
            StatusFS.find().then(function(doc4, err){
              FutureScope.find(filter).then(function(doc5, err){
              for (var fs = 0; fs < doc3.length;fs++) {
                obj1[doc3[fs].id] = 0;
                obj2[doc3[fs].id] = 0;
                obj3[doc3[fs].id] = 0;
                obj4[doc3[fs].id] = 0;
                obj5[doc3[fs].id] = 0;
                obj6[doc3[fs].id] = 0;
                obj7[doc3[fs].id] = 0;
                obj8[doc3[fs].id] = 0;
                obj9[doc3[fs].id] = 0;
                obj10[doc3[fs].id] = 0;
                obj11[doc3[fs].id] = 0;
                obj12[doc3[fs].id] = 0;
              }
              var taskValue = false;

            for (var s = 0; s < doc4.length; s++) {
              (function(v){
                if (doc4[s].status != 'CANCELLED' && doc4[s].status !='CLOSED') {
                  var sid1 = doc4[s].id;
                    for (var t = 0; t < doc5.length; t++) {
                      (function(t1){
                      var total = 0;
                      var sid2 = doc5[t].statusId;
                        if (sid1 == sid2) {
                          if ((doc5[t].fteExpected != 0.00) && (doc5[t].startDate != null || doc5[t].startDate != undefined)) {
                            if (doc5[t].startDate.setHours(0,0,0,0) <= n25) {
                              var rid = doc5[t]._id;
                              var consumedHours = 0.00;
                              var pendingHours10 =0;
                              subc1 = doc5[t].subCategoryId;
                                  var isMatched = false;
                                  var sbid = '';
                                  var fsid = '';
                                  console.log(0 == doc2.length);
                                  for (var u = 0; u < doc2.length; u++) {
                                    (function(u1){
                                      if (doc2[u].subcategoryId == doc5[t].subCategoryId) {
                                        isMatched =true;
                                        sbid = doc2[u].subcategoryId;
                                        fsid = doc5[t].id;
                                      } else {
                                        isMatched =true;
                                        sbid = doc5[t].subCategoryId;
                                        fsid = doc5[t].id;
                                      }

                                      if (doc2[u].status !== 'CANCELLED') {
                                          // console.log('projectId------------------------------------------------------------'+doc2[u].projectId);
                                          // console.log('rid======================================'+rid);
                                          // console.log('taskDescription======================================='+doc2[u].taskDescription);
                                          // console.log(doc2[u]);
                                          if (rid == doc2[u].projectId) {
                                            // console.log('subcategoryId========================'+doc2[u].subcategoryId);
                                            var consumed = (doc2[u].estimatedHours || doc2[u].estimatedHours != null) ? parseInt(doc2[u].estimatedHours): 0.00;
                                            console.log('consumed================================================'+consumed);
                                            var seconds = (+parseInt(consumed)) * 60 * 60;
                                            total += seconds;
                                            console.log('s--------------------------------------------------------------'+seconds);
                                            console.log('total================='+total);
                                            var hours = Math.floor(total / 3600);
                                            var min = Math.floor((total - (hours*3600)) / 60);
                                            consumedHours =  hours +'.'+min;
                                            console.log('c----------------------'+consumedHours);

                                            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'+typeof(doc5[t].estimatedHours));
                                            var eh = (doc5[t].estimatedHours || doc5[t].estimatedHours != null) ? parseInt(doc5[t].estimatedHours): 0.00;
                                            console.log('eh==========================='+eh);
                                            var seconds2 = (+parseInt(eh)) * 60 * 60;

                                            if (eh == 0.00) {
                                              pendingHours10 = 0;
                                            } else {
                                              pending = seconds2 - total;
                                              var hours = Math.floor(pending / 3600);
                                              pendingHours10 =  hours ;
                                              console.log('DPH================================'+pendingHours10);
                                            }
                                          }
                                        }

                                  })(u);
                                }

                            console.log('consumedHours=================================='+consumedHours);
                            if (consumedHours == 0 || consumedHours == null) {
                              pendingHours10 = parseInt(doc5[t].estimatedHours);
                              console.log('DPH=================================='+pendingHours10);
                            }
                            console.log('pending====='+pendingHours10);
                            console.log(isMatched);
                            if(isMatched == true){

                               fDemand1 = 0;
                               fDemand2 = 0;
                               fDemand3 = 0;
                               fDemand4 = 0;
                               fDemand5 = 0;
                               fDemand6 = 0;
                               fDemand7 = 0;
                               fDemand8 = 0;
                               fDemand9 = 0;
                               fDemand10 = 0;
                               fDemand11 = 0;
                               fDemand12 = 0;

                            var fteRequired = 0;
                            var cd = new Date(new Date().getTime()).setHours(0,0,0,0);


                            if (doc5[t].startDate.setHours(0,0,0,0) < cd ) {
                              var date1 = new Date().toGMTString();
                              var date2 = doc5[t].endDate.toGMTString();
                              var wd = dateDifference(date1, date2);
                              console.log('wd==================='+wd);
                              fteRequired = pendingHours10 / (9 * wd) ;
                              console.log('fr=================='+fteRequired);
                            } else {
                              var date1 = doc5[t].startDate.toGMTString();
                              var date2 = doc5[t].endDate.toGMTString();
                              var wd = dateDifference(date1, date2);
                              console.log('wd==================='+wd);
                              fteRequired = pendingHours10 / (9 * wd);
                              console.log('fr=================='+fteRequired);
                            }
                            if (fteRequired > doc5[t].fteExpected) {
                              fteFinal = fteRequired;
                            } else {
                              fteFinal = doc5[t].fteExpected;
                            }
                            console.log(fteFinal);
                            var weekCount = 0
                            if (doc5[t].startDate.setHours(0,0,0,0) < n3) {
                              console.log('jjydguwefdugwgfuygwufyuy');
                              weekCount = 1;
                              console.log('wc============================================'+weekCount);
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n5) {
                              weekCount = 2;
                              console.log('wc============================================'+weekCount);
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n7) {
                              weekCount = 3;
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n9) {
                              weekCount = 4;
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n11) {
                              weekCount = 5;
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n13) {
                              weekCount = 6;
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n15) {
                              weekCount = 7;
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n17) {
                              weekCount = 8;
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n19) {
                              weekCount = 9;
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n21) {
                              weekCount = 10;
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n23) {
                              weekCount = 11;
                            } else if (doc5[t].startDate.setHours(0,0,0,0) < n25) {
                              weekCount = 12;
                            }
                            if (fteFinal) {
                              hoursNeeded = fteFinal*9*5
                              console.log('hn======================='+hoursNeeded);
                              if (weekCount == 1) {
                                //console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a1 = 0; a1 < average; a1++) {
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a1] += hoursNeeded;
                                    console.log('value==================================='+fDemand1);
                                    if (a1 == 0) {

                                      fDemand1 += hoursNeeded
                                    }
                                    if (a1 == 1) {
                                      fDemand2 += hoursNeeded
                                    }
                                    if (a1 == 2) {
                                      fDemand3 += hoursNeeded
                                    }
                                    if (a1 == 3) {
                                      fDemand4 += hoursNeeded
                                    }
                                    if (a1 == 4) {
                                      fDemand5 += hoursNeeded
                                    }
                                    if (a1 == 5) {
                                      fDemand6 += hoursNeeded
                                    }
                                    if (a1 == 6) {
                                      fDemand7 += hoursNeeded
                                    }
                                    if (a1 == 7) {
                                      fDemand8 += hoursNeeded
                                    }
                                    if (a1 == 8) {
                                      fDemand9 += hoursNeeded
                                    }
                                    if (a1 == 9) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a1 == 10) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a1 == 11) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a1] += pendingHours10;
                                    if (a1 == 0) {
                                      console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+typeof(fDemand1));
                                      console.log('pppppppppppppppppppppppppppppppppppppppppppppppppppppppp'+typeof(pendingHours10));
                                      fDemand1 += pendingHours10
                                    }
                                    if (a1 == 1) {
                                      fDemand2 += pendingHours10
                                    }
                                    if (a1 == 2) {
                                      fDemand3 += pendingHours10
                                    }
                                    if (a1 == 3) {
                                      fDemand4 += pendingHours10
                                    }
                                    if (a1 == 4) {
                                      fDemand5 += pendingHours10
                                    }
                                    if (a1 == 5) {
                                      fDemand6 += pendingHours10
                                    }
                                    if (a1 == 6) {
                                      fDemand7 += pendingHours10
                                    }
                                    if (a1 == 7) {
                                      fDemand8 += pendingHours10
                                    }
                                    if (a1 == 8) {
                                      fDemand9 += pendingHours10
                                    }
                                    if (a1 == 9) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a1 == 10) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a1 == 11) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 2) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a2 = 0; a2 < average; a2++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a2 == 0) {
                                      fDemand2 += hoursNeeded
                                    }
                                    if (a2 == 1) {
                                      fDemand3 += hoursNeeded
                                    }
                                    if (a2 == 2) {
                                      fDemand4 += hoursNeeded
                                    }
                                    if (a2 == 3) {
                                      fDemand5 += hoursNeeded
                                    }
                                    if (a2 == 4) {
                                      fDemand6 += hoursNeeded
                                    }
                                    if (a2 == 5) {
                                      fDemand7 += hoursNeeded
                                    }
                                    if (a2 == 6) {
                                      fDemand8 += hoursNeeded
                                    }
                                    if (a2 == 7) {
                                      fDemand9 += hoursNeeded
                                    }
                                    if (a2 == 8) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a2 == 9) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a2 == 10) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a2] += pendingHours10;
                                    if (a2 == 0) {
                                      fDemand2 += pendingHours10
                                    }
                                    if (a2 == 1) {
                                      fDemand3 += pendingHours10
                                    }
                                    if (a2 == 2) {
                                      fDemand4 += pendingHours10
                                    }
                                    if (a2 == 3) {
                                      fDemand5 += pendingHours10
                                    }
                                    if (a2 == 4) {
                                      fDemand6 += pendingHours10
                                    }
                                    if (a2 == 5) {
                                      fDemand7 += pendingHours10
                                    }
                                    if (a2 == 6) {
                                      fDemand8 += pendingHours10
                                    }
                                    if (a2 == 7) {
                                      fDemand9 += pendingHours10
                                    }
                                    if (a2 == 8) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a2 == 9) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a2 == 10) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 3) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a3 = 0; a3 < average; a3++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a3 == 0) {
                                      fDemand3 += hoursNeeded
                                    }
                                    if (a3 == 1) {
                                      fDemand4 += hoursNeeded
                                    }
                                    if (a3 == 2) {
                                      fDemand5 += hoursNeeded
                                    }
                                    if (a3 == 3) {
                                      fDemand6 += hoursNeeded
                                    }
                                    if (a3 == 4) {
                                      fDemand7 += hoursNeeded
                                    }
                                    if (a3 == 5) {
                                      fDemand8 += hoursNeeded
                                    }
                                    if (a3 == 6) {
                                      fDemand9 += hoursNeeded
                                    }
                                    if (a3 == 7) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a3 == 8) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a3 == 9) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a3] += pendingHours10;
                                    if (a3 == 0) {
                                      fDemand3 += pendingHours10
                                    }
                                    if (a3 == 1) {
                                      fDemand4 += pendingHours10
                                    }
                                    if (a3 == 2) {
                                      fDemand5 += pendingHours10
                                    }
                                    if (a3 == 3) {
                                      fDemand6 += pendingHours10
                                    }
                                    if (a3 == 4) {
                                      fDemand7 += pendingHours10
                                    }
                                    if (a3 == 5) {
                                      fDemand8 += pendingHours10
                                    }
                                    if (a3 == 6) {
                                      fDemand9 += pendingHours10
                                    }
                                    if (a3 == 7) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a3 == 8) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a3 == 9) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 4) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a4 = 0; a4 < average; a4++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a4 == 0) {
                                      fDemand4 += hoursNeeded
                                    }
                                    if (a4 == 1) {
                                      fDemand5 += hoursNeeded
                                    }
                                    if (a4 == 2) {
                                      fDemand6 += hoursNeeded
                                    }
                                    if (a4 == 3) {
                                      fDemand7 += hoursNeeded
                                    }
                                    if (a4 == 4) {
                                      fDemand8 += hoursNeeded
                                    }
                                    if (a4 == 5) {
                                      fDemand9 += hoursNeeded
                                    }
                                    if (a4 == 6) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a4 == 7) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a4 == 8) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a4] += pendingHours10;
                                    if (a4 == 0) {
                                      fDemand4 += pendingHours10
                                    }
                                    if (a4 == 1) {
                                      fDemand5 += pendingHours10
                                    }
                                    if (a4 == 2) {
                                      fDemand6 += pendingHours10
                                    }
                                    if (a4 == 3) {
                                      fDemand7 += pendingHours10
                                    }
                                    if (a4 == 4) {
                                      fDemand8 += pendingHours10
                                    }
                                    if (a4 == 5) {
                                      fDemand9 += pendingHours10
                                    }
                                    if (a4 == 6) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a4 == 7) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a4 == 8) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 5) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a5 = 0; a5 < average; a5++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a5 == 0) {
                                      fDemand5 += hoursNeeded
                                    }
                                    if (a5 == 1) {
                                      fDemand6 += hoursNeeded
                                    }
                                    if (a5 == 2) {
                                      fDemand7 += hoursNeeded
                                    }
                                    if (a5 == 3) {
                                      fDemand8 += hoursNeeded
                                    }
                                    if (a5 == 4) {
                                      fDemand9 += hoursNeeded
                                    }
                                    if (a5 == 5) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a5 == 6) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a5 == 7) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a5] += pendingHours10;
                                    if (a5 == 0) {
                                      fDemand5 += pendingHours10
                                    }
                                    if (a5 == 1) {
                                      fDemand6 += pendingHours10
                                    }
                                    if (a5 == 2) {
                                      fDemand7 += pendingHours10
                                    }
                                    if (a5 == 3) {
                                      fDemand8 += pendingHours10
                                    }
                                    if (a5 == 4) {
                                      fDemand9 += pendingHours10
                                    }
                                    if (a5 == 5) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a5 == 6) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a5 == 7) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 6) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a6 = 0; a6 < average; a6++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a6 == 0) {
                                      fDemand6 += hoursNeeded
                                    }
                                    if (a6 == 1) {
                                      fDemand7 += hoursNeeded
                                    }
                                    if (a6 == 2) {
                                      fDemand8 += hoursNeeded
                                    }
                                    if (a6 == 3) {
                                      fDemand9 += hoursNeeded
                                    }
                                    if (a6 == 4) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a6 == 5) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a6 == 6) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a6] += pendingHours10;
                                    if (a6 == 0) {
                                      fDemand6 += pendingHours10
                                    }
                                    if (a6 == 1) {
                                      fDemand7 += pendingHours10
                                    }
                                    if (a6 == 2) {
                                      fDemand8 += pendingHours10
                                    }
                                    if (a6 == 3) {
                                      fDemand9 += pendingHours10
                                    }
                                    if (a6 == 4) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a6 == 5) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a6 == 6) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 7) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a7 = 0; a7 < average; a7++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a7 == 0) {
                                      fDemand7 += hoursNeeded
                                    }
                                    if (a7 == 1) {
                                      fDemand8 += hoursNeeded
                                    }
                                    if (a7 == 2) {
                                      fDemand9 += hoursNeeded
                                    }
                                    if (a7 == 3) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a7 == 4) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a7 == 5) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a7] += pendingHours10;
                                    if (a7 == 0) {
                                      fDemand7 += pendingHours10
                                    }
                                    if (a7 == 1) {
                                      fDemand8 += pendingHours10
                                    }
                                    if (a7 == 2) {
                                      fDemand9 += pendingHours10
                                    }
                                    if (a7 == 3) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a7 == 4) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a7 == 5) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 8) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a8 = 0; a8 < average; a8++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a8 == 0) {
                                      fDemand8 += hoursNeeded
                                    }
                                    if (a8 == 1) {
                                      fDemand9 += hoursNeeded
                                    }
                                    if (a8 == 2) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a8 == 3) {
                                      fDemand11+= hoursNeeded
                                    }
                                    if (a8 == 4) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a8] += pendingHours10;
                                    if (a8 == 0) {
                                      fDemand8 += pendingHours10
                                    }
                                    if (a8 == 1) {
                                      fDemand9 += pendingHours10
                                    }
                                    if (a8 == 2) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a8 == 3) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a8 == 4) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 9) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a9 = 0; a9 < average; a9++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a9 == 0) {
                                      fDemand9 += hoursNeeded
                                    }
                                    if (a9 == 1) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a9 == 2) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a9 == 3) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a9] += pendingHours10;
                                    if (a9 == 0) {
                                      fDemand9 += pendingHours10
                                    }
                                    if (a9 == 1) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a9 == 2) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a9 == 3) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 10) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a10 = 0; a10 < average; a10++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a10 == 0) {
                                      fDemand10 += hoursNeeded
                                    }
                                    if (a10 == 1) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a10 == 2) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a10] += pendingHours10;
                                    if (a10 == 0) {
                                      fDemand10 += pendingHours10
                                    }
                                    if (a10 == 1) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a10 == 2) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 11) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a11 = 0; a11 < average; a11++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a11 == 0) {
                                      fDemand11 += hoursNeeded
                                    }
                                    if (a11 == 1) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a11] += pendingHours10;
                                    if (a11 == 0) {
                                      fDemand11 += pendingHours10
                                    }
                                    if (a11 == 1) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }
                              if (weekCount == 12) {
                                console.log(pendingHours10);
                                // console.log('hn==========='+hoursNeeded);
                                average = pendingHours10/hoursNeeded;
                                console.log(average);
                                for (var a12 = 0; a12 < average; a12++) {
                                  // console.log('qwiuuqw====='+pendingHours10);
                                  if (pendingHours10 > hoursNeeded) {
                                    pendingHours10 = pendingHours10 - hoursNeeded;
                                    //fDemand[a2] += hoursNeeded;
                                    if (a12 == 0) {
                                      fDemand12 += hoursNeeded
                                    }
                                  } else {
                                    //fDemand[a12] += pendingHours10;
                                    if (a12 == 0) {
                                      fDemand12 += pendingHours10
                                    }
                                  }
                                }
                              }

                              //var arr1 =[];
                              //var obj1 = {id:sbid,fd1:obj1[subc1],fd2:fDemand2,fd3:fDemand3,fd4:fDemand4,fd5:fDemand5,fd6:fDemand6,fd7:fDemand7,fd8:fDemand8,fd9:fDemand9,fd10:fDemand10,fd11:fDemand11,fd12:fDemand12}
                              //fDemand1 = fDemand1.toFixed(2);
                              console.log(fDemand1);
                              console.log(fDemand2);
                              console.log(fDemand3);
                              console.log(fDemand4);
                              console.log(fDemand5);
                              console.log(fDemand6);
                              console.log(fDemand7);
                              console.log(fDemand8);
                              console.log(fDemand9);
                              console.log(fDemand10);
                              console.log(fDemand11);
                              console.log(fDemand12);
                            // if(subcategoryDemand.length >0){
                            //   var exist = false;
                            //   for (var y = 0; y < subcategoryDemand.length; y++) {
                            //     if(sbid == subcategoryDemand[y].id){
                            //       exist =true
                            //     }
                            //   }
                            //   if(exist == false){
                            //     var obj = {id:sbid, futurescope: fsid, fd1:fDemand1,fd2:fDemand2,fd3:fDemand3,fd4:fDemand4,fd5:fDemand5,fd6:fDemand6,fd7:fDemand7,fd8:fDemand8,fd9:fDemand9,fd10:fDemand10,fd11:fDemand11,fd12:fDemand12}
                            //     subcategoryDemand.push(obj);
                            //     //console.log(uniqBy(subcategoryDemand, 'futurescope'));
                            //   }
                            // } else {
                            //   var obj = {id:sbid, futurescope: fsid, fd1:fDemand1,fd2:fDemand2,fd3:fDemand3,fd4:fDemand4,fd5:fDemand5,fd6:fDemand6,fd7:fDemand7,fd8:fDemand8,fd9:fDemand9,fd10:fDemand10,fd11:fDemand11,fd12:fDemand12}
                            //   subcategoryDemand.push(obj);
                            // }
                            var obj = {id:sbid, futurescope: fsid, fd1:fDemand1,fd2:fDemand2,fd3:fDemand3,fd4:fDemand4,fd5:fDemand5,fd6:fDemand6,fd7:fDemand7,fd8:fDemand8,fd9:fDemand9,fd10:fDemand10,fd11:fDemand11,fd12:fDemand12}
                            subcategoryDemand.push(obj);

                            // obj1[sbid] += fDemand1;
                            obj1[sbid] += fDemand1;
                            obj2[sbid] += fDemand2;
                            obj3[sbid] += fDemand3;
                            obj4[sbid] += fDemand4;
                            obj5[sbid] += fDemand5;
                            obj6[sbid] += fDemand6;
                            obj7[sbid] += fDemand7;
                            obj8[sbid] += fDemand8;
                            obj9[sbid] += fDemand9;
                            obj10[sbid] += fDemand10;
                            obj11[sbid] += fDemand11;
                            obj12[sbid] += fDemand12;
                            }
                          }
                        }
                        }
                      }
                    })(t);
                  }
                }
              })(s);
              }

            console.log('-----'+JSON.stringify(subcategoryDemand));
            // for (var x = 0; x < subcategoryDemand.length; x++) {
            //   for (var x2 = 0; x2 < subcategoryDemand2.length; x2++) {
            //     if((arr.indexOf(subcategoryDemand[x].id) <0) || (arr.indexOf(subcategoryDemand2[x2].id) <0)){
            //       if(subcategoryDemand[x].id == subcategoryDemand2[x2].id){
            //
            //         arr.push(subcategoryDemand2[x2].id);
            //         // console.log(true);
            //         // console.log('sb id============'+subcategoryDemand[x].id);
            //         // console.log(JSON.stringify(subcategoryDemand));
            //         // console.log('subc1===================================='+subc1);
            //         // console.log('----------------------------------------------------'+subcategoryDemand[x].fd1);
            //         obj1[subcategoryDemand2[x2].id] +=  subcategoryDemand[x].fd1;
            //         obj2[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd2;
            //         obj3[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd3;
            //         obj4[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd4;
            //         obj5[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd5;
            //         obj6[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd6;
            //         obj7[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd7;
            //         obj8[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd8;
            //         obj9[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd9;
            //         obj10[subcategoryDemand2[x2].id] +=  subcategoryDemand[x].fd10;
            //         obj11[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd11;
            //         obj12[subcategoryDemand2[x2].id] += subcategoryDemand[x].fd12;
            //         console.log('=========================================================='+subcategoryDemand2[x2].td1);
            //       }
            //     }
            //   }
            // }
            var amsSubID = "";
            for (var sc = 0; sc < doc3.length; sc++) {
              if (doc3[sc].subCategory == 'AMS') {
                amsSubID = doc3[sc].id;
                console.log('amsSubID========================'+amsSubID);
                break;
              }
            }

            for (var k = 0; k < doc2.length; k++) {
              //console.log('taskSub==='+doc2[k].subcategoryId);
              (function(w){
              var subc1 = doc2[k].subcategoryId;
              if (doc2[k].status != "CANCELLED" && doc2[k].status != "DELIVERED") {
                taskInProgress++;
                console.log('rfcNumber============='+doc2[k].rfcNumber);
                var taskInProgressCount = taskInProgress;
                if (doc2[k].estimatedHours != 0 && doc2[k].estimatedHours != undefined && doc2[k].estimatedHours != null) {

                      estimated = doc2[k].estimatedHours;
                      productive =  doc2[k].hoursSpend;
                      if (productive > estimated) {
                        pendingHours = 0;
                      } else {
                        if (productive == undefined || productive == null) {
                          productive = 0;
                          var pendingHours = estimated - productive;
                        } else {
                          var pendingHours = estimated - productive;
                        }
                      }
                      console.log('ph===================================='+pendingHours);
                      console.log('tyrakjsdkdjas'+doc2[k].plannedEndDate);
                      var plannedEndDate = doc2[k].plannedEndDate;
                      if (pendingHours != 0) {
                        console.log('n3=========='+n3);
                        console.log('pl==============================='+plannedEndDate);
                        if (plannedEndDate == undefined || plannedEndDate == null || plannedEndDate.setHours(0,0,0,0) <= n3  || plannedEndDate.setHours(0,0,0,0) == n3 || plannedEndDate.setHours(0,0,0,0) > n25) {
                          var count = pendingHours/45;
                          console.log('c===='+count);
                          console.log(doc2[k].rfcNumber);
                          for (var l = 0; l < count; l++) {
                            //console.log('cjyfyfiytffoyyy==============================================='+consumed);
                            if (pendingHours > 45) {
                              pendingHours = pendingHours - 45;
                              d = 1*45;                                                                             // How much times it's having the 45 value and make it multiply into 1. we will get the count and populate the 45 value that much times.
                               console.log('d========================='+d);
                            } else {
                              d = pendingHours;                                                                     // The hours left.
                               console.log('d========================='+d);
                            }
                            //console.log(JSON.stringify(obj1));
                            console.log('l==='+l);
                              if (l == 0) {
                                if (obj1[subc1]) {
                                  obj1[subc1] += d;
                                } else {
                                  obj1[subc1] = d;
                                }
                              } else if (l == 1) {
                                if (obj2[subc1]) {
                                  obj2[subc1] += d;
                                } else {
                                  obj2[subc1] = d;
                                }
                              } else if (l == 2) {
                                if (obj3[subc1]) {
                                  obj3[subc1] += d;
                                } else {
                                  obj3[subc1] = d;
                                }
                              } else if (l == 3) {
                                if (obj4[subc1]) {
                                  obj4[subc1] += d;
                                } else {
                                  obj4[subc1] = d;
                                }
                              } else if (l == 4) {
                                if (obj5[subc1]) {
                                  obj5[subc1] += d;
                                } else {
                                  obj5[subc1] = d;
                                }
                              } else if (l == 5) {
                                if (obj6[subc1]) {
                                  obj6[subc1] += d;
                                } else {
                                  obj6[subc1] = d;
                                }
                              } else if (l == 6) {
                                if (obj7[subc1]) {
                                  obj7[subc1] += d;
                                } else {
                                  obj7[subc1] = d;
                                }
                              } else if (l == 7) {
                                if (obj8[subc1]) {
                                  obj8[subc1] += d;
                                } else {
                                  obj8[subc1] = d;
                                }
                              } else if (l == 8) {
                                if (obj9[subc1]) {
                                  obj9[subc1] += d;
                                } else {
                                  obj9[subc1] = d;
                                }
                              } else if (l == 9) {
                                if (obj10[subc1]) {
                                  obj10[subc1] += d;
                                } else {
                                  obj10[subc1] = d;
                                }
                              } else if (l == 10) {
                                if (obj11[subc1]) {
                                  obj11[subc1] += d;
                                } else {
                                  obj11[subc1] = d;
                                }
                              } else if (l == 11) {
                                if (obj12[subc1]) {
                                  obj12[subc1] += d;
                                } else {
                                  obj12[subc1] = d;
                                }
                              }
                            }
                          } else if (doc2[k].plannedEndDate.setHours(0,0,0,0) > n3) {
                            var weekCount = 0;
                            if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n5) {
                              weekCount = 1;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n7) {
                              weekCount = 2;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n9) {
                              weekCount = 3;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n11) {
                              weekCount = 4;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n13) {
                              weekCount = 5;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n15) {
                              weekCount = 6;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n17) {
                              weekCount = 7;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n19) {
                              weekCount = 8;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n21) {
                              weekCount = 9;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n23) {
                              weekCount = 10;
                            }
                            else if (doc2[k].plannedEndDate.setHours(0,0,0,0) <= n25) {
                              weekCount = 11;
                            }
                            average = pendingHours/weekCount;
                            for (var j = 0; j < weekCount; j++) {
                              d = 1*average;
                              // console.log('d=========================---------------------------------'+d);
                              if (j == 0) {
                                if (obj1[subc1]) {
                                  obj1[subc1] += d;
                                } else {
                                  obj1[subc1] = d;
                                }
                              } else if (j == 1) {
                                if (obj2[subc1]) {
                                  obj2[subc1] += d;
                                } else {
                                  obj2[subc1] = d;
                                }
                              } else if (j == 2) {
                                if (obj3[subc1]) {
                                  obj3[subc1] += d;
                                } else {
                                  obj3[subc1] = d;
                                }
                              } else if (j == 3) {
                                if (obj4[subc1]) {
                                  obj4[subc1] += d;
                                } else {
                                  obj4[subc1] = d;
                                }
                              } else if (j == 4) {
                                if (obj5[subc1]) {
                                  obj5[subc1] += d;
                                } else {
                                  obj5[subc1] = d;
                                }
                              } else if (j == 5) {
                                if (obj6[subc1]) {
                                  obj6[subc1] += d;
                                } else {
                                  obj6[subc1] = d;
                                }
                              } else if (j == 6) {
                                if (obj7[subc1]) {
                                  obj7[subc1] += d;
                                } else {
                                  obj7[subc1] = d;
                                }
                              } else if (j == 7) {
                                if (obj8[subc1]) {
                                  obj8[subc1] += d;
                                } else {
                                  obj8[subc1] = d;
                                }
                              } else if (j == 8) {
                                if (obj9[subc1]) {
                                  obj9[subc1] += d;
                                } else {
                                  obj9[subc1] = d;
                                }
                              } else if (j == 9) {
                                if (obj10[subc1]) {
                                  obj10[subc1] += d;
                                } else {
                                  obj10[subc1] = d;
                                }
                              } else if (j == 10) {
                                if (obj11[subc1]) {
                                  obj11[subc1] += d;
                                } else {
                                  obj11[subc1] = d;
                                }
                              } else if (j == 11) {
                                if (obj12[subc1]) {
                                  obj12[subc1] += d;
                                } else {
                                  obj12[subc1] = d;
                                }
                              }
                            }
                            console.log('weekCount========'+weekCount);
                          }
                        }
                      }
                      console.log('subcategoryDemand.length===='+subcategoryDemand.length);
                      // for (var x = 0; x < subcategoryDemand.length; x++) {
                      //   axa++;
                      //   console.log('axa=========='+axa);
                      //   //if((arr.indexOf(subcategoryDemand[x].futurescope) <0) || (arr.indexOf(subc1)<0)){
                      //     if(subcategoryDemand[x].id == subc1){
                      //       //arr.push(subc1);
                      //       console.log('sb id============'+subcategoryDemand[x].id);
                      //       console.log(JSON.stringify(subcategoryDemand));
                      //       console.log('subc1===================================='+subc1);
                      //       console.log('----------------------------------------------------'+subcategoryDemand[x].fd1);
                      //       obj1[subc1] += subcategoryDemand[x].fd1;
                      //       obj2[subc1] += subcategoryDemand[x].fd2;
                      //       obj3[subc1] += subcategoryDemand[x].fd3;
                      //       obj4[subc1] += subcategoryDemand[x].fd4;
                      //       obj5[subc1] += subcategoryDemand[x].fd5;
                      //       obj6[subc1] += subcategoryDemand[x].fd6;
                      //       obj7[subc1] += subcategoryDemand[x].fd7;
                      //       obj8[subc1] += subcategoryDemand[x].fd8;
                      //       obj9[subc1] += subcategoryDemand[x].fd9;
                      //       obj10[subc1] += subcategoryDemand[x].fd10;
                      //       obj11[subc1] += subcategoryDemand[x].fd11;
                      //       obj12[subc1] += subcategoryDemand[x].fd12;
                      //
                      //       obj1[subc1] = Number(obj1[subc1].toFixed(2));
                      //       obj2[subc1] = Number(obj2[subc1].toFixed(2));
                      //       obj3[subc1] = Number(obj3[subc1].toFixed(2));
                      //       obj4[subc1] = Number(obj4[subc1].toFixed(2));
                      //       obj5[subc1] = Number(obj5[subc1].toFixed(2));
                      //       obj6[subc1] = Number(obj6[subc1].toFixed(2));
                      //       obj7[subc1] = Number(obj7[subc1].toFixed(2));
                      //       obj8[subc1] = Number(obj8[subc1].toFixed(2));
                      //       obj9[subc1] = Number(obj9[subc1].toFixed(2));
                      //       obj10[subc1] = Number(obj10[subc1].toFixed(2));
                      //       obj11[subc1] = Number(obj11[subc1].toFixed(2));
                      //       obj12[subc1] = Number(obj12[subc1].toFixed(2));
                      //     }
                      //
                      //
                      // // }
                    }


                  //console.log('last3Month_1===================================='+firstDay);
                  if (last3Month_1 <= doc2[k].created_at.setHours(0,0,0,0)) {
                    if (doc2[k].status != 'CANCELLED') {
                        subc1 = doc2[k].subcategoryId; //task subCategory
                        if (amsSubID == subc1) {
                          var amsES = doc2[k].estimatedHours;
                          if (doc2[k].estimatedHours == undefined || doc2[k].estimatedHours == null) {
                            amsES = 0;
                          }
                          amsTotal += amsES;
                        }
                    }
                  }

                  if (k == doc2.length-1) {
                    console.log('amsTotal==='+amsTotal);
                    var avgAMS = amsTotal/12;
                    if (avgAMS) {
                      primaryDemand = avgAMS*25/100;
                      secondaryDemand = avgAMS*50/100;
                      fullDemand = avgAMS;
                      console.log('primaryyyyyyyyyyy'+primaryDemand);
                      console.log(secondaryDemand);
                      console.log(fullDemand);

                      console.log('k=========='+k);
                      console.log(doc2.length);
                      console.log('subc1-----------------'+subc1);

                        if (obj2[amsSubID] == 0) {
                          obj2[amsSubID] += primaryDemand;
                        }else {
                          obj2[amsSubID] += primaryDemand;
                        } if (obj3[amsSubID] == 0) {
                          obj3[amsSubID] += secondaryDemand;
                        } else {
                          obj3[amsSubID] += secondaryDemand;
                        } if (obj4[amsSubID] == 0) {
                          obj4[amsSubID] += fullDemand;
                        } else {
                          obj4[amsSubID] += fullDemand;
                        }
                        if (obj5[amsSubID] == 0) {
                          obj5[amsSubID] += fullDemand;
                        } else {
                          obj5[amsSubID] += fullDemand;
                        }
                        if (obj6[amsSubID] == 0) {
                          obj6[amsSubID] += fullDemand;
                        } else {
                          obj6[amsSubID] += fullDemand;
                        }
                        if (obj7[amsSubID] == 0) {
                          obj7[amsSubID] += fullDemand;
                        } else {
                          obj7[amsSubID] += fullDemand;
                        }
                        if (obj8[amsSubID] == 0) {
                          obj8[amsSubID] += fullDemand;
                        } else {
                          obj8[amsSubID] += fullDemand;
                        }
                        if (obj9[amsSubID] == 0) {
                          obj9[amsSubID] += fullDemand;
                        } else {
                          obj9[amsSubID] += fullDemand;
                        }
                        if (obj10[amsSubID] == 0) {
                          obj10[amsSubID] += fullDemand;
                        } else {
                          obj10[amsSubID] += fullDemand;
                        }
                        if (obj11[amsSubID] == 0) {
                          obj11[amsSubID] += fullDemand;
                        } else {
                          obj11[amsSubID] += fullDemand;
                        }
                        if (obj12[amsSubID] == 0) {
                          obj12[amsSubID] += fullDemand;
                        } else {
                          obj12[amsSubID] += fullDemand;
                        }

                        obj1[subc1] = Number(obj1[subc1].toFixed(2));
                        obj2[subc1] = Number(obj2[subc1].toFixed(2));
                        obj3[subc1] = Number(obj3[subc1].toFixed(2));
                        obj4[subc1] = Number(obj4[subc1].toFixed(2));
                        obj5[subc1] = Number(obj5[subc1].toFixed(2));
                        obj6[subc1] = Number(obj6[subc1].toFixed(2));
                        obj7[subc1] = Number(obj7[subc1].toFixed(2));
                        obj8[subc1] = Number(obj8[subc1].toFixed(2));
                        obj9[subc1] = Number(obj9[subc1].toFixed(2));
                        obj10[subc1] = Number(obj10[subc1].toFixed(2));
                        obj11[subc1] = Number(obj11[subc1].toFixed(2));
                        obj12[subc1] = Number(obj12[subc1].toFixed(2));
                        console.log('obj2[subc1]====================================='+obj2[subc1]+primaryDemand);
                    }
                  }
                  //console.log(JSON.stringify(obj1));
                  //console.log(subcategoryDemand);

                  //console.log('subcategoryDemand.length==='+subcategoryDemand.length);

              })(k);
            }

            function dateDifference(start, end) {
              // Copy date objects so don't modify originals

              var s = new Date(start);
              var e = new Date(end);

              var addOneMoreDay = 0;
              if( s.getDay() == 0 || s.getDay() == 6 ) {
                addOneMoreDay = 1;
              }
              s.setHours(12,0,0,0);
              e.setHours(12,0,0,0);

              // Get the difference in whole days
              var totalDays = Math.round((e - s) / 8.64e7);
              var finaltoTalDays = totalDays +1;
              // console.log('totalDays======================================'+finaltoTalDays);

              // Get the difference in whole weeks
              var wholeWeeks = totalDays / 7 | 0;

              // Estimate business days as number of whole weeks * 5
              var days = wholeWeeks * 5;

              // If not even number of weeks, calc remaining weekend days
              if (totalDays % 7) {
                s.setDate(s.getDate() + wholeWeeks * 7);

                while (s < e) {
                  s.setDate(s.getDate() + 1);

                  // If day isn't a Sunday or Saturday, add to business days
                  if (s.getDay() != 0 && s.getDay() != 6) {
                    ++days;
                  }
                //s.setDate(s.getDate() + 1);
                }
              }
              var weekEndDays = totalDays - days + addOneMoreDay;
              var weekDays = finaltoTalDays - weekEndDays;
              //return weekEndDays;
              return weekDays;
            }

                  //console.log('-----------------------------------------------------------------------------'+c2);
                  //console.log(JSON.stringify(obj1));

                  Object.keys(obj1).forEach(function(key, index) {
                    var weekDemand1 = obj1[key];
                    if (weekDemand1) {
                      totalDemand1 += weekDemand1;
                      // console.log('totalDemand1=================='+totalDemand1);
                    }
                  });
                  Object.keys(obj2).forEach(function(key, index) {
                    var weekDemand2 = obj2[key];
                    if (weekDemand2) {
                      totalDemand2 += weekDemand2;
                      // console.log('totalDemand2=================='+totalDemand2);
                    }
                  });
                  Object.keys(obj3).forEach(function(key, index) {
                    var weekDemand3 = obj3[key];
                    if (weekDemand3) {
                      totalDemand3 += weekDemand3;
                      // console.log('totalDemand3=================='+totalDemand3);
                    }
                  });
                  Object.keys(obj4).forEach(function(key, index) {
                    var weekDemand4 = obj4[key];
                    if (weekDemand4) {
                      totalDemand4 += weekDemand4
                      // console.log('totalDemand4=================='+totalDemand4);
                    }
                  });
                  Object.keys(obj5).forEach(function(key, index) {
                    var weekDemand5 = obj5[key];
                    if (weekDemand5) {
                      totalDemand5 += weekDemand5;
                      // console.log('totalDemand5=================='+totalDemand5);
                    }
                  });
                  Object.keys(obj6).forEach(function(key, index) {
                    var weekDemand6 = obj6[key];
                    if (weekDemand6) {
                      totalDemand6 += weekDemand6;
                      // console.log('totalDemand6=================='+totalDemand6);
                    }
                  });
                  Object.keys(obj7).forEach(function(key, index) {
                    var weekDemand7 = obj7[key];
                    if (weekDemand7) {
                      totalDemand7 += weekDemand7;
                      // console.log('totalDemand7=================='+totalDemand7);
                    }
                  });
                  Object.keys(obj8).forEach(function(key, index) {
                    var weekDemand8 = obj8[key];
                    if (weekDemand8) {
                      totalDemand8 += weekDemand8;
                      // console.log('totalDemand8=================='+totalDemand8);
                    }
                  });
                  Object.keys(obj9).forEach(function(key, index) {
                    var weekDemand9 = obj9[key];
                    if (weekDemand9) {
                      totalDemand9 += weekDemand9;
                      // console.log('totalDemand9=================='+totalDemand9);
                    }
                  });
                  Object.keys(obj10).forEach(function(key, index) {
                    var weekDemand10 = obj10[key];
                    if (weekDemand10) {
                      totalDemand10 += weekDemand10;
                      // console.log('totalDemand10=================='+totalDemand10);
                    }
                  });
                  Object.keys(obj11).forEach(function(key, index) {
                    var weekDemand11 = obj11[key];
                    if (weekDemand11) {
                      totalDemand11 += weekDemand11;
                      // console.log('totalDemand11=================='+totalDemand11);
                    }
                  });
                  Object.keys(obj12).forEach(function(key, index) {
                    var weekDemand12 = obj12[key];
                    if (weekDemand12) {
                      totalDemand12 += weekDemand12;
                      // console.log('totalDemand12=================='+totalDemand12);
                    }
                  });

                  //console.log('totalDemand1=================='+totalDemand1);
                  if (totalDemand1 < c2) {
                    idleTime1 = c2 - totalDemand1;
                  }else {
                    overTime1 = c2 - totalDemand1;
                  }
                  if (totalDemand2 < c4) {
                    idleTime2 = c4 - totalDemand2;
                  }else {
                    overTime2 = c4 - totalDemand2;
                  }
                  if (totalDemand3 < c6) {
                    idleTime3 = c6 - totalDemand3;
                  }else {
                    overTime3 = c6 - totalDemand3;
                  }
                  if (totalDemand4 < c8) {
                    idleTime4 = c8 - totalDemand4;
                  }else {
                    overTime4 = c8 - totalDemand4;
                  }
                  if (totalDemand5 < c10) {
                    idleTime5 = c10 - totalDemand5;
                  }else {
                    overTime5 = c10 - totalDemand5;
                  }
                  if (totalDemand6 < c12) {
                    idleTime6 = c12 - totalDemand6;
                  }else {
                    overTime6 = c12 - totalDemand6;
                  }
                  if (totalDemand7 < c14) {
                    idleTime7 = c14 - totalDemand7;
                  }else {
                    overTime7 = c14 - totalDemand7;
                  }
                  if (totalDemand8 < c16) {
                    idleTime8 = c16 - totalDemand8;
                  }else {
                    overTime8 = c16 - totalDemand8;
                  }
                  if (totalDemand9 < c18) {
                    idleTime9 = c18 - totalDemand9;
                  }else {
                    overTime9 = c18 - totalDemand9;
                  }
                  if (totalDemand10 < c20) {
                    idleTime10 = c20 - totalDemand10;
                  }else {
                    overTime10 = c20 - totalDemand10;
                  }
                  if (totalDemand11 < c22) {
                    idleTime11 = c22 - totalDemand11;
                  }else {
                    overTime11 = c22 - totalDemand11;
                  }
                  if (totalDemand12 < c24) {
                    idleTime12 = c24 - totalDemand12;
                  }else {
                    overTime12 = c24 - totalDemand12;
                  }

                  obj1.capacity = c2;
                  obj2.capacity = c4;
                  obj3.capacity = c6;
                  obj4.capacity = c8;
                  obj5.capacity = c10;
                  obj6.capacity = c12;
                  obj7.capacity = c14;
                  obj8.capacity = c16;
                  obj9.capacity = c18;
                  obj10.capacity = c20;
                  obj11.capacity = c22;
                  obj12.capacity = c24;

                  obj1.idleTime = idleTime1;
                  obj2.idleTime = idleTime2;
                  obj3.idleTime = idleTime3;
                  obj4.idleTime = idleTime4;
                  obj5.idleTime = idleTime5;
                  obj6.idleTime = idleTime6;
                  obj7.idleTime = idleTime7;
                  obj8.idleTime = idleTime8;
                  obj9.idleTime = idleTime9;
                  obj10.idleTime = idleTime10;
                  obj11.idleTime = idleTime11;
                  obj12.idleTime = idleTime12;

                  obj1.overTime = overTime1;
                  obj2.overTime = overTime2;
                  obj3.overTime = overTime3;
                  obj4.overTime = overTime4;
                  obj5.overTime = overTime5;
                  obj6.overTime = overTime6;
                  obj7.overTime = overTime7;
                  obj8.overTime = overTime8;
                  obj9.overTime = overTime9;
                  obj10.overTime = overTime10;
                  obj11.overTime = overTime11;
                  obj12.overTime = overTime12;

                  weeks["week1"]=0;
                  if (c2 == 0) {
                    weeks["week1"]=obj1;
                  } else {
                    weeks["week1"]=obj1;
                  }
                  if (c4 == 0) {
                    weeks["week2"]=obj2;
                  } else {
                    weeks["week2"]=obj2;
                  }
                  if (c6 == 0) {
                    weeks["week3"]=obj3;
                  } else {
                    weeks["week3"]=obj3;
                  }
                  if (c8 == 0) {
                    weeks["week4"]=obj4;
                  } else {
                    weeks["week4"]=obj4;
                  }
                  if (c10 == 0) {
                    weeks["week5"]=obj5;
                  } else {
                    weeks["week5"]=obj5;
                  }
                  if (c12 == 0) {
                    weeks["week6"]=obj6;
                  } else {
                    weeks["week6"]=obj6;
                  }
                  if (c14 == 0) {
                    weeks["week7"]=obj7;
                  } else {
                    weeks["week7"]=obj7;
                  }
                  if (c16 == 0) {
                    weeks["week8"]=obj8;
                  } else {
                    weeks["week8"]=obj8;
                  }
                  if (c18 == 0) {
                    weeks["week9"]=obj9;
                  } else {
                    weeks["week9"]=obj9;
                  }
                  if (c20 == 0) {
                    weeks["week10"]=obj10;
                  } else {
                    weeks["week10"]=obj10;
                  }
                  if (c22 == 0) {
                    weeks["week11"]=obj11;
                  } else {
                    weeks["week11"]=obj11;
                  }
                  if (c24 == 0) {
                    weeks["week12"]=obj12;
                  } else {
                    weeks["week12"]=obj12;
                  }
                  console.log('developers===='+developers);
                  console.log('leads======'+leads);
                  console.log('taskInProgress===='+taskInProgress);
                  res.send({developers, leads, taskInProgress, weeks});
                })
              })
            })
          })
        //res.send({developers, leads, taskInProgress, weeks, arr});
      }
    })
  // }
})
module.exports = api;
