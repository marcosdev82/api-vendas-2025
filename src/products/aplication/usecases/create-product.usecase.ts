import { BadRequestError } from "@/common/domain/errors/bad-request-error"
import { ProductsRepository } from "@/products/domain/respositories/products.respository"
import { ProductCategoriesRepository } from "@/products/domain/respositories/product-categories.respository"
import { inject, injectable } from "tsyringe"
import { ProductOutput } from "../dtos/product-output.dto"

export namespace CreateProductUseCase {
  export type Input = {
    sku: string
    name: string
    description: string
    price: number
    cost_price: number
    quantity: number
    category: string
    is_active?: boolean
    image_url?: string | null
  }

  export type Output = ProductOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
      @inject('ProductCategoryRepository')
      private productCategoriesRepository: ProductCategoriesRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.sku || !input.name || !input.description || !input.category) {
        throw new BadRequestError('Required product fields are missing')
      }

      await this.productsRepository.conflictingName(input.name)
      await this.productCategoriesRepository.ensureExistsByName(input.category)

      const product = this.productsRepository.create({
        sku: input.sku,
        name: input.name,
        description: input.description,
        price: input.price,
        cost_price: input.cost_price,
        quantity: input.quantity,
        category: input.category,
        is_active: input.is_active ?? true,
        image_url: input.image_url ?? null,
      })
      const createdProduct: ProductOutput = await this.productsRepository.insert(product)

      return createdProduct
    }
  }
}
