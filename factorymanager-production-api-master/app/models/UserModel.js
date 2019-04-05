var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true},
  password: { type: String, require: true },
  role: [{type: String, enum: ['ADMIN','MANAGER','LEAD','DEVELOPER','GUEST'], required: true}],
  categoryId: [ {type: mongoose.Schema.Types.ObjectId, ref:'category', required: true}],
  phoneNo: String,
  location: String,
  startDate:Date,
  endDate: Date,
  status:{type: String, enum:['active','inactive','admin-approval-pending','user-approval-pending'] ,default: 'user-approval-pending'},
  subRole: {type: String, enum: ['internal','external']},
  created_at: Date,
  updated_at: Date,
  apiKey: String,
  token: String
});

var Model = mongoose.model('user', schema);

module.exports = Model;
