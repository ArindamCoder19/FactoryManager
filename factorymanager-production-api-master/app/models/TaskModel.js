var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  categoryId: String,
  category: [ {type: mongoose.Schema.Types.ObjectId, ref:'category'} ],
  subcategoryId: String,
  subCategory: [ {type: mongoose.Schema.Types.ObjectId, ref:'subcategory'} ],
  projectId: String,
  project: [ {type: mongoose.Schema.Types.ObjectId, ref:'futurescope'} ],
  //futureScopeId: String,
  taskDescription: String,
  developerId: String,
  assignedTo: [ {type: mongoose.Schema.Types.ObjectId, ref:'user'} ],
  leadId: String,
  lead:  [ {type: mongoose.Schema.Types.ObjectId, ref:'user'} ],
  reviewerId: String,
  reviewer:  [ {type: mongoose.Schema.Types.ObjectId, ref:'user'} ],
  functionalConsultantId: String,
  functionalConsultant:  [ {type: mongoose.Schema.Types.ObjectId, ref:'functionalconsultant'} ],
  dueDate:  Date,
  rfcNumber: {type: String, unique: true},
  snowTaskNumber:  String,
  fsiScore:  String,
  plannedStartDate: Date,
  plannedEndDate: Date,
  actualStartDate: Date,
  actualEndDate: Date,
  fsRecievedDate: Date,
  estimatedHours: Number,
  priority:  { type: String, enum: ['LOW','MEDIUM','HIGH'] },
  hoursSpend:String,
  // statusId: String,
  // status: [ {type: mongoose.Schema.Types.ObjectId, ref:'status'} ],
  status: {type: String, enum: ['DELIVERED','CANCELLED','NOT-STARTED','ESTIMATION-IN-PROGRESS','WAITING-FOR-CAB-APPROVAL','TS-IN-PROGRESS','DEV-IN-PROGRESS','DEV-ON-HOLD','TEST-ON-HOLD','FUT-IN-PROGRESS','TESTING-IN-PROGRESS','READY-TO-REVIEW']},
  wricefType: {type: String, enum: ['REPORT','ENHANCEMENT','INTERFACE','FORM','WORK-FLOW','CONVERSION','FIORI','ODATA','DELL-BOOMI']},
  complexity: {type: String, enum: ['HIGH','MEDIUM','LOW','VERY-LOW','VERY-HIGH']},
  // comment:  [ {type: mongoose.Schema.Types.ObjectId, ref:'comment'} ],
  created_at: Date,
  updated_at: Date,
  createdById: String,
  createdBy: [ {type: mongoose.Schema.Types.ObjectId, ref:'user'} ]

});

var Model = mongoose.model('task', schema);

module.exports = Model;
