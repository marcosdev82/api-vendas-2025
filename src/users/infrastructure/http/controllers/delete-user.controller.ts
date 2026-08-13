import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { DeleteUserUseCase } from '@/users/aplication/usecases/delete-user.usecase'

export async function deleteUserController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(paramsSchema, request.params)

  const useCase: DeleteUserUseCase.UseCase = container.resolve('DeleteUserUseCase')
  await useCase.execute({ id })

  return response.status(204).send()
}
