const mongoose = require("mongoose");

const FriendRequestSchema = new mongoose.Schema(
    {
        senderId: { type: String, required: true },    
        recipientId: { type: String, required: true }, 
        requestDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
    },
    {
        collection: "friendrequests"
    }
);

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

module.exports = FriendRequest;
