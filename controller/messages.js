const MessageModel = require("../model/Messages.js");

exports.getAllMessages = async (req, res) => {
  const messages = await MessageModel.find().lean().exec();
  res.status(200).send(messages);
};

exports.getMessageById = async (req, res) => {
  const {
    body: { __id },
  } = req;

  const message = await MessageModel.find({ __id: __id }).lean().exec();
  console.log("TARGET MESSAGE", message);
};

exports.submitNewMessage = async (req, res) => {
  const {
    body: { text, sender, addedAt },
  } = req;

  const messageDoc = await MessageModel.create({ text, sender, addedAt });

  messageDoc.save();
};
