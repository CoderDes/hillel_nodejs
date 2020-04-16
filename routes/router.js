const { Router } = require("express");

const { getAllFilesWithExtension } = require("../controller/files.js");
const Logger = require("../util/Logger.js");

const router = Router();
const logger = new Logger();
logger.startObserve();

router.use((req, res, next) => {
  logger.handleIncomingRequest(req);
  next();
});

router.route("/").get((req, res, next) => {
  res.status(200).render("home.nj");
});

router.route(/\/(png|jpg|mp4)$/).get(getAllFilesWithExtension);

module.exports = router;
