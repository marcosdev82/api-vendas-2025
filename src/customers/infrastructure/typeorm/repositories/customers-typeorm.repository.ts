import { SearchInput, SearchOutput } from '@/common/domain/repositories/repository.interfaces'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ConflictError } from '@/common/domain/errors/not-found-conflict-error'
import { inject, injectable } from 'tsyringe'
import { Repository, ILike } from 'typeorm'
import { Customer } from '../entities/customers.entity'
import { CreateCustomerProps, CustomersRepository } from '@/customers/domain/repositories/customers.repository'
import { CustomerModel } from '@/customers/domain/models/customers.model'

@injectable()
export class CustomersTypeormRepository implements CustomersRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(
    @inject('CustomersDefaultTypeormRepository')
    private customersRepository: Repository<Customer>,
  ) {}

  async findByDocument(document: string): Promise<CustomerModel | null> {
    return this.customersRepository.findOneBy({ document })
  }

  async conflictingDocument(document: string): Promise<void> {
    const customer = await this.findByDocument(document)
    if (customer) throw new ConflictError('Document already used by another customer')
  }

  create(props: CreateCustomerProps): CustomerModel {
    return this.customersRepository.create(props)
  }

  async insert(model: CustomerModel): Promise<CustomerModel> {
    return this.customersRepository.save(model)
  }

  async findById(id: string): Promise<CustomerModel> {
    return this._get(id)
  }

  async update(model: CustomerModel): Promise<CustomerModel> {
    await this._get(model.id)
    await this.customersRepository.update({ id: model.id }, model)
    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.customersRepository.delete({ id })
  }

  async search(props: SearchInput): Promise<SearchOutput<CustomerModel>> {
    const validSort = this.sortableFields.includes(props.sort ?? '') || false
    const dirOps = ['asc', 'desc']
    const validSortDir = (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [customers, total] = await this.customersRepository.findAndCount({
      ...(props.filter && { where: { name: ILike(props.filter) } }),
      order: { [orderByField as string]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: customers,
      per_page: props.per_page ?? 15,
      total,
      current_page: props.page ?? 1,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<CustomerModel> {
    const customer = await this.customersRepository.findOneBy({ id })
    if (!customer) throw new NotFoundError(`Customer not found using ID ${id}`)
    return customer
  }
}
