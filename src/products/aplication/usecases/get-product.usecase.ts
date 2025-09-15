import { BadRequestError } from "@/common/domain/errors/bad-request-error"
import { ProductsRepository } from "@/products/domain/respositories/products.respository"
import { inject, injectable } from "tsyringe"

export namespace getProductUseCase {
  export type Input = {
    id: string
  }

  export type Output = {
    id: string
    name: string
    price: number
    quantity: number  
    created_at: Date
    updated_at: Date
  }

  @injectable()
  export class UseCase {

    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {

      const product = await this.productsRepository.findById(input.id);

      return {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          created_at: product.created_at,
          updated_at: product.updated_at
      };
    }
  }
}
