import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListCustomerUseCase } from '@/customers/aplication/usecases/list-customer.usecase'
import { parseListQuery } from '@/common/infrastructure/http/list-query'

export async function listCustomerController(request: Request, response: Response) {
  const useCase: ListCustomerUseCase.UseCase = container.resolve('ListCustomerUseCase')
  const query = parseListQuery(request.query, ['name', 'email', 'created_at'])
  const customers = await useCase.execute(query)
  return response.status(200).json(customers)
}
