var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  comment: String,
  // ownerId: String,
  createdBy: [ {type: mongoose.Schema.Types.ObjectId, ref:'user'} ],
  taskId: String,
  futureScopeId: String,
  created_at: Date,
  updated_at: Date
});

var Model = mongoose.model('comment', schema);

module.exports = Model;
