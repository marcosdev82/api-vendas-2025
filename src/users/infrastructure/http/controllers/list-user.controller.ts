import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ListUserUseCase } from '@/users/aplication/usecases/list-user.usecase'
import { parseListQuery } from '@/common/infrastructure/http/list-query'

export async function listUserController(request: Request, response: Response) {
  const useCase: ListUserUseCase.UseCase = container.resolve('ListUserUseCase')
  const query = parseListQuery(request.query, ['name', 'email', 'created_at'])
  const users = await useCase.execute(query)
  return response.status(200).json(users)
}
