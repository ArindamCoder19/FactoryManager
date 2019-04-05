var express = require('express');
var api = express.Router();
var User = require('../models/UserModel');
var Task = require('../models/TaskModel');
// var Status = require('../models/StatusModel');
var Response = require('../utils/response');
// var emailService = require('./emailController');
var config = require('../../config/index');
var defaultConfig = require('../../config/default');
var numeral = require('numeral');
var moment = require('moment');
var Comments = require('../models/CommentModel');

var Mongoose = require('mongoose');
var objectId = Mongoose.Types.ObjectId;
//const {alice} = require("./../config/default.js");

api.post('/task', function (req, res) {
  var token = req.decoded;
  req.body.created_at = new Date();
  var task = new Task(req.body);
  task.rfcNumber = task.rfcNumber.toUpperCase();
  task.createdBy = token.userId;
  task.category = req.body.categoryId;
  task.subCategory = req.body.subcategoryId;
  task.project = req.body.projectId;
  task.assignedTo = req.body.developerId;
  task.lead = req.body.leadId;
  task.reviewer = req.body.reviewerId;
  task.functionalConsultant = req.body.functionalConsultantId;
  task.fsiScore = numeral(req.body.fsiScore).format('0,0.0');
  var a = moment.duration({ hours: req.body.estimatedHours }) / 1000;
  console.log('a---------------------' + a);
  var hours = Math.floor(a / 3600);
  var min = Math.floor((a - (hours * 3600)) / 60);
  console.log(hours + '.' + min);
  var c = hours + '.' + min;
  task.c = req.body.estimatedHours;

  task.save(function (err, task) {
    if (!err) {
      req.body.id = task.id;
      var resData = Response.data(req.body);
      console.log(resData);
      res.send({ status: "success" });
    } else {
      // Handle Error
      var resError = Response.error({
        code: "500",
        status: "False",
        message: "duplicate RFC number"
      })
      log.error(err);
      res.status(500).send(resError);
    }
  });
});

api.get('/tasks', function (req, res) {
  var token = req.decoded;
  if (token.role.indexOf('ADMIN') > -1 || token.role.indexOf('MANAGER') > -1 || token.role.indexOf('LEAD') > -1 || token.role.indexOf('DEVELOPER') > -1 || token.role.indexOf('GUEST') > -1) {

    var filter = {};
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var searchString = req.query.t || '';
    // console.log(fromDate);
    // console.log(toDate);

    var plannedEndDateOrObj = {};

    if (fromDate == undefined && toDate != undefined) {
      // console.log('fromDate=============================='+fromDate);
      plannedEndDateOrObj['$or'] = [
        { plannedEndDate: { $exists: false } },
        { plannedEndDate: { $lte: toDate } }
      ],

        console.log(filter);

    } else if (toDate == undefined && fromDate != undefined) {
      plannedEndDateOrObj = {
        plannedEndDate: { $gte: fromDate }
      };
    } else {
      plannedEndDateOrObj = {
        plannedEndDate: { $gte: fromDate, $lte: toDate }
      };
    }

    let filterAndElements = [
      {
        $or: [
          { taskDescription: { '$regex': searchString, '$options': 'i' } },
          { rfcNumber: { '$regex': searchString, '$options': 'i' } }
        ]
      }
    ];

    if (token.role.indexOf('LEAD') > -1) {
      console.log('come to 1');
      req.query.userId && filterAndElements.push({ $or: [{ developerId: req.query.userId }, { leadId: req.query.userId }] });
    } else {
      console.log('come to 2');
      req.query.userId && filterAndElements.push({ developerId: req.query.userId });
    }

    req.query.developerId && filterAndElements.push({ developerId: req.query.developerId });
    req.query.status && filterAndElements.push({ status: req.query.status });
    req.query.categoryId && filterAndElements.push({ categoryId: req.query.categoryId });
    req.query.subcategoryId && filterAndElements.push({ subcategoryId: req.query.subcategoryId.split(",") });
    req.query.reviewerId && filterAndElements.push({ reviewerId: req.query.reviewerId });
    req.query.leadId && filterAndElements.push({ leadId: req.query.leadId });
    (fromDate || toDate) && filterAndElements.push(plannedEndDateOrObj)


    filter = {
      $and: filterAndElements
    }

    // console.log(filter);

    Task.find(filter)
      .populate('category')
      .populate('subCategory')
      // .populate('statusId')
      .populate('project')
      .populate('assignedTo')
      .populate('lead')
      .populate('reviewer')
      .populate('createdBy')
      .populate('functionalConsultant').then(function (records, err) {

        if (!err) {
          var resData = Response.data(records);
          res.send({ resData });
        } else {
          console.log('got error');
          log.error(err);
        }
      });
  } else {
    console.log('error');
    res.send(404, { message: 'no task found' });
  }
});

api.get('/task/:id', function (req, res) {
  var token = req.decoded;
  if (token.role.indexOf('ADMIN') > -1 || token.role.indexOf('MANAGER') > -1 || token.role.indexOf('LEAD') > -1 || token.role.indexOf('DEVELOPER') > -1 || token.role.indexOf('GUEST') > -1) {
    Task.findById(req.params.id)
      .populate('category')
      .populate('subCategory')
      // .populate('statusId')
      .populate('project')
      .populate('assignedTo')
      .populate('lead')
      .populate('reviewer')
      .populate('createdBy')
      .populate('functionalConsultant').then(function (doc, err) {
        if (!err) {
          var resData = Response.data(doc);
          res.send(resData);
        } else {
          log.error(err);
        }
      });
  } else {
    res.send(401, { status: 'Unauthorized access' });
  }
});


// api.get('/search-tasks', function(req, res) {
//       var token = req.decoded;
//       var searchString = req.query.t;
//       Task.find({'$or':[
//             {'taskDescription':{'$regex':searchString, '$options':'i'}},
//             {'rfcNumber':{'$regex':searchString, '$options':'i'}}]}, function(err, doc) {
//              if(!err){
//                var resData = Response.data(doc);
//                res.send(resData);
//              }else{
//                // Handle Error
//                log.error(err);
//              }
//            })
//       var filter ={};
//       if (searchString) {
//         filter.assignedTo = searchString
//       }
//       Task.find(filter).then(function(doc2, err){
//         if(!err){
//           var resData = Response.data(doc2);
//           res.send(resData);
//         }else{
//           // Handle Error
//           log.error(err);
//         }
//       })
//   });

api.put('/task/:id', function (req, res) {
  // var task = (req.body) ;
  req.body.updated_at = new Date();

  if (req.body.reviewerId) {
    req.body.reviewer = req.body.reviewerId;
  }
  if (req.body.leadId) {
    req.body.lead = req.body.leadId;
  }
  if (req.body.developerId) {
    req.body.assignedTo = req.body.developerId;
  }
  if (req.body.categoryId) {
    req.body.category = req.body.categoryId;
  }
  if (req.body.subcategoryId) {
    req.body.subCategory = req.body.subcategoryId;
  }
  if (req.body.projectId) {
    req.body.project = req.body.projectId;
  }
  if (req.body.projectId == "" || req.body.projectId == null || req.body.projectId == undefined) {
    req.body.project = [];
  }
  if (req.body.functionalConsultantId) {
    req.body.functionalConsultant = req.body.functionalConsultantId;
  }

  Task.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
    if (!err) {
      var resData = Response.data(doc._id);
      if (req.body.status === 'DELIVERED' || req.body.status === 'CANCELLED') {
        User.findById(doc.developerId, function (err, aDeveloper) {
          console.log(JSON.stringify(aDeveloper));
          if (aDeveloper && aDeveloper.email) {
            var url = defaultConfig.URL + '/task/' + req.params.id
            console.log('url---' + url);

            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: aDeveloper.email,
              from: 'Heineken <' + config.sendGrid.auth.mailId + '>',
              subject: 'Review Completed',
              text: 'Review request is completed .<br><br> ' + url,
              html: 'Review request is completed .<br><br> <a href=' + url + '>click here</a>'
            };
            sgMail.send(msg);

          }
        });
      } else if (req.body.status === 'READY-TO-REVIEW') {
        User.findById(doc.reviewerId, function (err, aReviewer) {
          console.log(JSON.stringify(aReviewer));
          if (aReviewer && aReviewer.email) {
            var url = defaultConfig.URL + '/task/' + req.params.id
            console.log('url---' + url);

            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: aReviewer.email,
              from: 'Heineken <' + config.sendGrid.auth.mailId + '>',
              subject: 'Review Request',
              text: 'Click below to review the task .<br><br> ' + url,
              html: 'Click below to review the task .<br><br> <a href=' + url + '>click here</a>'
            };
            sgMail.send(msg);
          }
        });
      }
      res.send(resData);
    } else {
      // Handle Error

      log.error(err);
    }
  });
});

api.delete('/task/:id', function (req, res) {
  Task.deleteOne({ "_id": req.params.id }, function (err, doc) {
    if (!err) {
      res.status(200).send('success');
    } else {
      var resError = Response.error({
        code: "500",
        message: "Internal Server Error"
      })
      log.error(err);
      res.status(500).send(resError);
    }
  })
});

// let getAllTasks = (res) => {
//   let arr = [];
//   Task.find().exec(async function(task_err, task_data){
//     for (var i = 0; i < task_data.length; i++) {
//       let item = task_data[i];
//       await Comments.find({taskId:item._id}).then(function(comments_data, comments_err){
//         // console.log(comments_data);
//
//         var myFirstPromise1 = new Promise((resolve, reject) => {
//             resolve(comments_data);
//         });
//         myFirstPromise1.then(async (comments_data) => {
//           console.log(comments_data);
//           item.comments = await comments_data;
//           console.log(item);
//           arr.push(item);
//         });
//       })
//       if (i == task_data.length-1) {
//
//       }
//     }
//     res.send(arr);
//   })
// }
//
// api.get('/allTasks', function(req, res){
//
//   getAllTasks(res);
// })

let getAllComment = function (taskId) {
  return new Promise(function (resolve, reject) {
    Comments.find({ taskId: taskId }).then(function (comments_data, comments_err) {
      resolve(comments_data)
    })
  })

}


api.get('/allTasks', function (req, res) {
  var result = [];

  if (req.query.fromDate || req.query.endDate) {
    var filter = {
      // "$and": [ { plannedEndDate : { "$gte" : req.query.fromDate}} , { plannedEndDate : { "$lte" : req.query.toDate}}]
      plannedEndDate: { $gte: req.query.fromDate, $lte: req.query.toDate }
    };
  }
  Task.find(filter).exec(async function (task_err, task_data) {
    for (var i = 0; i < task_data.length; i++) {

      // var item = task_data[i];
      var comments = await getAllComment(task_data[i]._id);
      // console.log(comments);
      // item.comment = comments;
      // var item = Object.assign({comment: comments}, task_data[i]);
      var item = JSON.parse(JSON.stringify(task_data[i]));
      item.comments = comments;
      result.push(item)
    }
    res.send(result)
  })
})


module.exports = api;
