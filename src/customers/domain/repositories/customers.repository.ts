import { RepositoryInterface, SearchInput, SearchOutput } from '@/common/domain/repositories/repository.interfaces'
import { CustomerModel } from '../models/customers.model'

export type CreateCustomerProps = {
  id?: string
  name: string
  email: string
  phone: string
  document: string
  created_at?: Date
  updated_at?: Date
}

export interface CustomersRepository extends RepositoryInterface<CustomerModel, CreateCustomerProps> {
  findByDocument(document: string): Promise<CustomerModel | null>
  conflictingDocument(document: string): Promise<void>
}
