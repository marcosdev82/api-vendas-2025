import { inject, injectable } from 'tsyringe'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { UserOutputDto, UserOutputMapper } from '@/users/aplication/dtos/user-output.dto'

export namespace GetUserUseCase {
  export type Input = { id: string }
  export type Output = UserOutputDto

  @injectable()
  export class UseCase {
    constructor(
      @inject('UserRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const user = await this.usersRepository.findById(input.id)
      return UserOutputMapper.toOutput(user)
    }
  }
}
