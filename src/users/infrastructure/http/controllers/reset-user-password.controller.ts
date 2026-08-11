import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { ResetUserPasswordUseCase } from '@/users/aplication/usecases/reset-user-password.usecase'

export async function resetUserPasswordController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    newPassword: z.string().min(8).max(128),
  })

  const { id } = dataValidation(paramsSchema, request.params)
  const { newPassword } = dataValidation(bodySchema, request.body)

  const useCase: ResetUserPasswordUseCase.UseCase = container.resolve('ResetUserPasswordUseCase')
  await useCase.execute({ id, newPassword })

  return response.status(204).send()
}
