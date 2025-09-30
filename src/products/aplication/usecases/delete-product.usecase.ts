import { ProductsRepository } from "@/products/domain/respositories/products.respository"
import { inject, injectable } from "tsyringe"

export namespace DeleteProductUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {

    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
    ) {} 

    async execute(input: Input): Promise<Output> {
      await this.productsRepository.findById(input.id);
    }
  }
}
