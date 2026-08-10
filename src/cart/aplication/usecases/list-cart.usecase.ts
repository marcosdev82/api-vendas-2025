import { inject, injectable } from 'tsyringe'
import { CartRepository } from '@/cart/domain/repositories/cart.repository'
import { PaginationOutputDto, PaginationOutputMapper } from '@/products/aplication/dtos/pagination-output.dto'
import { CartItemModel } from '@/cart/domain/models/cart.model'
import { SearchInputDto } from '@/products/aplication/dtos/serarch-input.dto'

export namespace ListCartUseCase {
  export type Input = SearchInputDto
  export type Output = PaginationOutputDto<CartItemModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('CartRepository')
      private cartRepository: CartRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchInput = {
        page: input.page ?? 1,
        per_page: input.per_page ?? 15,
        sort: input.sort ?? null,
        sort_dir: input.sort_dir ?? null,
        filter: input.filter ?? null,
      }
      const result = await this.cartRepository.search(searchInput)
      return PaginationOutputMapper.toOutput(result.items, result)
    }
  }
}
