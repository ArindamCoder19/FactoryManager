var express = require('express');
var Comment = require('../models/CommentModel');
var User = require('../models/UserModel');
var Response = require('../utils/response');
var api = express.Router();

// Create
api.post('/comment', function (req, res) {
  var token = req.decoded;
  req.body.created_at = new Date();
  var comment = new Comment(req.body);
  comment.createdBy = token.userId;
  // comment.createdBy = req.body.ownerId;
  comment.save(function (err, comment) {
    if (!err) {
      req.body.id = comment.id;
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
});

// Get all
api.get('/comments', function (req, res) {
  var filter = {};
  if (req.query.taskId) {
    filter.taskId = req.query.taskId;
  }
  if (req.query.futureScopeId) {
    filter.futureScopeId = req.query.futureScopeId;
  }

  Comment.find(filter, { __v: 0 })
    .populate('createdBy').then(function (err, records) {
      if (!err) {
        console.log('got data.........');
        var resData = Response.data(records);
        res.send(resData);
      } else {
        // Handle Error
        console.log('got error-----------');
        res.send(err);
      }
    });
});

// Get details by id
api.get('/comment/:id', function (req, res) {
  Comment.findById(req.params.id, function (err, doc) {
    if (!err) {
      var resData = Response.data(doc);
      res.send(resData);
    } else {
      // Handle Error
      log.error(err);
    }
  });
})

// Update by id
api.put('/comment/:id', function (req, res) {
  req.body.updated_at = new Date();
  Comment.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
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
api.delete('/comment/:id', function (req, res) {
  Comment.deleteOne({ "_id": req.params.id }, function (err, doc) {
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
