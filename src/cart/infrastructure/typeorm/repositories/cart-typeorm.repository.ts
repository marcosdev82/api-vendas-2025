import { SearchInput, SearchOutput } from '@/common/domain/repositories/repository.interfaces'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { inject, injectable } from 'tsyringe'
import { Repository, ILike } from 'typeorm'
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
    return this.cartRepository.findOneBy({ user_id, product_id })
  }

  create(props: CreateCartItemProps): CartItemModel {
    return this.cartRepository.create(props)
  }

  async insert(model: CartItemModel): Promise<CartItemModel> {
    return this.cartRepository.save(model)
  }

  async findById(id: string): Promise<CartItemModel> {
    return this._get(id)
  }

  async update(model: CartItemModel): Promise<CartItemModel> {
    await this._get(model.id)
    await this.cartRepository.update({ id: model.id }, model)
    return model
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

    const [items, total] = await this.cartRepository.findAndCount({
      ...(props.filter && { where: { product_id: ILike(props.filter) } }),
      order: { [orderByField as string]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items,
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
    return item
  }
}
