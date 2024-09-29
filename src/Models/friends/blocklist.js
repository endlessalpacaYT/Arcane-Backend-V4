const mongoose = require("mongoose");

const BlockListSchema = new mongoose.Schema(
    {
        accountId: { type: String, required: true },
        blocklist: [
            {
                accountId: { type: String, required: true }
            }
        ]
    },
    {
        collection: "BlockList"
    }
);

const FriendRequest = mongoose.model('BlockList', BlockListSchema);

module.exports = FriendRequest;