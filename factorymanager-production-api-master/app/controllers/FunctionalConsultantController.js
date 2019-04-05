var express = require('express');
var Functionalconsultant = require('../models/FunctionalConsultantModel');
var Response = require('../utils/response');
var api = express.Router();

// Create
api.post('/functionalconsultant', function (req, res) {
  req.body.created_at = new Date();
  var functionalconsultant = new Functionalconsultant(req.body);
  functionalconsultant.save(function (err, functionalconsultant) {
    if (!err) {
      req.body.id = functionalconsultant.id;
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
api.get('/functionalconsultants', function (req, res) {
  Functionalconsultant.find({}, { __v: 0 }, function (err, records) {
    if (!err) {
      var resData = Response.data(records);
      res.send(resData);
    } else {
      // Handle Error
      log.error(err);
    }
  });
});

api.get('/search-fc', function (req, res) {
  var token = req.decoded;
  var filter = {};
  if (req.query.name) {
    var name = req.query.name;
    filter.functionalConsultant = { "$regex": name, "$options": "i" };
  }

  // console.log(JSON.stringify(filter));
  Functionalconsultant.find(filter, function (err, doc) {
    if (!err) {
      var resData = Response.data(doc);
      res.send(resData);
    } else {
      // Handle Error
      log.error(err);
    }
  });
});

// Get details by id
api.get('/functionalconsultant/:id', function (req, res) {
  Functionalconsultant.findById(req.params.id, function (err, doc) {
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
api.put('/functionalconsultant/:id', function (req, res) {
  req.body.updated_at = new Date();
  Functionalconsultant.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
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
api.delete('/functionalconsultant/:id', function (req, res) {
  Functionalconsultant.deleteOne({ "_id": req.params.id }, function (err, doc) {
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
