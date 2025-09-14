import express from 'express';
import cors from 'cors';

import SequelizeDB from './db/index.js';
import Router from './routes/index.js';

import errorMiddleware from './middleware/error.middleware.js';
import MewtocolClient from './lib/index.js';
import OvenTemperatureService from './service/oven_temperature.service.js';
import SSEService from './service/sse.service.js';

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

const PLC_OVEN_MANGAN = new MewtocolClient('192.168.137.99', 32769);
const PLC_OVEN_BUBUK = new MewtocolClient('192.168.137.101', 32769);
const PLC_OVEN_BOBIN = new MewtocolClient('192.168.137.103', 32769);

const OVEN_MANGAN_SERVICE = new OvenTemperatureService(PLC_OVEN_MANGAN);
const OVEN_BUBUK_SERVICE = new OvenTemperatureService(PLC_OVEN_BUBUK);
const OVEN_BOBIN_SERVICE = new OvenTemperatureService(PLC_OVEN_BOBIN);

const SSE_PLC_1 = new SSEService(PLC_OVEN_MANGAN);
const SSE_PLC_2 = new SSEService(PLC_OVEN_BUBUK);
const SSE_PLC_3 = new SSEService(PLC_OVEN_BOBIN);

app.get('/status', (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // SSE_PLC_1.emitStatus(res);
  // SSE_PLC_2.emitStatus(res);
  // SSE_PLC_3.emitStatus(res);

});

router.setupRouter();
app.use(errorMiddleware);

app.listen(8001, 'localhost', () => {
  console.log('server start');
});

sequelize.connectDB();
sequelize.syncDB();

setInterval(async () => {
  try {
    await Promise.allSettled([
      OVEN_MANGAN_SERVICE.setTemperature('mangan'),
      OVEN_BUBUK_SERVICE.setTemperature('bubuk'),
      OVEN_BOBIN_SERVICE.setTemperature('bobin')
    ])
  } catch (error) {
    console.error('Error Index', error)
  }
}, 60000);