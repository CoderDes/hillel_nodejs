const { join } = require("path");

const { Router } = require("express");

const { getAllFilesFromDB, getFiles } = require("../controller/files.js");
const {
  getAllMessages,
  getMessageById,
  submitNewMessage,
} = require("../controller/messages.js");
const Logger = require("../util/Logger.js");

const router = Router();
const logger = new Logger();
logger.startObserve();

router.use((req, res, next) => {
  logger.handleIncomingRequest(req);
  next();
});

router.route("/").get((req, res) => {
  res
    .status(200)
    .render("home.nj", { test: join(__dirname, "..", "views", "test.css") });
});

router.route(/\/(png|jpg|mp4)$/).get(getAllFilesFromDB);

router.route(/\.(css|js)$/).get(getFiles);

router.route("/messages").get(getAllMessages).post(submitNewMessage);
router.route("/messages/:id").post(getMessageById);

module.exports = router;
