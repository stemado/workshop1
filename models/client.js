//NOTE: Always place children schemas above the parent
//this seems to be necessary if you want embedded children to contain their own _id property

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var organizationSchema = Schema({
    org_name: { type: String, required: true, trim: true, unique: true }, //UNIQUE
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    _id: true
});

var clientSchema = Schema({
    client: { type: String, required: true, trim: true },

    organization: [organizationSchema],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Account', orgSchema);
