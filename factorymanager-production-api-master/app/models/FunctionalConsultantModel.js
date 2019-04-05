var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  functionalConsultant: String
  // tasks: {type: Schema.Types.ObjectId, ref:'task'}
});

var Model = mongoose.model('functionalconsultant', schema);

module.exports = Model;
