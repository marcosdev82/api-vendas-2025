import { inject, injectable } from 'tsyringe'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'

export namespace DeleteCustomerUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('CustomerRepository')
      private customersRepository: CustomersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.customersRepository.delete(input.id)
    }
  }
}
