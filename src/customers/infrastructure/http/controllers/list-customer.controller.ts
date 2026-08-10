import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListCustomerUseCase } from '@/customers/aplication/usecases/list-customer.usecase'
import { invalidateCacheForResource } from '@/common/infrastructure/cache/cache-invalidation'

export async function listCustomerController(request: Request, response: Response) {
  const useCase: ListCustomerUseCase.UseCase = container.resolve('ListCustomerUseCase')
  const customers = await useCase.execute(request.query as any)
  await invalidateCacheForResource('customers')
  return response.status(200).json(customers)
}
