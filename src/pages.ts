import {join} from 'path';

export const page: string = `
  <html>
    <head>
      <title>Homework http module</title>
      <meta charset="utf-8" />
      <link rel="stylesheet" href="/client/style.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap" />
    </head>
    <body>
      <header>
        <h1 class="title">Simple chat</h1>
      </header>
      <main class="chat">
        <ul class="messages"></ul>
        <form class="form">
          <div class="form__wrapper">
            <label for="name" class="form__label">Your name: </label>
            <input type="text" id="name" class="form__nickname"/>
          </div>
          <textarea class="comment-field"></textarea>
          <button class="submit button">
            Post
          </button>
        </form>
      </main>
      <script src="/${join("scripts","index.js")}"></script>
    </body>
  </html>
`;
export const notFound: string =  `
  <html>
    <head>
      <title>Homework http module</title>
      <meta charset="utf-8" />
    </head>
    <body>
      <h1>Page not found. Sorry. Possibly, invalid URL.</h1>
    </body>
  </html>
`;
