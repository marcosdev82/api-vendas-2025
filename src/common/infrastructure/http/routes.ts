/* eslint-disable prettier/prettier */
import { productsRouter } from '@/products/infrastructure/http/routes/products.route';
import { Router } from 'express'

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ message: "Olá dev!" });
});

routes.use('/products',  productsRouter);

export { routes };
