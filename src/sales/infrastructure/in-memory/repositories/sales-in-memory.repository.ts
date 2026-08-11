import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { SaleModel } from '@/sales/domain/models/sales.model'
import { CreateSaleProps, SalesRepository } from '@/sales/domain/repositories/sales.repository'

export class SalesInMemoryRepository
  extends InMemoryRepository<SaleModel>
  implements SalesRepository {
  sortableFields: string[] = ['created_at', 'status']

  create(props: CreateSaleProps): SaleModel {
    return SaleModel.create(props)
  }

  async findByCustomerName(customer_name: string): Promise<SaleModel> {
    const sale = this.items.find(item => item.customer_name === customer_name)
    if (!sale) {
      throw new NotFoundError(`Sale not found using customer name ${customer_name}`)
    }
    return sale
  }

  protected async applyFilter(items: SaleModel[], filter: string | null): Promise<SaleModel[]> {
    if (!filter) return items
    return items.filter(item => item.customer_name.toLowerCase().includes(filter.toLowerCase()))
  }

  protected async applySort(items: SaleModel[], sort: string | null, sort_dir: string | null): Promise<SaleModel[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'desc')
  }
}
