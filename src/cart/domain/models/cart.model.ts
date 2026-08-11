import { randomUUID } from 'node:crypto'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

type CartItemModelProps = {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: Date
  updated_at: Date
}

type CreateCartItemModelProps = {
  id?: string
  user_id: string
  product_id: string
  quantity: number
  created_at?: Date
  updated_at?: Date
}

export class CartItemModel {
  constructor(
    public id: string,
    public user_id: string,
    public product_id: string,
    public quantity: number,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static create(props: CreateCartItemModelProps): CartItemModel {
    if (!props.user_id || !props.product_id || props.quantity <= 0) {
      throw new BadRequestError('Input data not provided or invalid')
    }

    const now = new Date()
    return new CartItemModel(
      props.id ?? randomUUID(),
      props.user_id,
      props.product_id,
      props.quantity,
      props.created_at ?? now,
      props.updated_at ?? now,
    )
  }

  static reconstitute(props: CartItemModelProps): CartItemModel {
    return new CartItemModel(
      props.id,
      props.user_id,
      props.product_id,
      props.quantity,
      props.created_at,
      props.updated_at,
    )
  }

  increaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestError('Quantity increment must be greater than zero')
    }
    this.quantity += amount
    this.touch()
  }

  setQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestError('Quantity must be greater than zero')
    }
    this.quantity = quantity
    this.touch()
  }

  toJSON(): CartItemModelProps {
    return {
      id: this.id,
      user_id: this.user_id,
      product_id: this.product_id,
      quantity: this.quantity,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }

  private touch(): void {
    this.updated_at = new Date()
  }
}
