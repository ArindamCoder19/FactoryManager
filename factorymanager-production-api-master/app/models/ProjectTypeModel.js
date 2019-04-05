var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  projectType: String
  // tasks: {type: Schema.Types.ObjectId, ref:'task'}
});

var Model = mongoose.model('projecttype', schema);

module.exports = Model;
