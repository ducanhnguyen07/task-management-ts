import express, { Express } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import * as database from './config/database';
import mainV1Routes from './api/v1/routes/index.route';

dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

database.connect();

// parse application/json
app.use(bodyParser.json());

// Route v1
mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

