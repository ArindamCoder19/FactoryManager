var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var notificationSchema = new Schema ({
  author: [ {type: mongoose.Schema.Types.ObjectId, ref:'user'} ],
  user: [ {type: mongoose.Schema.Types.ObjectId, ref:'user'}],
  message: String,
  dueDate: Date,
  uniqueId: String,
  status: {type: String, enum:['new','renotified','archived'] ,default: 'new'},
  created_at: Date,
  updated_at: Date
})

module.exports = mongoose.model('notification', notificationSchema);
