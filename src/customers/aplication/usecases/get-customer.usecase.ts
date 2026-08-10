import { inject, injectable } from 'tsyringe'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'

export namespace GetCustomerUseCase {
  export type Input = { id: string }
  export type Output = {
    id: string
    name: string
    email: string
    phone: string
    document: string
    created_at: Date
    updated_at: Date
  }

  @injectable()
  export class UseCase {
    constructor(
      @inject('CustomerRepository')
      private customersRepository: CustomersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.customersRepository.findById(input.id)
    }
  }
}
