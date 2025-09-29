import { ProductsRepository } from "@/products/domain/respositories/products.respository"
import { inject, injectable } from "tsyringe"
import { ProductOutput } from "../dtos/product-output.dto"

export namespace UpdateProductUseCase {
  export type Input = {
    id: string
    name?: string
    price?: number
    quantity?: number
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

      if (input.name){
        product.name = input.name
      }

      if (input.price){
        product.price = input.price
      }
      
      if (input.quantity){
        product.quantity = input.quantity
      }

      const updatedProduct: ProductOutput = await this.productsRepository.update(product);

      return updatedProduct
    }
  }
}
