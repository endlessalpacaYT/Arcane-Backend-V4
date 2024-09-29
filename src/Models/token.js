const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    accountId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    refreshToken: { type: String, required: true },
    refreshExpiresAt: { type: Date, required: true }
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;