const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        Create: { type: Date, required: true, default: Date.now },
        Banned: { type: Boolean, default: false },
        BannedReason: { type: String, required: true },
        BannedExpire: { type: Date, default: Date.now },
        MatchmakerBanned: { type: Boolean, default: false },
        BannedMatchmakerExpire: { type: Date, default: Date.now },
        MatchmakerID: { type: String,  required: true, unique: true },
        Discord: { type: String, required: true, unique: true },
        Account: { type: String, required: true, unique: true },
        Username: { type: String, required: true, unique: true },
        Username_Lower: { type: String, required: true, unique: true },
        Email: { type: String, required: true, unique: true },
        Password: { type: String, required: true },
        settings: {
            gameplay: { type: Object, default: {} },
            display: { type: Object, default: {} }
        }
    },
    {
        collection: "usersv2"
    }
);

UserSchema.pre('save', function(next) {
    this.Username_Lower = this.Username.toLowerCase();
    next();
});

const UserV2 = mongoose.model('UserV2', UserSchema);

UserV2.createIndexes({ Email: 1 });

module.exports = UserV2;