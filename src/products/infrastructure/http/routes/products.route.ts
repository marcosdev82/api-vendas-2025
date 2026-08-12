import { Router } from 'express'
import { createProductController } from '../controllers/create-product.controller'
import { getProductController } from '../controllers/get-product.controller'
import { updateProductController } from '../controllers/update-product.controller'
import { deleteProductController } from '../controllers/delete-product.controller'
import { listProductController } from '../controllers/list-product.controller'
import { cacheMiddleware } from '@/common/infrastructure/cache/cache-middleware'
import { uploadProductImageController } from '../controllers/upload-product-image.controller'
import { uploadProductImageMiddleware } from '../middleware/upload-product-image.middleware'

const productsRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - sku
 *         - name
 *         - description
 *         - price
 *         - cost_price
 *         - quantity
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the product
 *         sku:
 *           type: string
 *           description: The unique SKU of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The product description shown in the catalog
 *         price:
 *           type: number
 *           description: The selling price of the product
 *         cost_price:
 *           type: number
 *           description: The cost price used by the business
 *         quantity:
 *           type: number
 *           description: The available stock quantity
 *         category:
 *           type: string
 *           description: The product category
 *         is_active:
 *           type: boolean
 *           description: Whether the product is visible in the catalog
 *         image_url:
 *           type: string
 *           description: URL for the product image
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the product was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the product was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         sku: SKU-1001
 *         name: Smart Headphones
 *         description: Noise-cancelling wireless headphones
 *         price: 299.99
 *         cost_price: 180.5
 *         quantity: 120
 *         category: Electronics
 *         is_active: true
 *         image_url: https://example.com/images/headphones.png
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 *     ProductImageUpload:
 *       type: object
 *       required:
 *         - image
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input data not provided or invalid
 *       409:
 *         description: Name already used on another product
 */

productsRouter.post('/', createProductController)

/**
 * @swagger
 * /products/{id}/image:
 *   post:
 *     summary: Upload product image
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductImageUpload'
 *     responses:
 *       200:
 *         description: Product image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid file
 *       404:
 *         description: Product not found
 */
productsRouter.post('/:id/image', uploadProductImageMiddleware.single('image'), uploadProductImageController)

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products
 *     tags: [Products]
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
 *         description: Search by name, sku or category
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, created_at]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Paginated products list
 */
productsRouter.get('/', cacheMiddleware(120), listProductController)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
productsRouter.get('/:id', cacheMiddleware(120), getProductController)

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input data not provided or invalid
 *       404:
 *         description: The product was not found
 *       409:
 *         description: Name already used on another product
 */
productsRouter.put('/:id', updateProductController)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       204:
 *         description: The product was successfully deleted
 *       404:
 *         description: The product was not found
 */
productsRouter.delete('/:id', deleteProductController)

export { productsRouter }
