import { inject, injectable } from 'tsyringe'
import { CustomersRepository } from '@/customers/domain/repositories/customers.repository'
import { CustomerOutput } from '@/customers/aplication/dtos/customer-output.dto'

export namespace UpdateCustomerUseCase {
  export type Input = {
    id: string
    name?: string
    email?: string
    phone?: string
    document?: string
  }

  export type Output = CustomerOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('CustomerRepository')
      private customersRepository: CustomersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const customer = await this.customersRepository.findById(input.id)

      if (input.name) {
        customer.rename(input.name)
      }

      if (input.email) {
        customer.changeEmail(input.email)
      }

      if (input.phone) {
        customer.changePhone(input.phone)
      }

      if (input.document) {
        const nextDocument = input.document.trim()
        if (customer.document !== nextDocument) {
          await this.customersRepository.conflictingDocument(nextDocument)
        }
        customer.changeDocument(nextDocument)
      }

      return this.customersRepository.update(customer)
    }
  }
}
