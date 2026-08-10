import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateCartItemUseCase } from '@/cart/aplication/usecases/create-cart-item.usecase'

export async function createCartItemController(request: Request, response: Response) {
  const schema = z.object({
    user_id: z.string().uuid(),
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
  })

  const { user_id, product_id, quantity } = dataValidation(schema, request.body)
  const useCase: CreateCartItemUseCase.UseCase = container.resolve('CreateCartItemUseCase')
  const item = await useCase.execute({ user_id, product_id, quantity })

  return response.status(201).json(item)
}
