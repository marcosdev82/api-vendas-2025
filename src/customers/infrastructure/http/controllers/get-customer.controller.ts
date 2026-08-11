import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { GetCustomerUseCase } from '@/customers/aplication/usecases/get-customer.usecase'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function getCustomerController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(paramsSchema, request.params)
  const useCase: GetCustomerUseCase.UseCase = container.resolve('GetCustomerUseCase')
  const customer = await useCase.execute({ id })
  return response.status(200).json(customer)
}
