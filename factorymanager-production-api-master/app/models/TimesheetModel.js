var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  taskId: String,
  taskDetails: [ {type: mongoose.Schema.Types.ObjectId, ref:'task'} ],
  aDate: Date,
  categoryId: String,
  hours: String,
  taskOwnerId: String,
  // taskOwnerDetails: [ {type: mongoose.Schema.Types.ObjectId, ref:'user'} ],
  seconds: Number,
  totalSpend: String,
  type: {type: String, enum: ['productive','non-productive','vacation','holiday']},
  subType: {type: String, enum: ['meeting','training','time-available','co-ordination']},
  status: {type: String, enum: ['submitted','not-submitted'], default:'not-submitted'},
  overTime: String,
  created_at: Date,
  updated_at: Date

});

var Model = mongoose.model('timesheet', schema);

module.exports = Model;
