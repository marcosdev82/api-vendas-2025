import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { ConflictError } from '@/common/domain/errors/not-found-conflict-error'
import { inject, injectable } from 'tsyringe'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { hashPassword } from '@/common/infrastructure/auth/password'
import { UserOutputDto, UserOutputMapper } from '@/users/aplication/dtos/user-output.dto'

export namespace CreateUserUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = UserOutputDto

  @injectable()
  export class UseCase {
    constructor(
      @inject('UserRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name || !input.email || !input.password) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      await this.usersRepository.conflictingEmail(input.email)

      const hashedPassword = await hashPassword(input.password)
      const user = this.usersRepository.create({ ...input, password: hashedPassword })
      const createdUser = await this.usersRepository.insert(user)
      return UserOutputMapper.toOutput(createdUser)
    }
  }
}
