import { inject, injectable } from 'tsyringe'
import { ProductCategoriesRepository } from '@/products/domain/respositories/product-categories.respository'
import { ProductCategoryOutput } from '../dtos/product-category-output.dto'

export namespace GetProductCategoryUseCase {
  export type Input = {
    id: string
  }

  export type Output = ProductCategoryOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductCategoryRepository')
      private productCategoryRepository: ProductCategoriesRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.productCategoryRepository.findById(input.id)
    }
  }
}