import { Router } from 'express'
import { createSaleController } from '../controllers/create-sale.controller'
import { getSaleController } from '../controllers/get-sale.controller'
import { listSaleController } from '../controllers/list-sale.controller'
import { updateSaleController } from '../controllers/update-sale.controller'
import { deleteSaleController } from '../controllers/delete-sale.controller'

const salesRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       required:
 *         - customer_name
 *         - product_id
 *         - quantity
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the sale
 *         customer_name:
 *           type: string
 *           description: The customer name
 *         product_id:
 *           type: string
 *           description: The product id associated with the sale
 *         quantity:
 *           type: number
 *           description: The sold quantity
 *         total_price:
 *           type: number
 *           description: The total value of the sale
 *         status:
 *           type: string
 *           description: The status of the sale
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         customer_name: Jane Doe
 *         product_id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         quantity: 2
 *         total_price: 200
 *         status: PENDING
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: The sales managing API
 */

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       201:
 *         description: The sale was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Input data not provided or invalid
 */
salesRouter.post('/', createSaleController)

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: List sales with pagination and filters
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort_dir
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The list of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
salesRouter.get('/', listSaleController)

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Get a sale by ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The sale ID
 *     responses:
 *       200:
 *         description: The sale
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: The sale was not found
 */
salesRouter.get('/:id', getSaleController)

/**
 * @swagger
 * /sales/{id}:
 *   put:
 *     summary: Update a sale by ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The sale ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sale'
 *     responses:
 *       200:
 *         description: The sale was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: The sale was not found
 */
salesRouter.put('/:id', updateSaleController)

/**
 * @swagger
 * /sales/{id}:
 *   delete:
 *     summary: Delete a sale by ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The sale ID
 *     responses:
 *       204:
 *         description: The sale was successfully deleted
 *       404:
 *         description: The sale was not found
 */
salesRouter.delete('/:id', deleteSaleController)

export { salesRouter }
