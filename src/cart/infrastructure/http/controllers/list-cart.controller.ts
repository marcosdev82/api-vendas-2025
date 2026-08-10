import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListCartUseCase } from '@/cart/aplication/usecases/list-cart.usecase'

export async function listCartController(request: Request, response: Response) {
  const useCase: ListCartUseCase.UseCase = container.resolve('ListCartUseCase')
  const cart = await useCase.execute(request.query as any)
  return response.status(200).json(cart)
}
