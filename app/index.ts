import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';

const app = express();

config();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3030;

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`[🧪]: Server is running at port: ${port}`);
});
