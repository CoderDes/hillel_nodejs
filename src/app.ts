import express from 'express';
import router from './routes/router';

const app = express();
const port: string = process.env.PORT || '3000';

app.use(router);

app.listen(port, (): void => {
  console.log(`Server started on port: ${process.env.PORT}`)
});