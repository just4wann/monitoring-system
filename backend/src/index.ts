import express from 'express';
import SequelizeDB from './db/index.js';
import Router from './routes/index.js';

import errorMiddleware from './middleware/error.middleware.js';

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const sequelize = new SequelizeDB();
const router = new Router(app);

router.setupRouter();
app.use(errorMiddleware);

app.listen(8001, 'localhost', () => {
  console.log('server start');
});
sequelize.connectDB();
sequelize.syncDB();
