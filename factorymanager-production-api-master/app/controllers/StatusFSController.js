var express = require('express');

var Status = require('../models/StatusFSModel');
var Response = require('../utils/response');
var api = express.Router();

// Create
api.post('/statusFS', function (req, res) {
  req.body.created_at = new Date();
  var sfs = new Status(req.body);
  sfs.status = sfs.status.toUpperCase();
  Status.find({ status: sfs.status }, function (err, sfs1) {
    if (sfs1 && sfs1.length > 0) {
      res.json(500, {
        status: 'false',
        message: 'Status already exist'
      });
    } else {
      sfs.save(function (err, status) {
        if (!err) {
          req.body.id = status.id;
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
api.get('/statusFS', function (req, res) {
  Status.find({}, { __v: 0 }, function (err, records) {
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
api.get('/statusFS/:id', function (req, res) {
  Status.findById(req.params.id, function (err, doc) {
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
api.put('/statusFS/:id', function (req, res) {
  req.body.updated_at = new Date();
  Status.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
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
api.delete('/statusFS/:id', function (req, res) {
  Status.deleteOne({ "_id": req.params.id }, function (err, doc) {
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
