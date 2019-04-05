var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  managedBy: String
  // tasks: {type: Schema.Types.ObjectId, ref:'task'}
});

var Model = mongoose.model('managedby', schema);

module.exports = Model;
