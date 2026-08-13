import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { GetCartItemUseCase } from '@/cart/aplication/usecases/get-cart-item.usecase'

export async function getCartItemController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(paramsSchema, request.params)
  const useCase: GetCartItemUseCase.UseCase = container.resolve('GetCartItemUseCase')
  const item = await useCase.execute({ id })

  return response.status(200).json(item)
}
