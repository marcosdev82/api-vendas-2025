import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { hashPassword } from '@/common/infrastructure/auth/password'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'

export namespace ResetUserPasswordUseCase {
  export type Input = {
    id: string
    newPassword: string
  }

  @injectable()
  export class UseCase {
    constructor(
      @inject('UserRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<void> {
      if (!input.id || !input.newPassword) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      const user = await this.usersRepository.findById(input.id)
      const hashedPassword = await hashPassword(input.newPassword)

      user.changePassword(hashedPassword)
      await this.usersRepository.update(user)
    }
  }
}
