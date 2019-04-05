var express = require('express');
var Category = require('../models/CategoryModel');
var Response = require('../utils/response');
var api = express.Router();

// Create
api.post('/category', function (req, res) {
  req.body.created_at = new Date();
  var cat = new Category(req.body);
  cat.category = cat.category.toUpperCase();
  Category.find({ category: cat.category }, function (err, ctr) {
    if (ctr && ctr.length > 0) {
      res.json(500, {
        status: 'false',
        message: 'Category already exist'
      });
    } else {
      cat.save(function (err, category) {
        if (!err) {
          req.body.id = category.id;
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
api.get('/categories', function (req, res) {
  Category.find({}, { __v: 0 }, function (err, records) {
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
api.get('/category/:id', function (req, res) {
  Category.findById(req.params.id, function (err, doc) {
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
api.put('/category/:id', function (req, res) {
  req.body.updated_at = new Date();
  Category.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
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
api.delete('/category/:id', function (req, res) {
  Category.deleteOne({ "_id": req.params.id }, function (err, doc) {
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
