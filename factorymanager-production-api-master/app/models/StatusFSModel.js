var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  status: String
  // tasks: {type: Schema.Types.ObjectId, ref:'task'}
});

var Model = mongoose.model('statusFS', schema);

module.exports = Model;
