import {   inject, injectable } from 'tsyringe';
import { SearchInputDto } from '../dtos/serarch-input.dto';
import { ProductsRepository } from '@/products/domain/respositories/products.respository';
import { PaginationOutputDto, PaginationOutputMapper } from '../dtos/pagination-output.dto';
import { ProductModel } from '@/products/domain/models/products.model';

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
      const searchResult = await this.productRepository.search(input);
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }


  }

}
