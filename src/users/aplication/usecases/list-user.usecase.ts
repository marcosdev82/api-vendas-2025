import { inject, injectable } from 'tsyringe'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { PaginationOutputDto, PaginationOutputMapper } from '@/products/aplication/dtos/pagination-output.dto'
import { SearchInputDto } from '@/products/aplication/dtos/serarch-input.dto'
import { UserOutputDto, UserOutputMapper } from '@/users/aplication/dtos/user-output.dto'

export namespace ListUserUseCase {
  export type Input = SearchInputDto
  export type Output = PaginationOutputDto<UserOutputDto>

  @injectable()
  export class UseCase {
    constructor(
      @inject('UserRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchInput = {
        page: input.page ?? 1,
        per_page: input.per_page ?? 15,
        sort: input.sort ?? null,
        sort_dir: input.sort_dir ?? null,
        filter: input.filter ?? null,
      }
      const result = await this.usersRepository.search(searchInput)
      return PaginationOutputMapper.toOutput(UserOutputMapper.toOutputList(result.items), result)
    }
  }
}
