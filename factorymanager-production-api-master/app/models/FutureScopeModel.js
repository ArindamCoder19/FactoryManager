var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  managedById: String,
  managedBy: [ {type: mongoose.Schema.Types.ObjectId, ref:'managedby'} ],
  statusId: String ,
  status: [ {type: mongoose.Schema.Types.ObjectId, ref:'statusFS'} ],
  projectName: String,
  categoryId: String,
  category: [ {type: mongoose.Schema.Types.ObjectId, ref:'category'} ],
  subCategoryId: String,
  subCategory: [ {type: mongoose.Schema.Types.ObjectId, ref:'subcategory'} ],
  projectTypeId: String,
  projectType: [ {type: mongoose.Schema.Types.ObjectId, ref:'projecttype'} ],
  projectManager: String,
  startDate: Date,
  endDate: Date,
  fteExpected:String,
  estimatedHours: String,
  consumedHours: String,
  created_at: Date,
  updated_at: Date
});

var Model = mongoose.model('futurescope', schema);

module.exports = Model;
