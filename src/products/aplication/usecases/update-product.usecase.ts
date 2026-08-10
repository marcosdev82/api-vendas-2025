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

        product.name = input.name
      }

      if (input.sku) {
        product.sku = input.sku
      }

      if (input.description) {
        product.description = input.description
      }

      if (input.price !== undefined) {
        product.price = input.price
      }

      if (input.cost_price !== undefined) {
        product.cost_price = input.cost_price
      }

      if (input.quantity !== undefined) {
        product.quantity = input.quantity
      }

      if (input.category) {
        product.category = input.category
      }

      if (input.is_active !== undefined) {
        product.is_active = input.is_active
      }

      if (input.image_url !== undefined) {
        product.image_url = input.image_url
      }

      const updatedProduct: ProductOutput = await this.productsRepository.update(product);

      return updatedProduct
    }
  }
}
