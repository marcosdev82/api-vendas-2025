import { ProductsRepository } from "@/products/domain/respositories/products.respository"
import { inject, injectable } from "tsyringe"
import { ProductOutput } from "../dtos/product-output.dto"

export namespace UpdateProductUseCase {
  export type Input = {
    id: string
    sku?: string
    name?: string
    description?: string
    price?: number
    cost_price?: number
    quantity?: number
    category?: string
    is_active?: boolean
    image_url?: string | null
  }

  export type Output = ProductOutput

  @injectable()
  export class UseCase {

    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {

      const product = await this.productsRepository.findById(input.id);

      if (input.name) {
        if (product.name !== input.name) {
          await this.productsRepository.conflictingName(input.name)
        }

        product.rename(input.name)
      }

      if (input.sku) {
        product.changeSku(input.sku)
      }

      if (input.description) {
        product.changeDescription(input.description)
      }

      if (input.price !== undefined || input.cost_price !== undefined) {
        const nextPrice = input.price ?? product.price
        const nextCostPrice = input.cost_price ?? product.cost_price
        product.changePricing(nextPrice, nextCostPrice)
      }

      if (input.quantity !== undefined) {
        product.setQuantity(input.quantity)
      }

      if (input.category) {
        product.changeCategory(input.category)
      }

      if (input.is_active !== undefined) {
        product.setActive(input.is_active)
      }

      if (input.image_url !== undefined) {
        product.setImageUrl(input.image_url)
      }

      const updatedProduct: ProductOutput = await this.productsRepository.update(product);

      return updatedProduct
    }
  }
}
