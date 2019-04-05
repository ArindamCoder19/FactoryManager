var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  status: String
  // tasks: {type: Schema.Types.ObjectId, ref:'task'}
});

var Model = mongoose.model('status', schema);

module.exports = Model;
