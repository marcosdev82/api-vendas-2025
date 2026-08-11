import { SearchInput, SearchOutput } from '@/common/domain/repositories/repository.interfaces'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { SaleModel } from '@/sales/domain/models/sales.model'
import { CreateSaleProps, SalesRepository } from '@/sales/domain/repositories/sales.repository'
import { Sale } from '../entities/sales.entity'
import { ILike, Repository } from 'typeorm'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SalesTypeormRepository implements SalesRepository {
  sortableFields: string[] = ['created_at', 'status']

  constructor(
    @inject('SalesDefaultTypeormRepository')
    private salesRepository: Repository<Sale>,
  ) {}

  async findByCustomerName(customer_name: string): Promise<SaleModel> {
    const sale = await this.salesRepository.findOneBy({ customer_name })
    if (!sale) {
      throw new NotFoundError(`Sale not found using customer name ${customer_name}`)
    }
    return this.toDomain(sale)
  }

  create(props: CreateSaleProps): SaleModel {
    return SaleModel.create(props)
  }

  async insert(model: SaleModel): Promise<SaleModel> {
    const sale = await this.salesRepository.save(this.toPersistence(model))
    return this.toDomain(sale)
  }

  async findById(id: string): Promise<SaleModel | null> {
    return this._get(id)
  }

  async update(model: SaleModel): Promise<SaleModel> {
    await this._get(model.id)
    const updatedSale = await this.salesRepository.save(this.toPersistence(model))
    return this.toDomain(updatedSale)
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.salesRepository.delete({ id })
  }

  async search(props: SearchInput): Promise<SearchOutput<SaleModel>> {
    const validSort = this.sortableFields.includes(props.sort ?? '') || false
    const dirOps = ['asc', 'desc']
    const validSortDir = (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'
    const searchValue = props.filter ? `%${props.filter}%` : null

    const [sales, total] = await this.salesRepository.findAndCount({
      ...(searchValue && { where: { customer_name: ILike(searchValue) } }),
      order: { [orderByField as string]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: sales.map((sale) => this.toDomain(sale)),
      per_page: props.per_page ?? 15,
      total,
      current_page: props.page ?? 1,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<SaleModel> {
    const sale = await this.salesRepository.findOneBy({ id })
    if (!sale) {
      throw new NotFoundError(`Sale not found using ID ${id}`)
    }
    return this.toDomain(sale)
  }

  private toDomain(sale: Sale): SaleModel {
    return SaleModel.reconstitute({
      id: sale.id,
      customer_name: sale.customer_name,
      product_id: sale.product_id,
      quantity: sale.quantity,
      total_price: sale.total_price,
      status: sale.status,
      created_at: sale.created_at,
      updated_at: sale.updated_at,
    })
  }

  private toPersistence(sale: SaleModel): Sale {
    return this.salesRepository.create(sale.toJSON())
  }
}
