import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { ConflictError } from '@/common/domain/errors/not-found-conflict-error'
import { inject, injectable } from 'tsyringe'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'

export namespace CreateCustomerUseCase {
  export type Input = {
    name: string
    email: string
    phone: string
    document: string
  }

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
      if (!input.name || !input.email || !input.phone || !input.document) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      await this.customersRepository.conflictingDocument(input.document)

      const customer = this.customersRepository.create(input)
      return this.customersRepository.insert(customer)
    }
  }
}
