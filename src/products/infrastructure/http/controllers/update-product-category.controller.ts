import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateProductCategoryUseCase } from '@/products/aplication/usecases/update-product-category.usecase'
import { invalidateCacheForResource } from '@/common/infrastructure/cache/cache-invalidation'

export async function updateProductCategoryController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    is_active: z.boolean().optional(),
  })

  const { id } = dataValidation(paramsSchema, request.params)
  const { name, description, is_active } = dataValidation(bodySchema, request.body)

  const useCase: UpdateProductCategoryUseCase.UseCase = container.resolve('UpdateProductCategoryUseCase')
  const category = await useCase.execute({ id, name, description, is_active })

  await invalidateCacheForResource('product-categories')
  await invalidateCacheForResource('products')

  return response.status(200).json(category)
}