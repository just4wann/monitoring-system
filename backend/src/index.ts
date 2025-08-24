import express from 'express';
import cors from 'cors';
import SequelizeDB from './db/index.js';
import Router from './routes/index.js';

import errorMiddleware from './middleware/error.middleware.js';
import MewtocolClient from './lib/index.js';
import OvenTemperatureService from './service/oven_temperature.service.js';

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}))

const sequelize = new SequelizeDB();
const router = new Router(app);

// const PLC_OVEN_MANGAN = new MewtocolClient('ip', 0);
// const PLC_OVEN_BOBIN = new MewtocolClient('ip', 0);
// const PLC_OVEN_BUBUK = new MewtocolClient('ip', 0);

router.setupRouter();
app.use(errorMiddleware);

app.listen(8001, 'localhost', () => {
  console.log('server start');
});

sequelize.connectDB();
sequelize.syncDB();

// setInterval(async () => {
//   await Promise.allSettled([
//     OvenTemperatureService.add(PLC_OVEN_MANGAN, 'mangan'),
//     OvenTemperatureService.add(PLC_OVEN_BOBIN, 'bobin'),
//     OvenTemperatureService.add(PLC_OVEN_BUBUK, 'bubuk')
//   ])
// }, 60000);
