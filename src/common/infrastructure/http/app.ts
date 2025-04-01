/* eslint-disable prettier/prettier */
import express from 'express';
import cors from  'cors';
import { routes } from './routes';
import { errorHandle } from './middleware/errorHandlers';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes)
app.use(errorHandle)

export { app }
