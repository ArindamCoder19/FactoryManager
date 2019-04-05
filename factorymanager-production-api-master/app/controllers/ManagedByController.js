var express = require('express');
var ManagedBy = require('../models/ManagedByModel');
var Response = require('../utils/response');
var api = express.Router();

// Create
api.post('/managedBy', function (req, res) {
  req.body.created_at = new Date();
  var mb = new ManagedBy(req.body);
  mb.managedBy = mb.managedBy.toUpperCase();
  ManagedBy.find({ managedBy: mb.managedBy }, function (err, mb1) {
    console.log('mb1------------------' + mb1);
    if (mb1 && mb1.length > 0) {
      res.json(500, {
        status: 'false',
        message: 'Client already exist'
      });
    } else {
      mb.save(function (err, managedBy) {
        if (!err) {
          req.body.id = managedBy.id;
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
api.get('/managedBy', function (req, res) {
  ManagedBy.find({}, { __v: 0 }, function (err, records) {
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
api.get('/managedBy/:id', function (req, res) {
  ManagedBy.findById(req.params.id, function (err, doc) {
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
api.put('/managedBy/:id', function (req, res) {
  req.body.updated_at = new Date();
  ManagedBy.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
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
api.delete('/managedBy/:id', function (req, res) {
  ManagedBy.deleteOne({ "_id": req.params.id }, function (err, doc) {
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
