import { RepositoryInterface, SearchInput, SearchOutput } from '@/common/domain/repositories/repository.interfaces'
import { SaleModel } from '../models/sales.model'

export type CreateSaleProps = {
  id?: string
  customer_name: string
  product_id: string
  quantity: number
  total_price: number
  status: string
  created_at?: Date
  updated_at?: Date
}

export interface SalesRepository extends RepositoryInterface<SaleModel, CreateSaleProps> {
  findByCustomerName(customer_name: string): Promise<SaleModel>
  search(props: SearchInput): Promise<SearchOutput<SaleModel>>
}
