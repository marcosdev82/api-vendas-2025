import { inject, injectable } from 'tsyringe'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'
import { PaginationOutputDto, PaginationOutputMapper } from '@/products/aplication/dtos/pagination-output.dto'
import { CustomerModel } from '@/customers/domain/models/customers.model'
import { SearchInputDto } from '@/products/aplication/dtos/serarch-input.dto'

export namespace ListCustomerUseCase {
  export type Input = SearchInputDto
  export type Output = PaginationOutputDto<CustomerModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('CustomerRepository')
      private customersRepository: CustomersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchInput = {
        page: input.page ?? 1,
        per_page: input.per_page ?? 15,
        sort: input.sort ?? null,
        sort_dir: input.sort_dir ?? null,
        filter: input.filter ?? null,
      }
      const result = await this.customersRepository.search(searchInput)
      return PaginationOutputMapper.toOutput(result.items, result)
    }
  }
}
