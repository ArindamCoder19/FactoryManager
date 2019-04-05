var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  projectName: String
  // tasks: {type: Schema.Types.ObjectId, ref:'task'}
});

var Model = mongoose.model('project', schema);

module.exports = Model;
