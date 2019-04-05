var express = require('express');
var Task = require('../models/TaskModel')
var FutureScope = require('../models/FutureScopeModel');
var Response = require('../utils/response');
var unionBy = require('lodash.unionby');
var numeral = require('numeral');
var api = express.Router();

// Create
api.post('/futureScope', function (req, res) {
  req.body.created_at = new Date();
  req.body.updated_at = new Date();
  var fs = new FutureScope(req.body);
  fs.projectName = fs.projectName.toUpperCase();
  fs.fteExpected = numeral(req.body.fteExpected).format('0,0.00');
  fs.estimatedHours = numeral(req.body.estimatedHours).format('0,0.00');
  fs.status = req.body.statusId;
  fs.managedBy = req.body.managedById;
  fs.projectType = req.body.projectTypeId;
  fs.category = req.body.categoryId;
  fs.subCategory = req.body.subCategoryId;
  FutureScope.find({ categoryId: fs.categoryId }).exec(function (err, doc) {
    console.log(doc.length);
    if (doc.length <= 0) {
      fs.save(function (err, futureScope) {
        if (!err) {
          req.body.id = futureScope.id;
          var resData = Response.data(req.body);
          res.send({ status: 'success' });
        } else {
          // Handle Error
          var resError = Response.error({
            code: "500",
            message: "Internal Server Error"
          })
          log.error(err);
          res.status(500).send(resError);
        }
      });
    } else {
      var save = true;
      for (var i = 0; i < doc.length; i++) {
        (function (j) {
          console.log(doc[i]);
          var fp = fs.projectName;
          var dp = doc[i].projectName;
          console.log(fp);
          console.log(dp);
          if (fp == dp) {
            save = false;
            console.log(fp == dp);
          }
        })(i);
      }
      if (save == true) {
        fs.save(function (err, futureScope) {
          if (!err) {
            req.body.id = futureScope.id;
            var resData = Response.data(req.body);
            res.send({ status: 'success' });
          } else {
            // Handle Error
            var resError = Response.error({
              code: "500",
              message: "Internal Server Error"
            })
            log.error(err);
            res.status(500).send(resError);
          }
        });
        //save here
      } else {
        res.json({ status: 'false', message: 'Project name already exist' });
      }

    }
  });
});

// Get all
api.get('/futureScopes', function (req, res) {
  var filter = {};
  var array = [];
  if (req.query.statusId) {
    var stat = req.query.statusId.split(',');
    // console.log(JSON.stringify(rol));
    // for (var i = 0; i < stat.length; i++) {
    //   var obj1 = new Object();
    //   obj1.statusId = stat[i];
    //   array.push(obj1);
    //   // console.log(JSON.stringify(array));
    //   filter.$or = array;
    // }
    filter.statusId = stat;
  }
  if (req.query.categoryId) {
    var cat = req.query.categoryId.split(',');
    // console.log(JSON.stringify(rol));
    // for (var i = 0; i < cat.length; i++) {
    //   var obj1 = new Object();
    //   obj1.categoryId = cat[i];
    //   array.push(obj1);
    //   // console.log(JSON.stringify(array));
    //   filter.$or = array;
    // }
    filter.categoryId = cat;
  }
  if (req.query.subCategoryId) {
    var subc = req.query.subCategoryId.split(',');
    filter.subCategoryId = subc;
  }
  var doc1 = [];
  var filter3 = { status: { $ne: 'CANCELLED' } };
  Task.find(filter3).then(function (data, err) {
    doc1 = data;
    //console.log(doc1);
    FutureScope.find(filter, { __v: 0 })
      .populate('status')
      .populate('managedBy')
      .populate('projectType')
      .populate('category')
      .populate('subCategory')
      .then(function (records, err) {
        console.log(records.length);
        if (records.length > 0) {
          var resData2 = Response.data(records);
          var test = records;
          //console.log('r2-------------'+records[0]._id);
          for (var i = 0; i < records.length; i++) {
            var total = 0;
            var rid = records[i]._id;
            var consumedHours = 0.00;
            // console.log(doc1.length);
            for (var k = 0; k < doc1.length; k++) {
              // console.log(doc1[k]);
              if (doc1[k].projectId == rid) {
                var consumed = doc1[k].estimatedHours;
                console.log(consumed);
                if (consumed) {
                  var seconds = (+parseInt(consumed)) * 60 * 60;
                  total += seconds;
                  // console.log('s--------------------------------------------------------------'+seconds);
                  // console.log('t================='+total);
                  var hours = Math.floor(total / 3600);
                  var min = Math.floor((total - (hours * 3600)) / 60);
                  //console.log( hours +'.'+ min);
                  var consumedHours = hours + '.' + min;
                  // console.log('c----------------------'+consumedHours);
                }
              }
            }
            test[i]["consumedHours"] = parseFloat(consumedHours).toFixed(2);
          }
          var data = {};
          data["data"] = test;
          // data.resData["data"] = test;
          res.send(data);
        } else {
          console.log("comes here============");
          var data = {};
          data["data"] = [];
          res.send(data)
          log.error(err);
        }
      });
  });
});

// Get details by id
api.get('/futureScope/:id', function (req, res) {
  FutureScope.findById(req.params.id)
    .populate('status')
    .populate('managedBy')
    .populate('projectType')
    .populate('category')
    .populate('subCategory')
    .then(function (doc, err) {
      if (!err) {
        var total = 0;
        Task.find().sort('-seconds').exec(function (err, doc1) {
          for (var i = 0; i < doc1.length; i++) {
            if (doc1[i].futureScopeId == req.params.id) {
              console.log('df==========================================================' + doc1[i].futureScopeId);
              doc1[i]
              console.log(doc1[i]);
              var consumed = doc1[i].estimatedHours;
              if (consumed) {
                //var a = consumed.split('.');
                var seconds = (+parseInt(consumed[0])) * 60 * 60;
                total += seconds;
                console.log('s--------------------------------------------------------------' + seconds);
                console.log('t=================' + total);
                var hours = Math.floor(total / 3600);
                var min = Math.floor((total - (hours * 3600)) / 60);
                console.log(hours + '.' + min);
                var consumedHours = hours + '.' + min;
              } else {
                consumedHours = 0.00;
              }
              console.log('sh-------------------------------' + consumedHours);
            } else {
              consumedHours = 0.00;
            }
          }
          var resData = {
            data: unionBy([doc], [{ consumedHours: consumedHours }])
          };
          res.send({ resData });
        });

      } else {
        // Handle Error
        log.error(err);
      }
    });
})

// Update by id
api.put('/futureScope/:id', function (req, res) {
  var fs = new FutureScope(req.body);
  //req.body.updated_at = new Date();
  if (req.body.projectTypeId) {
    req.body.projectType = req.body.projectTypeId;
  }
  if (req.body.statusId) {
    req.body.status = req.body.statusId;
  }
  if (req.body.managedById) {
    req.body.managedBy = req.body.managedById;
  }
  if (req.body.categoryId) {
    req.body.category = req.body.categoryId;
  }
  if (req.body.subCategoryId) {
    req.body.subCategory = req.body.subCategoryId;
  }
  FutureScope.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
    if (!err) {
      var resData = Response.data(doc._id);
      res.send(resData);
    } else {
      // Handle Error
      log.error(err);
    }
  })
});

// Delete by id
api.delete('/futureScope/:id', function (req, res) {
  FutureScope.deleteOne({ "_id": req.params.id }, function (err, doc) {
    if (!err) {
      res.status(200).send('');
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
})

module.exports = api;
