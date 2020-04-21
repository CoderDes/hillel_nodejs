const mongoose = require("../database/connect.js");

const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  addedAt: { type: Date, required: true },
});

const MessageModel = mongoose.model("Messages", MessageSchema, "messages");

module.exports = MessageModel;
