import { inject, injectable } from 'tsyringe'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { ProductCategoriesRepository } from '@/products/domain/respositories/product-categories.respository'
import { ProductCategoryOutput } from '../dtos/product-category-output.dto'

export namespace CreateProductCategoryUseCase {
  export type Input = {
    name: string
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
      if (!input.name?.trim()) {
        throw new BadRequestError('Product category name is required')
      }

      await this.productCategoryRepository.conflictingName(input.name)

      const category = this.productCategoryRepository.create({
        name: input.name,
        description: input.description ?? null,
        is_active: input.is_active ?? true,
      })

      return this.productCategoryRepository.insert(category)
    }
  }
}