/* eslint-disable prettier/prettier */
import express from 'express';
import cors from  'cors';
import { routes } from './routes';
import { errorHandle } from './middleware/errorHandlers';
import  sweggerJSDoc from 'swagger-jsdoc';
import  sweggerUI from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [],
}
const swaggerSpec = sweggerJSDoc(options)

const app = express();

app.use(cors());
app.use(express.json());
app.use('/docs', sweggerUI.serve, sweggerUI.setup(swaggerSpec))
app.use(routes)
app.use(errorHandle)

export { app }
