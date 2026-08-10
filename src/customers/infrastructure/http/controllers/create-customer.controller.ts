import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateCustomerUseCase } from '@/customers/aplication/usecases/create-customer.usecase'
import { invalidateCacheForResource } from '@/common/infrastructure/cache/cache-invalidation'

export async function createCustomerController(request: Request, response: Response) {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    document: z.string().min(1),
  })

  const { name, email, phone, document } = dataValidation(schema, request.body)
  const useCase: CreateCustomerUseCase.UseCase = container.resolve('CreateCustomerUseCase')
  const customer = await useCase.execute({ name, email, phone, document })
  await invalidateCacheForResource('customers')

  return response.status(201).json(customer)
}
