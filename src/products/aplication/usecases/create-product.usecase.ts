import { BadRequestError } from "@/common/domain/errors/bad-request-error"
import { ProductsRepository } from "@/products/domain/respositories/products.respository"

export namespace CreateProductUseCase {
  export type Input = {
    name: string
    price: number
    quantity: number
  }

  export type Output = {
    id: string
    name: string
    price: number
    quantity: number  
    created_at: Date
    updated_at: Date
  }

  export class UseCase {

    constructor(private productsRepository: ProductsRepository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name || input.price <= 0 || input.quantity <= 0) {
          throw new BadRequestError("Input data not provided or invalid");
      }

      await this.productsRepository.conflictingName(input.name);

      const product = this.productsRepository.create(input);
      await this.productsRepository.insert(product);

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
