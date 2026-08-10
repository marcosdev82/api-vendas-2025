import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetCustomerUseCase } from '@/customers/aplication/usecases/get-customer.usecase'

export async function getCustomerController(request: Request, response: Response) {
  const useCase: GetCustomerUseCase.UseCase = container.resolve('GetCustomerUseCase')
  const customer = await useCase.execute({ id: request.params.id })
  return response.status(200).json(customer)
}
