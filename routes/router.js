const { promises } = require("fs");
const { join } = require("path");

const { Router } = require("express");

const router = Router();

router.route("/").get((req, res, next) => {
  res.status(200).render("home.nj");
});

router.route(/\/(png|jpg|mp4)$/).get(async (req, res, next) => {
  const { path } = req;

  const files = await promises.readdir(join(__dirname, "public"));
  console.log("FILES", files);
});

module.exports = router;
