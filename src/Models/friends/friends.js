const mongoose = require("mongoose");

const FriendsSchema = new mongoose.Schema(
    {
        accountId: { type: String, required: true, unique: true },
        friends: [
            {
                friendId: { type: String, required: true },
                status: { type: String, enum: ['active', 'pending', 'blocked'], default: 'pending' },
                addedAt: { type: Date, default: Date.now },
                lastInteraction: { type: Date, default: Date.now }
            }
        ]
    },
    { collection: "friends" }
);

const Friends = mongoose.model('Friends', FriendsSchema);

module.exports = Friends;
