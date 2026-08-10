import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetUserUseCase } from '@/users/aplication/usecases/get-user.usecase'

export async function getUserController(request: Request, response: Response) {
  const useCase: GetUserUseCase.UseCase = container.resolve('GetUserUseCase')
  const user = await useCase.execute({ id: request.params.id })
  return response.status(200).json(user)
}
