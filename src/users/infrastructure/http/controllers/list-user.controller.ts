import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListUserUseCase } from '@/users/aplication/usecases/list-user.usecase'

export async function listUserController(request: Request, response: Response) {
  const useCase: ListUserUseCase.UseCase = container.resolve('ListUserUseCase')
  const users = await useCase.execute(request.query as any)
  return response.status(200).json(users)
}
