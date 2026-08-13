import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { DeleteCustomerUseCase } from '@/customers/aplication/usecases/delete-customer.usecase'
import { invalidateCacheForResource } from '@/common/infrastructure/cache/cache-invalidation'

export async function deleteCustomerController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(paramsSchema, request.params)

  const useCase: DeleteCustomerUseCase.UseCase = container.resolve('DeleteCustomerUseCase')
  await useCase.execute({ id })

  await invalidateCacheForResource('customers')

  return response.status(204).send()
}
