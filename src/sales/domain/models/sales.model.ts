import { randomUUID } from 'node:crypto'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

type SaleModelProps = {
  id: string
  customer_name: string
  product_id: string
  quantity: number
  total_price: number
  status: string
  created_at: Date
  updated_at: Date
}

type CreateSaleModelProps = {
  id?: string
  customer_name: string
  product_id: string
  quantity: number
  total_price: number
  status: string
  created_at?: Date
  updated_at?: Date
}

export class SaleModel {
  constructor(
    public id: string,
    public customer_name: string,
    public product_id: string,
    public quantity: number,
    public total_price: number,
    public status: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static create(props: CreateSaleModelProps): SaleModel {
    this.validateFields(props.customer_name, props.product_id, props.status)
    this.validateQuantity(props.quantity)
    this.validateTotalPrice(props.total_price)

    const now = new Date()
    return new SaleModel(
      props.id ?? randomUUID(),
      props.customer_name.trim(),
      props.product_id,
      props.quantity,
      props.total_price,
      props.status.trim(),
      props.created_at ?? now,
      props.updated_at ?? now,
    )
  }

  static reconstitute(props: SaleModelProps): SaleModel {
    return new SaleModel(
      props.id,
      props.customer_name,
      props.product_id,
      props.quantity,
      props.total_price,
      props.status,
      props.created_at,
      props.updated_at,
    )
  }

  renameCustomer(customerName: string): void {
    if (!customerName?.trim()) {
      throw new BadRequestError('Customer name is required')
    }
    this.customer_name = customerName.trim()
    this.touch()
  }

  setQuantity(quantity: number): void {
    SaleModel.validateQuantity(quantity)
    this.quantity = quantity
    this.touch()
  }

  setStatus(status: string): void {
    if (!status?.trim()) {
      throw new BadRequestError('Sale status is required')
    }
    this.status = status.trim()
    this.touch()
  }

  setTotalPrice(totalPrice: number): void {
    SaleModel.validateTotalPrice(totalPrice)
    this.total_price = totalPrice
    this.touch()
  }

  toJSON(): SaleModelProps {
    return {
      id: this.id,
      customer_name: this.customer_name,
      product_id: this.product_id,
      quantity: this.quantity,
      total_price: this.total_price,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }

  private static validateFields(customerName: string, productId: string, status: string): void {
    if (!customerName?.trim() || !productId || !status?.trim()) {
      throw new BadRequestError('Input data not provided or invalid')
    }
  }

  private static validateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestError('Sale quantity must be greater than zero')
    }
  }

  private static validateTotalPrice(totalPrice: number): void {
    if (totalPrice < 0) {
      throw new BadRequestError('Sale total price must be valid')
    }
  }

  private touch(): void {
    this.updated_at = new Date()
  }
}
