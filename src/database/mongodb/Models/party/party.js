const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
    partyId: { type: String, required: true, unique: true },
    leaderId: { type: String, required: true, unique: true },  // unique because playter can only be in one lobby
    members: [
        {
            memberId: { type: String, required: true }, // i should make this unique too, but not rn
            readyState: { type: String, default: 'NOT_READY' },
            isLeader: { type: Boolean, default: false },
            platform: { type: String, default: "Windows" },
            joinTime: { type: Date, default: Date.now }
        }
    ],
    isJoinable: { type: Boolean, default: true },
    privacySettings: { type: String, default: 'PUBLIC' }
});

const Party = mongoose.model('Party', partySchema);

module.exports = Party;