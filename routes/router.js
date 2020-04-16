const { Router } = require("express");

const { getAllFilesWithExtension } = require("../controller/files.js");

const router = Router();

router.route("/").get((req, res, next) => {
  res.status(200).render("home.nj");
});

router.route(/\/(png|jpg|mp4)$/).get(getAllFilesWithExtension);

module.exports = router;
