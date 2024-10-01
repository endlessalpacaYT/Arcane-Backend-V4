const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  notification: { type: String, required: true },  
  delivered: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;