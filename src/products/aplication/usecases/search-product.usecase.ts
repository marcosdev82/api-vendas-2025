import {   inject, injectable } from 'tsyringe';
import { SearchInputDto } from '../dtos/serarch-input.dto';
import { ProductsRepository } from '@/products/domain/respositories/products.respository';

export namespace SerachProductUserCase {
  export type Input = SearchInputDto;

  export type output = void;

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductRepository')
      private productRepository: ProductsRepository,
    ){}

    async execute(input: Input): Promise<output> {
      const searchResult = await this.productRepository.search(input);
      return
    }


  }

}
