import { inject, injectable } from 'tsyringe'
import { UsersRepository } from '@/users/domain/repositories/users.repository'

export namespace GetUserUseCase {
  export type Input = { id: string }
  export type Output = {
    id: string
    name: string
    email: string
    password: string
    created_at: Date
    updated_at: Date
  }

  @injectable()
  export class UseCase {
    constructor(
      @inject('UserRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.usersRepository.findById(input.id)
    }
  }
}
