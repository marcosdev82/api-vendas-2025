import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { GetProductCategoryUseCase } from '@/products/aplication/usecases/get-product-category.usecase'

export async function getProductCategoryController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(paramsSchema, request.params)

  const useCase: GetProductCategoryUseCase.UseCase = container.resolve('GetProductCategoryUseCase')
  const category = await useCase.execute({ id })

  return response.status(200).json(category)
}