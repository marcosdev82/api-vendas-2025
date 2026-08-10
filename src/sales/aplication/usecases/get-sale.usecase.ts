import { SalesRepository } from '@/sales/domain/repositories/sales.repository'
import { inject, injectable } from 'tsyringe'
import { SaleOutput } from '../dtos/sale-output.dto'

export namespace getSaleUseCase {
  export type Input = { id: string }
  export type Output = SaleOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('SaleRepository')
      private saleRepository: SalesRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.saleRepository.findById(input.id)
    }
  }
}
