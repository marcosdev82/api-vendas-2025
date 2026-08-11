import { SearchInput, SearchOutput } from '@/common/domain/repositories/repository.interfaces'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { inject, injectable } from 'tsyringe'
import { Repository } from 'typeorm'
import { CartItem } from '../entities/cart.entity'
import { CreateCartItemProps, CartRepository } from '@/cart/domain/repositories/cart.repository'
import { CartItemModel } from '@/cart/domain/models/cart.model'

@injectable()
export class CartTypeormRepository implements CartRepository {
  sortableFields: string[] = ['created_at']

  constructor(
    @inject('CartDefaultTypeormRepository')
    private cartRepository: Repository<CartItem>,
  ) {}

  async findByUserAndProduct(user_id: string, product_id: string): Promise<CartItemModel | null> {
    const item = await this.cartRepository.findOneBy({ user_id, product_id })
    return item ? this.toDomain(item) : null
  }

  create(props: CreateCartItemProps): CartItemModel {
    return CartItemModel.create(props)
  }

  async insert(model: CartItemModel): Promise<CartItemModel> {
    const item = await this.cartRepository.save(this.toPersistence(model))
    return this.toDomain(item)
  }

  async findById(id: string): Promise<CartItemModel> {
    return this._get(id)
  }

  async update(model: CartItemModel): Promise<CartItemModel> {
    await this._get(model.id)
    const updatedItem = await this.cartRepository.save(this.toPersistence(model))
    return this.toDomain(updatedItem)
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.cartRepository.delete({ id })
  }

  async search(props: SearchInput): Promise<SearchOutput<CartItemModel>> {
    const validSort = this.sortableFields.includes(props.sort ?? '') || false
    const dirOps = ['asc', 'desc']
    const validSortDir = (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'
    const orderByDirection = String(orderByDir).toLowerCase() === 'asc' ? 'ASC' : 'DESC'
    const searchValue = props.filter ? `%${props.filter}%` : null

    const queryBuilder = this.cartRepository.createQueryBuilder('cart_item')

    if (searchValue) {
      queryBuilder.where('CAST(cart_item.product_id AS TEXT) ILIKE :search', { search: searchValue })
    }

    const [items, total] = await queryBuilder
      .orderBy(`cart_item.${orderByField}`, orderByDirection)
      .skip((props.page - 1) * props.per_page)
      .take(props.per_page)
      .getManyAndCount()

    return {
      items: items.map((item) => this.toDomain(item)),
      per_page: props.per_page ?? 15,
      total,
      current_page: props.page ?? 1,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<CartItemModel> {
    const item = await this.cartRepository.findOneBy({ id })
    if (!item) throw new NotFoundError(`Cart item not found using ID ${id}`)
    return this.toDomain(item)
  }

  private toDomain(item: CartItem): CartItemModel {
    return CartItemModel.reconstitute({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
    })
  }

  private toPersistence(item: CartItemModel): CartItem {
    return this.cartRepository.create(item.toJSON())
  }
}
