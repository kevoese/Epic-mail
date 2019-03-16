import express from 'express';
import bodyParser from 'body-parser';
import router from './Router/router';
import groupRouter from './Router/grouprouter';
import userController from './Controllers/controller';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/', router);
app.use('/api/v2/', groupRouter);
app.get('/', userController.welcome);
app.all('*', (req, res) => {
  res.status(400).json({
    error: 'route does not exist',
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is on ${port}`);
});

export default app;
