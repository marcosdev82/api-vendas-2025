import { BadRequestError } from "@/common/domain/errors/bad-request-error"
import { ProductsRepository } from "@/products/domain/respositories/products.respository"
import { inject, injectable } from "tsyringe"
import { ProductOutput } from "../dtos/product-output.dto"

export namespace getProductUseCase {
  export type Input = {
    id: string
  }

  export type Output = ProductOutput

  @injectable()
  export class UseCase {

    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
    ) {} 

    async execute(input: Input): Promise<Output> {

      const product: ProductOutput = await this.productsRepository.findById(input.id);

      return product;

    }
  }
}
