import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateUserUseCase } from '@/users/aplication/usecases/create-user.usecase'

export async function createUserController(request: Request, response: Response) {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
  })

  const { name, email, password } = dataValidation(schema, request.body)
  const useCase: CreateUserUseCase.UseCase = container.resolve('CreateUserUseCase')
  const user = await useCase.execute({ name, email, password })

  return response.status(201).json(user)
}
