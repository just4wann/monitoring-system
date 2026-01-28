import express from 'express';
import cors from 'cors';
import http from 'http';

import SequelizeDB from './db/index.js';
import Router from './routes/index.js';

import errorMiddleware from './middleware/error.middleware.js';
import MewtocolClient from './lib/mewtocol_client/index.js';
import OvenTemperatureService from './service/oven_temperature.service.js';
import OvenTimeService from './service/oven_time.service.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { WebsocketGateway } from './lib/websocket_gateway/index.js';

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTION'],
}))
app.options(/.*/, cors())
app.use(express.json({
  limit: '300kb'
}));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const publicRouter = express.Router();
const protectedRouter = express.Router();
const sequelize = new SequelizeDB();
const router = new Router(protectedRouter, publicRouter);
export const websocketGateway = new WebsocketGateway(server);

const PLC_OVEN_MANGAN = new MewtocolClient('192.168.137.99', 32769);
const PLC_OVEN_BUBUK = new MewtocolClient('192.168.137.101', 32769);
const PLC_OVEN_BOBIN = new MewtocolClient('192.168.137.103', 32769);

const OVEN_MANGAN_SERVICE = new OvenTemperatureService(PLC_OVEN_MANGAN);
const OVEN_BUBUK_SERVICE = new OvenTemperatureService(PLC_OVEN_BUBUK);
const OVEN_BOBIN_SERVICE = new OvenTemperatureService(PLC_OVEN_BOBIN);

const OVEN_MANGAN_TIMER = new OvenTimeService('mangan');
const OVEN_BUBUK_TIMER = new OvenTimeService('bubuk');
const OVEN_BOBIN_TIMER = new OvenTimeService('bobin');

router.setupPublicRouter();
protectedRouter.use(authMiddleware);
router.setupProtectedRouter();

app.use('/api', publicRouter);
app.use('/api/protect', protectedRouter);
app.use(errorMiddleware);

server.listen(8002, () => {
  console.log('websocket start on port 8002')
})

app.listen(8001, () => {
  console.log('server start');
});

sequelize.connectDB();
sequelize.syncDB();

setInterval(async () => {
  await OVEN_MANGAN_SERVICE.setTemperature('mangan'),
  await OVEN_BUBUK_SERVICE.setTemperature('bubuk'),
  await OVEN_BOBIN_SERVICE.setTemperature('bobin'),
  await OVEN_MANGAN_TIMER.calculateOvenTimer(),
  await OVEN_BUBUK_TIMER.calculateOvenTimer(),
  await OVEN_BOBIN_TIMER.calculateOvenTimer()
}, 60000);