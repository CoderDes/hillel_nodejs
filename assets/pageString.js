const path = require("path");

const clientScript = path.join("client", "index.js");
// TODO: add list of messages
module.exports = {
  page: `
    <html>
      <head>
        <title>Homework http module</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <div id="root">
          <h1>Main page.</h1>
        </div>
        <script src="/${clientScript}"></script>
      </body>
    </html>
  `,
  clientScriptPath: clientScript
};
