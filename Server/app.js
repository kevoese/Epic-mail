import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import DBRouters from './Router/DBRouters';
import DBUserController from './Controllers/DB/DBUserController';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v2/', DBRouters);
app.get('/', DBUserController.welcome);
app.all('*', (req, res) => {
  res.status(404).send({
    error: 'Route does not exist',
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on ${port}`);
});

export default app;
