const express = require("express");
const nunjucks = require("nunjucks");

const router = require("./routes/router");
const { loadFilesToDB } = require("./controller/files.js");

const app = express();
const port = process.env.PORT || "3000";

nunjucks.configure("./views", { autoescape: true, express: app });

app.use(router);

app.use((req, res) => {
  res.status(404).render("notFound.nj");
});

app.listen(port, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
  loadFilesToDB();
});
