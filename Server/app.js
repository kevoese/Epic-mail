import express from 'express';
import bodyParser from 'body-parser';
import router from './Router/router';
import groupRouter from './Router/grouprouter';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/', router);
app.use('/api/v2/', groupRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is on ${port}`);
});

export default app;
