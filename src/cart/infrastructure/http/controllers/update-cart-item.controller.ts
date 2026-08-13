import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateCartItemUseCase } from '@/cart/aplication/usecases/update-cart-item.usecase'

export async function updateCartItemController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    quantity: z.number().int().positive().optional(),
  })

  const { id } = dataValidation(paramsSchema, request.params)
  const { quantity } = dataValidation(bodySchema, request.body)

  const useCase: UpdateCartItemUseCase.UseCase = container.resolve('UpdateCartItemUseCase')
  const item = await useCase.execute({ id, quantity })

  return response.status(200).json(item)
}
