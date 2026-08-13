import { Router } from 'express'
import { createCartItemController } from '../controllers/create-cart-item.controller'
import { listCartController } from '../controllers/list-cart.controller'
import { getCartItemController } from '../controllers/get-cart-item.controller'
import { updateCartItemController } from '../controllers/update-cart-item.controller'
import { deleteCartItemController } from '../controllers/delete-cart-item.controller'

const cartRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - user_id
 *         - product_id
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *         user_id:
 *           type: string
 *         product_id:
 *           type: string
 *         quantity:
 *           type: number
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management API
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       201:
 *         description: Cart item created or updated
 */
cartRouter.post('/', createCartItemController)

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: List cart items
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [created_at]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Cart items list
 */
cartRouter.get('/', listCartController)

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     summary: Get a cart item by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Cart item details
 */
cartRouter.get('/:id', getCartItemController)

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update a cart item quantity by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 */
cartRouter.put('/:id', updateCartItemController)

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove a cart item by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Cart item deleted successfully
 */
cartRouter.delete('/:id', deleteCartItemController)

export { cartRouter }
