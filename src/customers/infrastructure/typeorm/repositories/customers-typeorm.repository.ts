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
  sortableFields: string[] = ['name', 'email', 'created_at']

  constructor(
    @inject('CustomersDefaultTypeormRepository')
    private customersRepository: Repository<Customer>,
  ) {}

  async findByDocument(document: string): Promise<CustomerModel | null> {
    const customer = await this.customersRepository.findOneBy({ document })
    return customer ? this.toDomain(customer) : null
  }

  async conflictingDocument(document: string): Promise<void> {
    const customer = await this.findByDocument(document)
    if (customer) throw new ConflictError('Document already used by another customer')
  }

  create(props: CreateCustomerProps): CustomerModel {
    return CustomerModel.create(props)
  }

  async insert(model: CustomerModel): Promise<CustomerModel> {
    const customer = await this.customersRepository.save(this.toPersistence(model))
    return this.toDomain(customer)
  }

  async findById(id: string): Promise<CustomerModel> {
    return this._get(id)
  }

  async update(model: CustomerModel): Promise<CustomerModel> {
    await this._get(model.id)
    const updatedCustomer = await this.customersRepository.save(this.toPersistence(model))
    return this.toDomain(updatedCustomer)
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
    const searchValue = props.filter ? `%${props.filter}%` : null

    const [customers, total] = await this.customersRepository.findAndCount({
      ...(searchValue && {
        where: [
          { name: ILike(searchValue) },
          { email: ILike(searchValue) },
        ],
      }),
      order: { [orderByField as string]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: customers.map((customer) => this.toDomain(customer)),
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
    return this.toDomain(customer)
  }

  private toDomain(customer: Customer): CustomerModel {
    return CustomerModel.reconstitute({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      document: customer.document,
      created_at: customer.created_at,
      updated_at: customer.updated_at,
    })
  }

  private toPersistence(customer: CustomerModel): Customer {
    return this.customersRepository.create(customer.toJSON())
  }
}
