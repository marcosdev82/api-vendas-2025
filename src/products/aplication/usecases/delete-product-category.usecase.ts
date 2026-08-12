import { inject, injectable } from 'tsyringe'
import { ProductCategoriesRepository } from '@/products/domain/respositories/product-categories.respository'

export namespace DeleteProductCategoryUseCase {
  export type Input = {
    id: string
  }

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductCategoryRepository')
      private productCategoryRepository: ProductCategoriesRepository,
    ) {}

    async execute(input: Input): Promise<void> {
      await this.productCategoryRepository.delete(input.id)
    }
  }
}