import { inject, injectable } from 'tsyringe'
import { ProductsRepository } from '@/products/domain/respositories/products.respository'
import { ProductOutput } from '../dtos/product-output.dto'
import { env } from '@/common/infrastructure/env'

export namespace UploadProductImageUseCase {
  export type Input = {
    id: string
    fileName: string
  }

  export type Output = ProductOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductRepository')
      private productsRepository: ProductsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const product = await this.productsRepository.findById(input.id)
      const imageUrl = `${env.API_URL}/uploads/products/${input.fileName}`

      product.setImageUrl(imageUrl)

      return this.productsRepository.update(product)
    }
  }
}