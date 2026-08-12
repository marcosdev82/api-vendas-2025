import { inject, injectable } from 'tsyringe'
import { ProductCategoriesRepository } from '@/products/domain/respositories/product-categories.respository'
import { ProductCategoryOutput } from '../dtos/product-category-output.dto'

export namespace UpdateProductCategoryUseCase {
  export type Input = {
    id: string
    name?: string
    description?: string | null
    is_active?: boolean
  }

  export type Output = ProductCategoryOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductCategoryRepository')
      private productCategoryRepository: ProductCategoriesRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const category = await this.productCategoryRepository.findById(input.id)

      if (input.name) {
        if (category.name.toLowerCase() !== input.name.trim().toLowerCase()) {
          await this.productCategoryRepository.conflictingName(input.name)
        }

        category.rename(input.name)
      }

      if (input.description !== undefined) {
        category.changeDescription(input.description)
      }

      if (input.is_active !== undefined) {
        category.setActive(input.is_active)
      }

      return this.productCategoryRepository.update(category)
    }
  }
}