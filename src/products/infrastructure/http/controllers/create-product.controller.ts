import { Request, Response } from "express";
import { z } from "zod";

import { CreateProductUseCase } from "@/products/aplication/usecases/create-product.usecase";
import { container } from "tsyringe";
import { dataValidation } from "@/common/infrastructure/validation/zod";
import { invalidateCacheForResource } from '@/common/infrastructure/cache/cache-invalidation'

export async function createProductController(
  request: Request,
  response: Response,
) {
  const createProductBodySchema = z.object({
    sku: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    cost_price: z.number().min(0),
    quantity: z.number().min(0),
    category: z.string().min(1),
    is_active: z.boolean().optional(),
    image_url: z.string().url().nullable().optional(),
  })
 
  const { sku, name, description, price, cost_price, quantity, category, is_active, image_url } = dataValidation(createProductBodySchema, request.body)

  const createProductUseCase: CreateProductUseCase.UseCase = container.resolve('CreateProductUseCase')

  const product = await createProductUseCase.execute({ sku, name, description, price, cost_price, quantity, category, is_active, image_url })
  await invalidateCacheForResource('products')

  return response.status(201).json(product)
}
