var express = require('express');
var ProjectType = require('../models/ProjectTypeModel');
var Response = require('../utils/response');
var api = express.Router();

// Create
api.post('/projectType', function (req, res) {
  req.body.created_at = new Date();
  var pt = new ProjectType(req.body);
  pt.projectType = pt.projectType.toUpperCase();
  ProjectType.find({ projectType: pt.projectType }, function (err, pt1) {
    if (pt1 && pt1.length > 0) {
      res.json(500, {
        status: 'false',
        message: 'Project already exist'
      });
    } else {
      pt.save(function (err, projectType) {
        if (!err) {
          req.body.id = projectType.id;
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
    }
  });
});

// Get all
api.get('/projectType', function (req, res) {
  ProjectType.find({}, { __v: 0 }, function (err, records) {
    if (!err) {
      var resData = Response.data(records);
      res.send(resData);
    } else {
      // Handle Error
      log.error(err);
    }
  });
});

// Get details by id
api.get('/projectType/:id', function (req, res) {
  ProjectType.findById(req.params.id, function (err, doc) {
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
api.put('/projectType/:id', function (req, res) {
  req.body.updated_at = new Date();
  ProjectType.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
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
api.delete('/projectType/:id', function (req, res) {
  ProjectType.deleteOne({ "_id": req.params.id }, function (err, doc) {
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
