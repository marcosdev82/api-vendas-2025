import {   inject, injectable } from 'tsyringe';
import { SearchInputDto } from '../dtos/serarch-input.dto';
import { ProductsRepository } from '@/products/domain/respositories/products.respository';
import { PaginationOutputDto, PaginationOutputMapper } from '../dtos/pagination-output.dto';
import { ProductModel } from '@/products/domain/models/products.model';
import { SearchInput } from '@/common/domain/repositories/repository.interfaces';

export namespace SearchProductUseCase {
  export type Input = SearchInputDto;

  export type output = PaginationOutputDto<ProductModel>;

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductRepository')
      private productRepository: ProductsRepository,
    ){}

    async execute(input: Input): Promise<output> {
      const searchInput: SearchInput = {
        page: input.page ?? 1,
        per_page: input.per_page ?? 15,
        sort: input.sort ?? null,
        sort_dir: input.sort_dir ?? null,
        filter: input.filter ?? null,
      }
      const searchResult = await this.productRepository.search(searchInput);
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }


  }

}
