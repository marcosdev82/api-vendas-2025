import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateCustomerUseCase } from '@/customers/aplication/usecases/update-customer.usecase'
import { invalidateCacheForResource } from '@/common/infrastructure/cache/cache-invalidation'

export async function updateCustomerController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    document: z.string().min(1).optional(),
  })

  const { id } = dataValidation(paramsSchema, request.params)
  const { name, email, phone, document } = dataValidation(bodySchema, request.body)

  const useCase: UpdateCustomerUseCase.UseCase = container.resolve('UpdateCustomerUseCase')
  const customer = await useCase.execute({ id, name, email, phone, document })

  await invalidateCacheForResource('customers')

  return response.status(200).json(customer)
}
