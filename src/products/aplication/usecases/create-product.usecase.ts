import { BadRequestError } from "@/common/domain/errors/bad-request-error"
import { ProductsRepository } from "@/products/domain/respositories/products.respository"
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
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.sku || !input.name || !input.description || !input.category) {
        throw new BadRequestError('Required product fields are missing')
      }

      if (input.price <= 0 || input.cost_price < 0 || input.quantity < 0) {
        throw new BadRequestError('Price, cost price and quantity must be valid')
      }

      if (input.price < input.cost_price) {
        throw new BadRequestError('Selling price cannot be lower than cost price')
      }

      await this.productsRepository.conflictingName(input.name)

      const product = this.productsRepository.create({
        ...input,
        is_active: input.is_active ?? true,
      })
      const createdProduct: ProductOutput = await this.productsRepository.insert(product)

      return createdProduct
    }
  }
}
