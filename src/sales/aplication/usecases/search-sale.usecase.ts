import { inject, injectable } from 'tsyringe'
import { SearchInputDto } from '@/products/aplication/dtos/serarch-input.dto'
import { PaginationOutputDto, PaginationOutputMapper } from '@/products/aplication/dtos/pagination-output.dto'
import { SaleModel } from '@/sales/domain/models/sales.model'
import { SalesRepository } from '@/sales/domain/repositories/sales.repository'

export namespace SearchSaleUseCase {
  export type Input = SearchInputDto
  export type output = PaginationOutputDto<SaleModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('SaleRepository')
      private saleRepository: SalesRepository,
    ) {}

    async execute(input: Input): Promise<output> {
      const searchInput = {
        page: input.page ?? 1,
        per_page: input.per_page ?? 15,
        sort: input.sort ?? null,
        sort_dir: input.sort_dir ?? null,
        filter: input.filter ?? null,
      }
      const searchResult = await this.saleRepository.search(searchInput)
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
