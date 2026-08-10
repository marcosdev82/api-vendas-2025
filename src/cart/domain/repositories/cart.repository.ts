import { RepositoryInterface } from '@/common/domain/repositories/repository.interfaces'
import { CartItemModel } from '../models/cart.model'

export type CreateCartItemProps = {
  id?: string
  user_id: string
  product_id: string
  quantity: number
  created_at?: Date
  updated_at?: Date
}

export interface CartRepository extends RepositoryInterface<CartItemModel, CreateCartItemProps> {
  findByUserAndProduct(user_id: string, product_id: string): Promise<CartItemModel | null>
}
