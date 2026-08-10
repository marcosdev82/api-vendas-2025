import { SalesRepository } from '@/sales/domain/repositories/sales.repository'
import { inject, injectable } from 'tsyringe'

export namespace DeleteSaleUseCase {
  export type Input = { id: string }
  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('SaleRepository')
      private saleRepository: SalesRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.saleRepository.delete(input.id)
    }
  }
}
