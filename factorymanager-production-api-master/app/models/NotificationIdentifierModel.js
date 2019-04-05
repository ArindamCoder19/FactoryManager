var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationIdentifierSchema = new Schema ({
  author: String,
  uniqueId: String,
  created_at: Date,
  updated_at: Date
})

module.exports = mongoose.model('notificationIdentifier', NotificationIdentifierSchema);
