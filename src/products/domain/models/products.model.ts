import { randomUUID } from 'node:crypto'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

type ProductModelProps = {
  id: string
  sku: string
  name: string
  description: string
  price: number
  cost_price: number
  quantity: number
  category: string
  is_active: boolean
  image_url?: string | null
  created_at: Date
  updated_at: Date
}

type CreateProductModelProps = {
  id?: string
  sku: string
  name: string
  description: string
  price: number
  cost_price: number
  quantity: number
  category: string
  is_active?: boolean
  image_url?: string | null
  created_at?: Date
  updated_at?: Date
}

export class ProductModel {
  constructor(
    public id: string,
    public sku: string,
    public name: string,
    public description: string,
    public price: number,
    public cost_price: number,
    public quantity: number,
    public category: string,
    public is_active: boolean,
    public image_url: string | null,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static create(props: CreateProductModelProps): ProductModel {
    this.validateRequired(props)
    this.validatePricing(props.price, props.cost_price)
    this.validateQuantity(props.quantity)

    const now = new Date()
    return new ProductModel(
      props.id ?? randomUUID(),
      props.sku.trim(),
      props.name.trim(),
      props.description.trim(),
      props.price,
      props.cost_price,
      props.quantity,
      props.category.trim(),
      props.is_active ?? true,
      props.image_url ?? null,
      props.created_at ?? now,
      props.updated_at ?? now,
    )
  }

  static reconstitute(props: ProductModelProps): ProductModel {
    return new ProductModel(
      props.id,
      props.sku,
      props.name,
      props.description,
      props.price,
      props.cost_price,
      props.quantity,
      props.category,
      props.is_active,
      props.image_url ?? null,
      props.created_at,
      props.updated_at,
    )
  }

  rename(name: string): void {
    if (!name?.trim()) {
      throw new BadRequestError('Product name is required')
    }
    this.name = name.trim()
    this.touch()
  }

  changeSku(sku: string): void {
    if (!sku?.trim()) {
      throw new BadRequestError('Product sku is required')
    }
    this.sku = sku.trim()
    this.touch()
  }

  changeDescription(description: string): void {
    if (!description?.trim()) {
      throw new BadRequestError('Product description is required')
    }
    this.description = description.trim()
    this.touch()
  }

  changePricing(price: number, costPrice: number): void {
    ProductModel.validatePricing(price, costPrice)
    this.price = price
    this.cost_price = costPrice
    this.touch()
  }

  setQuantity(quantity: number): void {
    ProductModel.validateQuantity(quantity)
    this.quantity = quantity
    this.touch()
  }

  decreaseQuantity(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestError('Quantity decrement must be greater than zero')
    }

    const remaining = this.quantity - amount
    if (remaining < 0) {
      throw new BadRequestError('Insufficient stock for this sale')
    }

    this.quantity = remaining
    this.touch()
  }

  changeCategory(category: string): void {
    if (!category?.trim()) {
      throw new BadRequestError('Product category is required')
    }
    this.category = category.trim()
    this.touch()
  }

  setActive(isActive: boolean): void {
    this.is_active = isActive
    this.touch()
  }

  setImageUrl(imageUrl: string | null): void {
    this.image_url = imageUrl
    this.touch()
  }

  toJSON(): ProductModelProps {
    return {
      id: this.id,
      sku: this.sku,
      name: this.name,
      description: this.description,
      price: this.price,
      cost_price: this.cost_price,
      quantity: this.quantity,
      category: this.category,
      is_active: this.is_active,
      image_url: this.image_url,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }

  private static validateRequired(props: CreateProductModelProps): void {
    if (!props.sku?.trim() || !props.name?.trim() || !props.description?.trim() || !props.category?.trim()) {
      throw new BadRequestError('Required product fields are missing')
    }
  }

  private static validatePricing(price: number, costPrice: number): void {
    if (price <= 0 || costPrice < 0) {
      throw new BadRequestError('Price and cost price must be valid')
    }
    if (price < costPrice) {
      throw new BadRequestError('Selling price cannot be lower than cost price')
    }
  }

  private static validateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestError('Quantity must be greater than zero')
    }
  }

  private touch(): void {
    this.updated_at = new Date()
  }
}
