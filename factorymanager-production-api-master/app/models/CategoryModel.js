var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  category: String
  // tasks: {type: Schema.Types.ObjectId, ref:'task'}
});

var Category = mongoose.model('category', schema);

module.exports = Category;
