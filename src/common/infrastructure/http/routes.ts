/* eslint-disable prettier/prettier */
import { Router } from 'express'

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ message: "Olá dev!" });
});

export { routes };
