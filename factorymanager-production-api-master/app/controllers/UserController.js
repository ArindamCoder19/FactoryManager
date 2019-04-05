var express = require('express');
var cors = require('cors');
var User = require('../models/UserModel');
var Response = require('../utils/response');
// var emailService = require('./emailController');
var api = express.Router();
var crypto = require('crypto');

api.options('/users', cors())
api.get('/users', cors(), function (req, res) {
  var token = req.decoded;
  // if(token.role.indexOf('ADMIN')>-1 || token.role.indexOf('MANAGER')>-1 || token.role.indexOf('LEAD')>-1 || token.role.indexOf('DEVELOPER')>-1 || token.role.indexOf('GUEST')>-1){
  var filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.userId) {
    filter._id = req.query.userId;
  }
  if (req.query.role) {
    var rol = req.query.role.split(',');
    // console.log(JSON.stringify(rol));
    var array = [];
    for (var i = 0; i < rol.length; i++) {
      var obj1 = new Object();
      obj1.role = rol[i];
      array.push(obj1);
      // console.log(JSON.stringify(array));
      filter.$or = array;
    }
  }
  if (req.query.subRole) {
    filter.subRole = req.query.subRole;
  }
  if (req.query.categoryId) {
    filter.categoryId = req.query.categoryId;
  }
  User.find(filter, { __v: 0 }).sort('firstName').populate('categoryId').then(function (records, err) {
    if (!err) {
      var resData = Response.data(records);
      res.send(resData);
    } else {
      // Handle Error
      log.error(err);
    }
  });
  // }
  // else{
  // User.findById(token.userId).sort('firstName').populate('categoryId').then(function(doc, err){
  //   if(!err){
  //     var resData = Response.data(doc);
  //     res.send(resData);
  //   }else{
  //     // Handle Error
  //     log.error(err);
  //   }
  // });
  // }
});

api.get('/search-users', function (req, res) {
  var token = req.decoded;
  var filter = {};
  var searchString = req.query.n || '';
  if (req.query.categoryId) {
    filter.categoryId = req.query.categoryId;
  }
  if (req.query.subRole) {
    filter.subRole = req.query.subRole;
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  console.log(JSON.stringify(filter));
  User.find({
    '$or': [
      { 'firstName': { '$regex': searchString, '$options': 'i' } },
      { 'lastName': { '$regex': searchString, '$options': 'i' } }]
  }).find(filter, function (err, doc) {
    if (!err) {
      var resData = Response.data(doc);
      res.send(resData);
    } else {
      // Handle Error
      log.error(err);
    }
  });
});

api.options('/user/:id', cors())
api.get('/user/:id', cors(), function (req, res) {
  var token = req.decoded;
  if (token.role.indexOf('ADMIN') > -1 || token.role.indexOf('MANAGER') > -1 || req.params.id === token.userId) {
    User.findById(req.params.id).populate('categoryId').then(function (doc, err) {
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

api.options('/user/:id', cors())
api.put('/user/:id', cors(), function (req, res) {
  req.body.updated_at = new Date();
  if (req.body.password) {
    req.body.password = crypto.createHash('md5').update(req.body.password).digest("hex");
  }
  var token = req.decoded;
  if (token.role.indexOf('ADMIN') > -1 || token.role.indexOf('DEVELOPER') > -1 || token.role.indexOf('MANAGER') > -1 || token.role.indexOf('LEAD') > -1) {
    User.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
      if (!err) {
        var resData = Response.data(doc._id);
        res.send(resData);
      } else {
        log.error(err);
      }
    });
  } else {
    res.send(401, { status: 'Unauthorized access' });
  }
});

api.options('/user/:id', cors())
api.delete('/user/:id', cors(), function (req, res) {
  User.deleteOne({ "_id": req.params.id }, function (err, doc) {
    if (!err) {
      res.status(200).send('');
    } else {
      // Handle Error
      var resError = Response.error({
        code: "500",
        status: "Internal Server Error"
      })
      log.error(err);
      res.status(500).send(resError);
    }
  })
})

module.exports = api;
