const express = require("express");
const nunjucks = require("nunjucks");

const router = require("./routes/router");

const app = express();
const port = process.env.PORT || "3000";

nunjucks.configure("./views", { autoescape: true, express: app });

app.use(router);

app.listen(port, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
