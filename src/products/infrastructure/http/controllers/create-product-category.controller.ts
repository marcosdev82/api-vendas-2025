import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateProductCategoryUseCase } from '@/products/aplication/usecases/create-product-category.usecase'
import { invalidateCacheForResource } from '@/common/infrastructure/cache/cache-invalidation'

export async function createProductCategoryController(request: Request, response: Response) {
  const createProductCategoryBodySchema = z.object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    is_active: z.boolean().optional(),
  })

  const { name, description, is_active } = dataValidation(createProductCategoryBodySchema, request.body)

  const useCase: CreateProductCategoryUseCase.UseCase = container.resolve('CreateProductCategoryUseCase')
  const category = await useCase.execute({ name, description, is_active })

  await invalidateCacheForResource('product-categories')
  await invalidateCacheForResource('products')

  return response.status(201).json(category)
}