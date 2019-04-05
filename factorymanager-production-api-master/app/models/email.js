var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    to: String,
    from: String,
    subject: String,
    text: String,
    html: String,
    status: String
});

var Model = mongoose.model('email', schema);

module.exports = Model;
