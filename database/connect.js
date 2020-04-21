const mongoose = require("mongoose");

mongoose.set("debug", true);

mongoose.connect("mongodb://localhost:27017", {
  dbName: "express-homework",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const filesDB = mongoose.connection;

filesDB.on("error", () => {
  console.error("Connection error:");
});

filesDB.on("open", () => {
  console.log("WE ARE CONNECTED TO DB");
});

module.exports = mongoose;
