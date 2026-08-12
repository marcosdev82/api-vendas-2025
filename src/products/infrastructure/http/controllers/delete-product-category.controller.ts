import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { DeleteProductCategoryUseCase } from '@/products/aplication/usecases/delete-product-category.usecase'
import { invalidateCacheForResource } from '@/common/infrastructure/cache/cache-invalidation'

export async function deleteProductCategoryController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(paramsSchema, request.params)

  const useCase: DeleteProductCategoryUseCase.UseCase = container.resolve('DeleteProductCategoryUseCase')
  await useCase.execute({ id })

  await invalidateCacheForResource('product-categories')
  await invalidateCacheForResource('products')

  return response.status(204).send()
}