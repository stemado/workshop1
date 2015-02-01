//NOTE: Always place children schemas above the parent
//this seems to be necessary if you want embedded children to contain their own _id property

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var peopleSchema = Schema({
    ee_dob: { type: String, required: true, trim: true },
    ee_zip: { type: String, required: true, trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    _id: true
});


module.exports = mongoose.model('Account', peopleSchema);
