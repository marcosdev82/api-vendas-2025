import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { GetUserUseCase } from '@/users/aplication/usecases/get-user.usecase'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function getUserController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(paramsSchema, request.params)
  const useCase: GetUserUseCase.UseCase = container.resolve('GetUserUseCase')
  const user = await useCase.execute({ id })
  return response.status(200).json(user)
}
