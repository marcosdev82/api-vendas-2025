import { SalesRepository } from '@/sales/domain/repositories/sales.repository'
import { inject, injectable } from 'tsyringe'
import { SaleOutput } from '../dtos/sale-output.dto'

export namespace UpdateSaleUseCase {
  export type Input = {
    id: string
    customer_name?: string
    quantity?: number
    status?: string
  }

  export type Output = SaleOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('SaleRepository')
      private saleRepository: SalesRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const sale = await this.saleRepository.findById(input.id)

      if (input.customer_name) {
        sale.renameCustomer(input.customer_name)
      }

      if (input.quantity !== undefined) {
        sale.setQuantity(input.quantity)
      }

      if (input.status) {
        sale.setStatus(input.status)
      }

      return this.saleRepository.update(sale)
    }
  }
}
