import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListCartUseCase } from '@/cart/aplication/usecases/list-cart.usecase'
import { parseListQuery } from '@/common/infrastructure/http/list-query'

export async function listCartController(request: Request, response: Response) {
  const useCase: ListCartUseCase.UseCase = container.resolve('ListCartUseCase')
  const query = parseListQuery(request.query, ['created_at'])
  const cart = await useCase.execute(query)
  return response.status(200).json(cart)
}
