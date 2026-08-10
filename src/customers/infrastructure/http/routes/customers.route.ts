import { Router } from 'express'
import { createCustomerController } from '../controllers/create-customer.controller'
import { getCustomerController } from '../controllers/get-customer.controller'
import { listCustomerController } from '../controllers/list-customer.controller'

const customersRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - document
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         document:
 *           type: string
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
 *   name: Customers
 *   description: Customer management API
 */

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Customer created successfully
 */
customersRouter.post('/', createCustomerController)

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: List customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Customers list
 */
customersRouter.get('/', listCustomerController)

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Customer details
 */
customersRouter.get('/:id', getCustomerController)

export { customersRouter }
