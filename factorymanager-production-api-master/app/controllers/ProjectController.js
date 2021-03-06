var express = require('express');

var Project = require('../models/ProjectModel');
var Response = require('../utils/response');
var api = express.Router();

// Create
api.post('/project', function (req, res) {
  req.body.created_at = new Date();
  var project = new Project(req.body);
  project.projectName = project.projectName.toUpperCase();
  Project.find({ projectName: project.projectName }, function (err, proj) {
    if (proj && proj.length > 0) {
      res.json(500, {
        status: 'false',
        message: 'Project already exist'
      });
    } else {
      project.save(function (err, project) {
        if (!err) {
          req.body.id = project.id;
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
api.get('/projects', function (req, res) {
  Project.find({}, { __v: 0 }, function (err, records) {
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
api.get('/project/:id', function (req, res) {
  Project.findById(req.params.id, function (err, doc) {
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
api.put('/project/:id', function (req, res) {
  req.body.updated_at = new Date();
  Project.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
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
api.delete('/project/:id', function (req, res) {
  Project.deleteOne({ "_id": req.params.id }, function (err, doc) {
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
