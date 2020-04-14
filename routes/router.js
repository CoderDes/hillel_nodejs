const { promises } = require("fs");
const { join } = require("path");

const { Router } = require("express");
const Files = require("../model/Files.js");

const router = Router();

router.route("/").get((req, res, next) => {
  res.status(200).render("home.nj");
});

router.route(/\/(png|jpg|mp4)$/).get((req, res, next) => {
  const { path } = req;
  const requiredExtension = path.slice(1);
  console.log(requiredExtension);
  // res.status(200).send(path);
});

module.exports = router;
