import { inject, injectable } from 'tsyringe'
import { SearchInputDto } from '../dtos/serarch-input.dto'
import { ProductCategoriesRepository } from '@/products/domain/respositories/product-categories.respository'
import { SearchInput } from '@/common/domain/repositories/repository.interfaces'
import { PaginationOutputDto, PaginationOutputMapper } from '../dtos/pagination-output.dto'
import { ProductCategoryModel } from '@/products/domain/models/product-category.model'

export namespace SearchProductCategoryUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<ProductCategoryModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductCategoryRepository')
      private productCategoryRepository: ProductCategoriesRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchInput: SearchInput = {
        page: input.page ?? 1,
        per_page: input.per_page ?? 15,
        sort: input.sort ?? null,
        sort_dir: input.sort_dir ?? null,
        filter: input.filter ?? null,
      }

      const searchResult = await this.productCategoryRepository.search(searchInput)

      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}