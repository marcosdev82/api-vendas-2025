/* eslint-disable prettier/prettier */
import { productsRouter } from '@/products/infrastructure/http/routes/products.route';
import { salesRouter } from '@/sales/infrastructure/http/routes/sales.route';
import { usersRouter } from '@/users/infrastructure/http/routes/users.route';
import { customersRouter } from '@/customers/infrastructure/http/routes/customers.route';
import { cartRouter } from '@/cart/infrastructure/http/routes/cart.route';
import { Router } from 'express'

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ message: "Olá dev!" });
});

routes.use('/products',  productsRouter);
routes.use('/sales', salesRouter);
routes.use('/users', usersRouter);
routes.use('/customers', customersRouter);
routes.use('/cart', cartRouter);

export { routes };
