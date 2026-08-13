import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { DeleteCartItemUseCase } from '@/cart/aplication/usecases/delete-cart-item.usecase'

export async function deleteCartItemController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(paramsSchema, request.params)

  const useCase: DeleteCartItemUseCase.UseCase = container.resolve('DeleteCartItemUseCase')
  await useCase.execute({ id })

  return response.status(204).send()
}
