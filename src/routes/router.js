const { promises } = require("fs");
const { join } = require("path");

const { Router } = require("express");
const { page } = require("../pages");

const router = Router();

router.route("/").get((req, res, next) => {
  res.status(200).send(page);
});

router.route(/\/(png|jpg|mp4)$/).get(async (req, res, next) => {
  const { path } = req;
  // const files = await promises.readdir(__dirname);
  const files = await promises.readdir(join(__dirname, "public"));
  console.log("FILES", files);
  // promises
  //   .readdir(join(__dirname, "..", "public"), { withFileTypes: true })
  //   .then(dirElements => {
  //     console.log("YO");
  //     console.log(dirElements);
  //   })
  //   .catch(err => {
  //     console.log(join(__dirname, "public"));
  //     res.status(404).send(err.message);
  //   });
});

module.exports = router;
