var express = require('express');
var User = require('../models/UserModel');
var Task = require('../models/TaskModel');
var Timesheet = require('../models/TimesheetModel');
var config = require('../../config/index');
// var emailService = require('./emailController');
var Response = require('../utils/response');
var api = express.Router();
var numeral = require('numeral');
var moment = require('moment');
//require('../controllers/a.js')

// Create
api.post('/timesheet', function (req, res) {
  var token = req.decoded;
  console.log(JSON.stringify(req.decoded));
  req.body.created_at = new Date();
  var timesheetproductive = new Timesheet(req.body);
  timesheetproductive.taskOwnerId = token.userId;
  timesheetproductive.categoryId = token.categoryId;
  timesheetproductive.taskDetails = req.body.taskId;
  if (req.body.hours == 0 || req.body.hours == '' || req.body.hours == null || req.body.hours == undefined) {
    //timesheetproductive.hours = '0.00';
    return res.send({ status: 'success' });
  } else {
    timesheetproductive.hours = numeral(req.body.hours).format('0,0.00');
  }
  //console.log(seconds);
  Timesheet.find({ taskId: req.body.taskId }).sort('-seconds').exec(function (err, doc) {
    console.log(doc);
    if (doc && doc.length > 0) {
      var timespend = doc[0].seconds;
      if (timespend) {
        console.log('found');
        //var a = timesheetproductive.hours.split('.');
        var seconds = moment.duration({ hours: timesheetproductive.hours }) / 1000;
        //var seconds = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
        console.log(seconds);
        timesheetproductive.seconds = seconds + timespend;
        console.log(timesheetproductive.seconds);
        var hours = Math.floor(timesheetproductive.seconds / 3600);
        var min = Math.floor((timesheetproductive.seconds - (hours * 3600)) / 60);
        //  var seconds = Math.floor(timesheetproductive.seconds % 60);
        console.log(hours + '.' + min);
        timesheetproductive.totalSpend = hours + '.' + min;

      } else {
        console.log('not found');
        //var a = timesheetproductive.hours.split('.');
        //var seconds = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
        var seconds = moment.duration({ hours: timesheetproductive.hours }) / 1000;
        timesheetproductive.seconds = seconds;
        timesheetproductive.totalSpend = timesheetproductive.hours;
      }
    } else {
      //var a = timesheetproductive.hours.split('.');
      //var seconds = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
      var seconds = moment.duration({ hours: timesheetproductive.hours }) / 1000;
      console.log('no data');
      console.log(seconds);
      timesheetproductive.seconds = seconds;
      timesheetproductive.totalSpend = timesheetproductive.hours;
    }
    var obj = { hoursSpend: timesheetproductive.totalSpend }
    console.log('o----------------------' + obj);

    timesheetproductive.save(function (err, timesheet) {
      if (!err) {
        Task.findOneAndUpdate({ "_id": req.body.taskId }, { $set: Object.assign({}, obj) }, { upset: true }, function (err, doc1) {
          req.body.id = timesheetproductive.id;
          var resData = Response.data(req.body);
          res.send({ status: 'success' });
        });
      } else {
        // Handle Error
        var resError = Response.error({
          code: "500",
          message: "Internal Server Error"
        })
        log.error(err);
        res.send(resError);
      }
    });
  });
});

api.get('/timesheets', function (req, res) {
  // var total = 0;
  // var subTotal = 0;
  var token = req.decoded;
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;
  var filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.userId && req.query.userId != null) {
    filter.taskOwnerId = req.query.userId;
  } else {
    filter.taskOwnerId = token.userId;
  }
  filter.aDate = {
    $gte: fromDate,
    $lte: toDate
  };
  var a = req.query.userId || token.userId;
  User.find({ _id: a }, function (err, doc) {
    if (doc && doc.length > 0) {
      var a = doc[0].created_at;
      console.log(a);
      console.log(req.query.toDate);
      var d = a.getDate();
      var m = a.getMonth() + 1;
      var y = a.getFullYear();
      var str = y + '/' + m + '/' + d;
      var cdate = new Date(str);
      //var range = getDates(a,new Date(req.query.toDate));
      if ((token.role.indexOf('ADMIN') > -1 || token.role.indexOf('LEAD') > -1) && req.query.userId) {
        console.log(token.role);
        filter.aDate = {
          $gte: cdate,
          $lte: toDate
        };
        filter.status = 'submitted';
        Timesheet.find(filter, { __v: 0 }).sort('-aDate').exec(function (err, docs) {
          if (docs && docs.length > 0) {
            var d = docs[0].aDate.getDay();
            console.log('aDate---------' + docs[0].aDate);
            var n = 1 + d;
            var n2 = new Date(docs[0].aDate.getTime() - (n * 24 * 60 * 60 * 1000));
            var n3 = new Date(n2.getTime() + (6 * 24 * 60 * 60 * 1000));
            var filter2 = {};
            filter2.status = 'submitted';
            if (req.query.userId && req.query.userId != null) {
              filter2.taskOwnerId = req.query.userId;
            } else {
              filter2.taskOwnerId = token.userId;
            }
            filter2.aDate = {
              $gte: n2,
              $lte: n3
            };
            Timesheet.find(filter2, { __v: 0 })
              .populate('taskDetails').then(function (doc1, err) {
                console.log(JSON.stringify(doc1));
                res.send({ resData: doc1, fromDate: n2, toDate: n3 });
              });
          } else {
            var filter3 = {};
            filter3.status = 'submitted';
            if (req.query.userId && req.query.userId != null) {
              filter3.taskOwnerId = req.query.userId;
            } else {
              filter3.taskOwnerId = token.userId;
            }
            Timesheet.find(filter3, { __v: 0 }).sort('-aDate').exec(function (err, docs1) {
              if (docs1 && docs1.length > 0) {
                var d = docs1[0].aDate.getDay();
                console.log('aDate---------' + docs1[0].aDate);
                var n = 1 + d;
                var n2 = new Date(docs1[0].aDate.getTime() - (n * 24 * 60 * 60 * 1000));
                var n3 = new Date(n2.getTime() + (6 * 24 * 60 * 60 * 1000));
                var filter2 = {};
                filter2.status = 'submitted';
                if (req.query.userId && req.query.userId != null) {
                  filter2.taskOwnerId = req.query.userId;
                } else {
                  filter2.taskOwnerId = token.userId;
                }
                filter2.aDate = {
                  $gte: n2,
                  $lte: n3
                };
                Timesheet.find(filter2, { __v: 0 })
                  .populate('taskDetails').then(function (doc1, err) {
                    console.log(JSON.stringify(doc1));
                    res.send({ resData: doc1, fromDate: n2, toDate: n3 });
                  });
              } else {
                var d = cdate.getDay();
                var n = d;
                var n2 = new Date(cdate.getTime() - (n * 24 * 60 * 60 * 1000));
                var n3 = new Date(n2.getTime() + (6 * 24 * 60 * 60 * 1000));
                var filter4 = {};
                filter4.status = 'submitted';
                if (req.query.userId && req.query.userId != null) {
                  filter4.taskOwnerId = req.query.userId;
                } else {
                  filter4.taskOwnerId = token.userId;
                }
                filter4.aDate = {
                  $gte: n2,
                  $lte: n3
                };
                Timesheet.find(filter4, { __v: 0 })
                  .populate('taskDetails').then(function (doc1, err) {
                    console.log(JSON.stringify(doc1));
                    //res.send({resData:doc1, fromDate:n2,toDate:n3});
                    return res.send({ resData: doc1, fromDate: n2, toDate: n3 });
                  });
              }
            });
          }
        });

      } else {
        console.log('comes here foe else....');
        var day1 = ['9', '00'];
        var day2 = ['9', '00'];
        var seconds1 = (+parseInt(day1[0])) * 60 * 60 + (+parseInt(day1[1])) * 60;
        var seconds2 = (+parseInt(day2[0])) * 60 * 60 + (+parseInt(day2[1])) * 60;

        filter.taskOwnerId = token.userId;
        filter.aDate = {
          $gte: fromDate,
          $lte: toDate
        };
        var mmCallback = function (data) {
          var sday = data.getDay();
          var from = sday;
          console.log('days to be substract ===' + from);
          var ffdate = new Date(data.getTime() - (from * 24 * 60 * 60 * 1000));
          var ttdate = new Date(ffdate.getTime() + (6 * 24 * 60 * 60 * 1000));
          var filter = {};
          if (req.query.userId && req.query.userId != null) {
            filter.taskOwnerId = req.query.userId;
          } else {
            filter.taskOwnerId = token.userId;
          }
          filter.aDate = {
            $gte: ffdate,
            $lte: ttdate
          };
          Timesheet.find(filter, { __v: 0 })
            .populate('taskDetails').then(function (doc1, err) {
              console.log(JSON.stringify(doc1));
              res.send({ resData: doc1, fromDate: ffdate, toDate: ttdate });
            });

        }
        var sendres = function (data, date) {
          console.log('res send');
          filter.aDate = {
            $gte: new Date(req.query.fromDate),
            $lte: new Date(req.query.toDate)
          };
          Timesheet.find(filter, { __v: 0 })
            .populate('taskDetails').then(function (doc1, err) {
              console.log(JSON.stringify(doc1));
              res.send({ resData: doc1, fromDate: new Date(req.query.fromDate), toDate: new Date(req.query.toDate) });
            });
        }
        var meCallback = function (error, data) {
          if (data) {
            console.log(data.date);
            //console.log(range.indexOf(data.date));
            if (data.seconds == 0) {
              //var nextday = new Date(data.date.getTime() + (1 * 24 * 60 * 60 * 1000));
              getnData(data.nextday, token, meCallback);
            } else if (data.seconds == 1) {
              mmCallback(data.nextday);
            } else {
              console.log('comes here');
              if (data.seconds == seconds2) {
                console.log('got holiday');
                filter = {};
                filter.taskOwnerId = token.userId;
                filter.aDate = {
                  $gte: data.date,
                  $lt: data.nextday
                };
                Timesheet.find(filter).then(function (doc, err) {
                  console.log(doc);
                  if (doc && doc.length > 0 && ((doc[0].type == 'vacation') || (doc[0].type == 'holiday'))) {
                    console.log('vcac' + Date.parse(data.nextday));
                    //var td =Date.parse(new Date(new Date(req.query.toDate).getTime()+(1 * 24 * 60 * 60 * 1000  )));
                    var td = Date.parse(req.query.toDate);
                    console.log('vacc--' + td);
                    if (Date.parse(data.nextday) >= td) {
                      sendres(null, data.nextday);
                    } else {
                      getnData(data.nextday, token, meCallback);
                    }
                  } else {
                    console.log('comes holiday else');
                    mmCallback(data.nextday);
                  }
                });
              } else if (data.seconds >= seconds1) {
                //var td =Date.parse(new Date(new Date(req.query.toDate).getTime()+(1 * 24 * 60 * 60 * 1000  )));
                var td = Date.parse(req.query.fromDate);
                console.log('---' + td);
                console.log('--' + Date.parse(data.nextday));
                console.log(Date.parse(data.nextday) >= td);
                //  console.log(td);
                if (Date.parse(data.nextday) >= td) {
                  console.log('if block');

                  sendres(null, data.nextday);
                } else {
                  getnData(data.nextday, token, meCallback);
                }
              } else {
                mmCallback(data.nextday);
              }
            }
          }
        }
        getnData(cdate, token, meCallback);
      }


    }
  })
});

// api.get('/timesheets', function(req, res) {
//    // var total = 0;
//    // var subTotal = 0;
//    var token = req.decoded;
//    var fromDate = new Date(req.query.fromDate);
//   var toDate = new Date(req.query.toDate);
//   var filter ={};
//   filter.taskOwnerId = token.userId;
//   filter.aDate= {
//       $gte: fromDate,
//       $lte: toDate
//   };
//   Timesheet.find(filter, {__v: 0})
//   .populate('taskDetails').then(function(records, err) {
//     res.send({resData:records});
//   });
// });

api.post('/timesheet-submit', function (req, res) {
  var token = req.decoded;
  filter = {};
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;
  var td = Date.parse(toDate);
  var range = 1 - getDates(fromDate, toDate);
  var day1 = ['9', '00'];
  var day2 = ['9', '00'];
  var seconds1 = (+parseInt(day1[0])) * 60 * 60 + (+parseInt(day1[1])) * 60;
  var seconds2 = (+parseInt(day2[0])) * 60 * 60 + (+parseInt(day2[1])) * 60;
  filter.taskOwnerId = token.userId;
  filter.aDate = {
    $gte: fromDate,
    $lte: toDate
  };

  var invalidDates = [];
  var sendres = function (data, date) {
    console.log('res send');
    if (date.length > 0) {
      res.send({ status: 'un-success', resData: date });
    } else {
      console.log('res send');
      res.send({ status: 'success' });
    }
  }
  var meCallback = function (error, data) {
    if (data) {
      if (data.seconds == 0) {
        getData(data.nextday, token, meCallback);
      } else {
        console.log(JSON.stringify(invalidDates));
        console.log('comes here');
        // var tSecond = 24 * 60 * 60 ;
        // if (data.seconds > tSecond) {
        //  return res.send({status: 'un-scuccess',date:data.nextday});
        // }
        var nextday = data.nextday;
        console.log(nextday);
        //var nxt = new Date(nextday.getTime() + (2 * 24 * 60 * 60 * 1000));
        //console.log(nxt);
        if (data.isValid === false) {
          invalidDates.push(nextday);
        }
        var t = new Date(req.query.toDate);
        var t1 = new Date(t.getTime() + (1 * 24 * 60 * 60 * 1000));
        var td = Date.parse(t1);
        var tt = new Date(nextday.getTime() + (1 * 24 * 60 * 60 * 1000));
        //var td = Date.parse(new Date(new Date(req.query.toDate)));
        console.log(td);
        console.log(Date.parse(nextday));
        if (Date.parse(tt) >= td) {
          sendres(null, invalidDates);
        } else {
          console.log('--' + nextday);
          getData(nextday, token, meCallback);
        }
      }
    }
  }
  User.find({ _id: token.userId }, function (err, user) {
    if (user) {
      var udate = user[0].created_at.setHours(0, 0, 0, 0);
      var fdate = Date.parse(req.query.fromDate);
      var tDate = Date.parse(req.query.toDate);
      console.log('ud======================' + udate);
      console.log('fd=====================================' + fdate);
      console.log('td========================================================' + tDate);
      if (fdate <= udate && udate <= tDate) {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        getData(user[0].created_at, token, meCallback);
      } else {
        getData(fromDate, token, meCallback);
      }
    }
  });
})


function getData(date, token, callback) {
  console.log(date);
  var d = new Date(date);
  var dd = new Date(d.setHours(0, 0, 0, 0));
  console.log('dd---' + dd);
  //console.log(str);
  var day = dd.getDay();
  console.log('day-===' + day);
  var obj = {};
  obj.isValid = false;
  if (day == 0 || day == 6) {
    obj.seconds = 0;
    var nextday = new Date(dd.getTime() + (1 * 24 * 60 * 60 * 1000));
    obj.date = dd;
    obj.nextday = nextday;
    callback(null, obj);
  } else {
    //var predate = new Date(dd.getTime() - (1 * 24 * 60 * 60 * 1000));
    //var nextday = new Date(new Date(date).getTime() + (1 * 24 * 60 * 60 * 1000));
    var nextday = new Date(dd.getTime() + (1 * 24 * 60 * 60 * 1000));
    filter = {};
    filter.taskOwnerId = token.userId;
    filter.aDate = {
      $gte: dd,
      $lt: nextday
    };
    Timesheet.find(filter).then(function (doc, err) {
      console.log(doc.length);
      console.log(JSON.stringify('doc1--------------' + doc));
      if (doc && doc.length > 0) {
        var total = 0;
        for (var i = 0; i < doc.length; i++) {
          (function (j) {
            //var b =  doc[i].hours.split('.');
            //now = (+parseInt(b[0])) * 60 * 60 + (+parseInt(b[1])) * 60;
            now = moment.duration({ hours: doc[i].hours }) / 1000;
            total += now;
          })(i);
        }
        var day1 = ['9', '00'];
        var day2 = ['9', '00'];
        var day3 = ['24', '00'];
        var seconds1 = (+parseInt(day1[0])) * 60 * 60 + (+parseInt(day1[1])) * 60;
        var seconds2 = (+parseInt(day2[0])) * 60 * 60 + (+parseInt(day2[1])) * 60;
        var seconds3 = (+parseInt(day3[0])) * 60 * 60 + (+parseInt(day3[1])) * 60;
        console.log(seconds1);
        console.log(seconds2);
        console.log(total);
        if (total >= seconds1) {
          if (total >= seconds3 + 1) {
            obj.isValid = false;
            obj.seconds = total;
            var nextday = new Date(dd.getTime() + (1 * 24 * 60 * 60 * 1000));
            obj.nextday = nextday;
            obj.date = dd;
            callback(null, obj);
          } else {
            console.log(seconds1);
            console.log('---');
            obj.isValid = true;
            obj.seconds = total;
            var nextday = new Date(dd.getTime() + (1 * 24 * 60 * 60 * 1000));
            console.log(nextday);
            obj.nextday = nextday;
            obj.date = dd;
            // console.log(obj.nextday);
            // console.log('obj'+JSON.stringify(obj));
            // callback(null,obj);
            var l = 0;

            doc.forEach(function (obj1) {
              if (obj1.type == 'vacation' || obj1.type == 'holiday') {
                obj.isValid = false;
                console.log('obj' + JSON.stringify(obj));
                callback(null, obj);
              } else {
                l++;
                Timesheet.findOneAndUpdate({ "_id": obj1._id }, { $set: Object.assign({}, { status: 'submitted' }) }, { upset: true }, function (err, docu) {
                });
                if (l === doc.length) {
                  console.log(obj.nextday);
                  console.log('obj' + JSON.stringify(obj));
                  callback(null, obj);
                }
              }

            })
            //callback(null, obj);
          }
        } else if (total == seconds2) {
          //filter.type = 'vacation';
          Timesheet.find({ $or: [{ 'type': 'vacation' }, { 'type': 'holiday' }] }).find(filter).then(function (doc1, err) {
            //  console.log(JSON.stringify('doc1--------------'+doc1));
            if (doc1 && doc1.length > 0) {
              doc1.forEach(function (obj1) {
                obj1.isValid = false;
                console.log(JSON.stringify('vacation-------' + obj));
                //console.log('vacation-----'+obj);
                Timesheet.findOneAndUpdate({ "_id": obj1._id }, { $set: Object.assign({}, { status: 'submitted' }) }, { upset: true }, function (err, docu) {
                });
              });
              obj.isValid = true;
              console.log(JSON.stringify('obj1--------' + obj));
              //console.log('obj1--------'+obj);
            } else {
              obj.isValid = false;
              console.log(JSON.stringify('obj2--------' + obj));
              //console.log('obj2---------'+obj);
            }
            obj.seconds = total;
            var nextday = new Date(dd.getTime() + (1 * 24 * 60 * 60 * 1000));
            console.log(nextday);
            obj.nextday = nextday;
            obj.date = dd;
            console.log(obj.nextday);
            console.log('obj' + JSON.stringify(obj));
            callback(null, obj);
          });
        } else {
          obj.seconds = 1;
          var nextday = new Date(dd.getTime() + (1 * 24 * 60 * 60 * 1000));
          console.log(nextday);
          obj.nextday = nextday;
          obj.date = dd;
          console.log(obj.nextday);
          console.log('obj' + JSON.stringify(obj));
          callback(null, obj);
        }
      } else {
        obj.seconds = 1;
        //var nextday = new Date(date.getTime() + (1 * 24 * 60 * 60 * 1000));

        //obj.nextday = nextday;
        var nextday = new Date(dd.getTime() + (1 * 24 * 60 * 60 * 1000));
        console.log('dd here' + dd);
        obj.date = dd;
        obj.nextday = nextday;
        obj.isValid = false;
        console.log('obj in null' + JSON.stringify(obj));
        callback(null, obj);
      }
    })
  }
}

function getnData(date, token, callback) {
  var dd = new Date(date);
  console.log('dd---' + dd);
  var day = dd.getDay();
  console.log('day-===' + day);
  var obj = {};
  var nextday = new Date(new Date(date).getTime() + (1 * 24 * 60 * 60 * 1000));
  if (day == 0 || day == 6) {
    obj.seconds = 0;
    obj.date = dd;
    obj.nextday = nextday;
    callback(null, obj);
  } else {
    filter = {};
    filter.taskOwnerId = token.userId;
    filter.aDate = {
      $gte: date,
      $lt: nextday
    };
    Timesheet.find(filter).then(function (doc, err) {
      console.log(doc.length);
      if (doc && doc.length > 0) {
        console.log(doc.length);
        var total = 0;
        for (var i = 0; i < doc.length; i++) {
          (function (j) {
            if (doc[i].status == 'not-submitted') {
              obj.seconds = 1;
              obj.date = dd;
              obj.nextday = nextday;
              //console.log('--'+JSON.stringify(obj));
              callback(null, obj);
            }
            //var b =  doc[i].hours.split('.');
            //console.log(JSON.stringify(b));
            //now = (+parseInt(b[0])) * 60 * 60 + (+parseInt(b[1])) * 60;
            now = moment.duration({ hours: doc[i].hours }) / 1000;
            total += now;
          })(i);
        }
        obj.seconds = total;
        obj.date = dd;
        obj.nextday = nextday;
        //console.log('--'+JSON.stringify(obj));
        callback(null, obj);
      } else {
        console.log('comes to else');
        obj.seconds = 1;
        obj.date = dd;
        obj.nextday = nextday;
        callback(null, obj);
      }
    })
  }
}

function getDates(startDate, stopDate) {
  console.log(startDate);
  console.log(stopDate);
  var oneDay = 24 * 3600 * 1000;
  for (var d = [], ms = startDate * 1, last = stopDate * 1; ms <= last; ms += oneDay) {
    d.push(new Date(ms));
    console.log('ms--------' + ms);
  }
  console.log('---' + JSON.stringify(d));
  return d;
}

// Get details by id
api.get('/timesheet/:id', function (req, res) {
  Timesheet.findById(req.params.id, function (err, doc) {
    if (!err) {
      var resData = Response.data(doc);
      res.send(resData);
    } else {
      // Handle Error
      log.error(err);
    }
  });
})

api.put('/timesheet/:id', function (req, res) {
  req.body.updated_at = new Date();
  var timesheetproductive = new Timesheet(req.body);
  var obj = {};

  Timesheet.find({ _id: req.params.id }).exec(function (err, doc) {
    console.log(doc);
    if (doc && doc.length > 0) {
      var timespend = doc[0].hours;
      var ts = doc[0].id;
      if (req.body.hours == 0 || req.body.hours == '' || req.body.hours == null || req.body.hours == undefined) {
        Timesheet.deleteOne({ "_id": req.params.id }, function (err, doc1) {
          if (!err) {
            if (timespend) {
              console.log('found');
              console.log(doc[0].hours);
              //var a = doc[0].hours.split('.');
              //console.log(JSON.stringify(a));
              //var seconds1 = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
              var seconds1 = moment.duration({ hours: doc[0].hours }) / 1000;
              console.log(timespend);
              console.log(seconds1);

              var seconds2 = 0;

              obj.seconds = (doc[0].seconds - seconds1) + seconds2;
              obj.hours = req.body.hours;
              obj.status = 'not-submitted';
              if (!err && doc[0].taskId && doc[0].taskId != null) {
                var obj2 = {};
                Task.find({ _id: doc[0].taskId }).exec(function (err, doc2) {
                  console.log(doc2);
                  if (doc2 && doc2.length > 0) {
                    var timespend2 = doc2[0].hoursSpend;
                    if (timespend2) {
                      console.log('found');
                      console.log(doc2[0].hoursSpend);
                      var a = doc2[0].hoursSpend.split('.');
                      console.log(JSON.stringify(a));
                      var seconds3 = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
                      var sec = (seconds3 - seconds1) + seconds2;

                      var hours = Math.floor(sec / 3600);
                      var min = Math.floor((sec - (hours * 3600)) / 60);
                      //  var seconds = Math.floor(timesheetproductive.seconds % 60);
                      console.log(hours + '.' + min);
                      obj2.hoursSpend = hours + '.' + min;
                    }
                    Task.findOneAndUpdate({ _id: doc[0].taskId }, { $set: Object.assign({}, obj2) }, { upset: true }, function (err, doc3) {
                      if (!err) {
                        var resData = Response.data(doc3._id);
                        res.send(resData);
                      } else {
                        // Handle Error
                        log.error(err);
                      }
                    });
                  } else {
                    log.error(err);
                  }
                });
              } else {
                // console.log(JSON.stringify(doc[0]));
                res.send(obj);
              }
            }
            //res.status(200).send({status:'success'});
          } else {
            // Handle Error
            var resError = Response.error({
              code: "500",
              message: "Internal Server Error"
            })
            log.error(err);
            res.status(500).send(resError);
          }
        })
      } else {
        if (timespend) {
          console.log('found');
          console.log(doc[0].hours);
          //var a = doc[0].hours.split('.');
          //console.log(JSON.stringify(a));
          //var seconds1 = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
          var seconds1 = moment.duration({ hours: doc[0].hours }) / 1000;
          console.log(timespend);
          console.log(seconds1);
          if (req.body.hours) {
            //var b = req.body.hours.split('.');
            //console.log(JSON.stringify(b));
            //var seconds2 = (+parseInt(b[0])) * 60 * 60 + (+parseInt(b[1])) * 60;
            var seconds2 = moment.duration({ hours: req.body.hours }) / 1000;
            console.log(timespend);
            console.log(seconds2);
          }
          obj.seconds = (doc[0].seconds - seconds1) + seconds2;
          obj.hours = req.body.hours;
          obj.status = 'not-submitted';

          Timesheet.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, obj) }, { upset: true }, function (err, doc1) {
            if (!err && doc[0].taskId && doc[0].taskId != null) {
              var obj2 = {};

              Task.find({ _id: doc[0].taskId }).exec(function (err, doc2) {
                console.log(doc2);
                if (doc2 && doc2.length > 0) {
                  var timespend2 = doc2[0].hoursSpend;
                  if (timespend2) {
                    console.log('found');
                    console.log(doc2[0].hoursSpend);
                    var a = doc2[0].hoursSpend.split('.');
                    console.log(JSON.stringify(a));
                    var seconds3 = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
                    var sec = (seconds3 - seconds1) + seconds2;

                    var hours = Math.floor(sec / 3600);
                    var min = Math.floor((sec - (hours * 3600)) / 60);
                    //  var seconds = Math.floor(timesheetproductive.seconds % 60);
                    console.log(hours + '.' + min);
                    obj2.hoursSpend = hours + '.' + min;
                  }
                  Task.findOneAndUpdate({ _id: doc[0].taskId }, { $set: Object.assign({}, obj2) }, { upset: true }, function (err, doc3) {
                    if (!err) {
                      var resData = Response.data(doc3._id);
                      res.send(resData);
                    } else {
                      // Handle Error
                      log.error(err);
                    }
                  });
                } else {
                  log.error(err);
                }
              });
            } else {
              // console.log(JSON.stringify(doc[0]));
              res.send(obj);
            }
          });
        }
      }

    }
  });
});

// Delete by id
api.delete('/timesheet/:id', function (req, res) {
  var obj = {};

  Timesheet.find({ _id: req.params.id }).exec(function (err, doc1) {
    console.log(doc1);
    if (doc1 && doc1.length > 0) {
      var timespend = doc1[0].hours;
      if (timespend) {
        console.log('found');
        console.log(doc1[0].hours);
        //var a = doc1[0].hours.split('.');
        //console.log(JSON.stringify(a));
        //var seconds1 = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
        var seconds1 = moment.duration({ hours: doc1[0].hours }) / 1000;
        console.log(timespend);
        console.log(seconds1);

        Task.find({ _id: doc1[0].taskId }).exec(function (err, doc2) {
          console.log(doc2);
          if (doc2 && doc2.length > 0) {
            var timespend2 = doc2[0].hoursSpend;
            if (timespend2) {
              console.log('found');
              console.log(doc2[0].hoursSpend);
              var a = doc2[0].hoursSpend.split('.');
              console.log(JSON.stringify(a));
              var seconds2 = (+parseInt(a[0])) * 60 * 60 + (+parseInt(a[1])) * 60;
              console.log(timespend);
              console.log(seconds2);


              var a = seconds2 - seconds1;
              var hours = Math.floor(a / 3600);
              var min = Math.floor((a - (hours * 3600)) / 60);
              console.log(hours + '.' + min);
              obj.hoursSpend = hours + '.' + min;

              Task.findOneAndUpdate({ _id: doc1[0].taskId }, { $set: Object.assign({}, obj) }, { upset: true }, function (err, doc3) {
                Timesheet.deleteOne({ "_id": req.params.id }, function (err, doc) {
                  if (!err) {
                    res.status(200).send({ status: 'success' });
                  } else {
                    // Handle Error
                    var resError = Response.error({
                      code: "500",
                      message: "Internal Server Error"
                    })
                    log.error(err);
                    res.status(500).send(resError);
                  }
                })
              });
            }
          } else {
            Timesheet.deleteOne({ "_id": req.params.id }, function (err, doc) {
              if (!err) {
                res.status(200).send({ status: 'success' });
              } else {
                // Handle Error
                var resError = Response.error({
                  code: "500",
                  message: "Internal Server Error"
                })
                log.error(err);
                res.status(500).send(resError);
              }
            })
          }
        });
      }
    }
  });

});

api.get('/updateTimesheet', function (req, res) {
  Timesheet.find().then(async function (timesheet_data, timesheet_err) {

    for (let i in timesheet_data) {
      await Timesheet.findOneAndUpdate({ '_id': timesheet_data[i]._id }, { $set: Object.assign({}, { taskOwnerDetails: timesheet_data[i].taskOwnerId }) }, { upset: true }, function (err, doc) {

      });
    }
    // console.log(timesheet_data);
    res.send(timesheet_data);
  });
});

api.get('/download-ts', function (req, res) {
  var filter = {};
  if (req.query.fromDate && req.query.endDate) {
    filter = {
      // "$and": [ { plannedEndDate : { "$gte" : req.query.fromDate}} , { plannedEndDate : { "$lte" : req.query.toDate}}]
      "$and": [{ status: "submitted" }, { aDate: { $gte: req.query.fromDate, $lte: req.query.toDate } }]

    };
  } else {
    filter = { status: "submitted" }
  }
  Timesheet.find(filter, ['aDate', 'hours', 'type', 'subType', 'taskDetails', 'taskOwnerId'])
    .populate({
      path: 'taskDetails',
      select: ['rfcNumber']
    }) 
    // .populate('taskOwnerDetails') 
    .then((data) => {

      /** Get User Info when entire Timesheet data is downloaded **/
      // let newDataSet = [];
      // for(let i =0; i< data.length; i++) {
      //   await User
      //   .findOne({_id: data[i].taskOwnerId}, ["firstName", "lastName", "role"])
      //   .then((userData) => {
      //
      //     let newItem = JSON.parse(JSON.stringify(data[i]));
      //     newItem["user"] = userData;
      //     newDataSet.push(newItem);
      //   })
      // }
      res.send(data);
    });
});

module.exports = api;
