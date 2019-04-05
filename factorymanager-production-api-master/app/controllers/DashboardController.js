var express = require('express');
var cors = require('cors');
var User = require('../models/UserModel');
var Task = require('../models/TaskModel');
var Response = require('../utils/response');
var api = express.Router();

api.get('/dashboard', function (req, res) {
  var token = req.decoded;
  var filter = { status: 'admin-approval-pending' };
  var filter2 = {};
  if (token.role.indexOf('DEVELOPER') > -1) {
    filter2 = {
      $and: [
        { $or: [{ developerId: token.userId }] },
        { $or: [{ 'status': { $nin: ["CANCELLED", "DELIVERED"] } }] }
      ]
    }
  } else if (token.role.indexOf('LEAD') > -1) {
    filter2 = {
      $and: [
        { $or: [{ leadId: token.userId }] },
        { $or: [{ 'status': { $nin: ["CANCELLED", "DELIVERED"] } }] }
      ]
    }
  } else {
    filter2 = { $or: [{ 'status': { $nin: ["CANCELLED", "DELIVERED"] } }] };
  }
  User.count(filter, function (err, c) {
    Task.count(filter2, function (err, t) {
      res.send({ c, t });
    });
    // console.log('count = '+  c);

  });
});

module.exports = api;
