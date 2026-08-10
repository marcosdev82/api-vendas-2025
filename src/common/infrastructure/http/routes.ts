/* eslint-disable prettier/prettier */
import { productsRouter } from '@/products/infrastructure/http/routes/products.route';
import { salesRouter } from '@/sales/infrastructure/http/routes/sales.route';
import { Router } from 'express'

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ message: "Olá dev!" });
});

routes.use('/products',  productsRouter);
routes.use('/sales', salesRouter);

export { routes };
