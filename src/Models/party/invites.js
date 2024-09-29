const mongoose = require('mongoose');

const inviteschema = new mongoose.Schema({
    partyId: { type: String, required: true },
    accountId: { type: String, required: true }, 
    invitationTime: { type: Date, required: true, default: Date.now },
    expirationTime: { type: Date, required: true }, 
}, {
    collection: "invitations"
});

inviteschema.index({ expirationTime: 1 }, { expireAfterSeconds: 0 });

const invite = mongoose.model('invite', inviteschema);

module.exports = invite;