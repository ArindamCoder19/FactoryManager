var express = require('express');

var Subcategory = require('../models/SubcategoryModel');
var Response = require('../utils/response');
var api = express.Router();

// Create
api.post('/subcategory', function (req, res) {
  req.body.created_at = new Date();
  var subCat = new Subcategory(req.body);
  subCat.subCategory = subCat.subCategory.toUpperCase();
  Subcategory.find({ subCategory: subCat.subCategory }, function (err, subctr) {
    if (subctr && subctr.length > 0) {
      res.json(500, {
        status: 'false',
        message: 'Sub-Category already exist'
      });
    } else {
      subCat.save(function (err, subcategory) {
        if (!err) {
          req.body.id = subcategory.id;
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
api.get('/subcategories', function (req, res) {
  Subcategory.find({}, { __v: 0 }, function (err, records) {
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
api.get('/subcategory/:id', function (req, res) {
  Subcategory.findById(req.params.id, function (err, doc) {
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
api.put('/subcategory/:id', function (req, res) {
  req.body.updated_at = new Date();
  Subcategory.findOneAndUpdate({ "_id": req.params.id }, { $set: Object.assign({}, req.body) }, { upset: true }, function (err, doc) {
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
api.delete('/subcategory/:id', function (req, res) {
  Subcategory.deleteOne({ "_id": req.params.id }, function (err, doc) {
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
