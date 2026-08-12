import { Router } from 'express'
import { cacheMiddleware } from '@/common/infrastructure/cache/cache-middleware'
import { createProductCategoryController } from '../controllers/create-product-category.controller'
import { listProductCategoryController } from '../controllers/list-product-category.controller'
import { getProductCategoryController } from '../controllers/get-product-category.controller'
import { updateProductCategoryController } from '../controllers/update-product-category.controller'
import { deleteProductCategoryController } from '../controllers/delete-product-category.controller'

const productCategoriesRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 47f1bb04-f4bf-47a0-af85-514eaf16e2f8
 *         name: Electronics
 *         description: Devices, gadgets and accessories
 *         is_active: true
 *         created_at: 2026-08-12T12:00:00Z
 *         updated_at: 2026-08-12T12:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Product Categories
 *   description: The product categories managing API
 */

/**
 * @swagger
 * /product-categories:
 *   post:
 *     summary: Create a new product category
 *     tags: [Product Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCategory'
 *     responses:
 *       201:
 *         description: Category created
 */
productCategoriesRouter.post('/', createProductCategoryController)

/**
 * @swagger
 * /product-categories:
 *   get:
 *     summary: List product categories
 *     tags: [Product Categories]
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, created_at]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Paginated categories list
 */
productCategoriesRouter.get('/', cacheMiddleware(120), listProductCategoryController)

/**
 * @swagger
 * /product-categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Product Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category found
 */
productCategoriesRouter.get('/:id', cacheMiddleware(120), getProductCategoryController)

/**
 * @swagger
 * /product-categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Product Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCategory'
 *     responses:
 *       200:
 *         description: Category updated
 */
productCategoriesRouter.put('/:id', updateProductCategoryController)

/**
 * @swagger
 * /product-categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Product Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Category deleted
 */
productCategoriesRouter.delete('/:id', deleteProductCategoryController)

export { productCategoriesRouter }