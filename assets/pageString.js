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
        <template id="template">
          <li class="message">
            <time class="message__time"></time>
            <p class="message__author"></p>
            <p class="message__text"></p>
          </li>
        </template>
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
              Send
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
