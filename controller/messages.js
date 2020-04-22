const MessageModel = require("../model/Messages.js");
const { validationQuery } = require("../util/messages.js");

exports.getAllMessages = async (req, res) => {
  const {
    query: { sort = "addedAt", sortValue = "asc", limit = 10, skip = 0 },
  } = req;

  try {
    validationQuery({ sort, sortValue, limit, skip });
  } catch (err) {
    res.status(400).send(err.message);
  }

  const messages = await MessageModel.find()
    .sort({ sort: sortValue })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
  res.status(200).send(messages);
};

exports.submitNewMessage = async (req, res) => {
  const {
    body: { text, sender, addedAt },
  } = req;

  const messageDoc = await MessageModel.create({ text, sender, addedAt });

  messageDoc.save();
};

exports.updateMessageById = async (req, res) => {
  const {
    body: { _id, sender, text, addedAt },
  } = req;

  await MessageModel.updateOne(
    { _id: _id },
    { $set: { sender: sender, text: text, addedAt: addedAt } },
  );
};

exports.deleteMessageById = async (req, res) => {
  const {
    body: { _id },
  } = req;
  await MessageModel.deleteOne({ _id: _id });
};
