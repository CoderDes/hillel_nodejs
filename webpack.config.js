const path = require("path");

module.exports = {
  target: "node",
  mode: "development",
  entry: path.join(__dirname, "src", "app.ts"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [{ test: /\.ts$/, use: [{ loader: "ts-loader" }] }],
  },
};
