var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  subCategory: String
  // tasks: {type: Schema.Types.ObjectId, ref:'task'}
});

var Model = mongoose.model('subcategory', schema);

module.exports = Model;
