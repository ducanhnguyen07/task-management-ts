import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as database from './config/database';
import Task from './models/task.model';

dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

database.connect();

app.get("/tasks", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false
  });

  res.json(tasks);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

