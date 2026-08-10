import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { ProductsRepository } from '@/products/domain/respositories/products.respository'
import { SalesRepository } from '@/sales/domain/repositories/sales.repository'
import { inject, injectable } from 'tsyringe'

export namespace CreateSaleUseCase {
  export type Input = {
    customer_name: string
    product_id: string
    quantity: number
    status: string
  }

  export type Output = {
    id: string
    customer_name: string
    product_id: string
    quantity: number
    total_price: number
    status: string
    created_at: Date
    updated_at: Date
  }

  @injectable()
  export class UseCase {
    constructor(
      @inject('ProductRepository')
      private productRepository: ProductsRepository,
      @inject('SaleRepository')
      private saleRepository: SalesRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.customer_name || !input.product_id || input.quantity <= 0) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      const product = await this.productRepository.findById(input.product_id)

      if (product.quantity < input.quantity) {
        throw new BadRequestError('Insufficient stock for this sale')
      }

      product.quantity -= input.quantity
      await this.productRepository.update(product)

      const sale = this.saleRepository.create({
        customer_name: input.customer_name,
        product_id: input.product_id,
        quantity: input.quantity,
        total_price: Number(product.price) * input.quantity,
        status: input.status,
      })

      return this.saleRepository.insert(sale)
    }
  }
}
