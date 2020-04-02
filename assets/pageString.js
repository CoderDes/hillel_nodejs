const path = require("path");

const clientScript = path.join("client", "index.js");

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
          <ul class="messages"></ul>
          <form>
            <label for="name">Your name: </label>
            <br />
            <input type="text" id="name" />
            <br />
            <textarea class="comment-field"></textarea>
            <br />
            <button class="submit">
              Post
            </button>
          </form>
        </div>
        <script src="/${clientScript}"></script>
      </body>
    </html>
  `,
  notFound: `
  <html>
    <head>
      <title>Homework http module</title>
      <meta charset="utf-8" />
    </head>
    <body>
      <h1>Page not found. Sorry. Possibly, invalid URL.</h1>
    </body>
  </html>
  `
};
