const mongoose = require('mongoose');

const ExchangeCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    username: { type: String, required: true },
    used: { type: Boolean, default: false },
    expires_at: { type: Date, required: true }
});

const ExchangeCode = mongoose.model('ExchangeCode', ExchangeCodeSchema);
module.exports = ExchangeCode;