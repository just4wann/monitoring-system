import express from 'express';
import SequelizeDB from './db/index.js';

import type { Response, Request } from 'express';

const app = express();
const sequelize = new SequelizeDB();

app.get('/hello', (req: Request, res: Response) => {
    res.send('hai');    
})

app.listen(8000, () => {
    console.log('server start')
})

sequelize.connectDB();
sequelize.syncDB();