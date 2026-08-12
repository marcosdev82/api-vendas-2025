import { randomUUID } from 'node:crypto'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

type ProductCategoryModelProps = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

type CreateProductCategoryModelProps = {
  id?: string
  name: string
  description?: string | null
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
}

export class ProductCategoryModel {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public is_active: boolean,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static create(props: CreateProductCategoryModelProps): ProductCategoryModel {
    this.validateName(props.name)

    const now = new Date()

    return new ProductCategoryModel(
      props.id ?? randomUUID(),
      props.name.trim(),
      props.description?.trim() ?? null,
      props.is_active ?? true,
      props.created_at ?? now,
      props.updated_at ?? now,
    )
  }

  static reconstitute(props: ProductCategoryModelProps): ProductCategoryModel {
    return new ProductCategoryModel(
      props.id,
      props.name,
      props.description,
      props.is_active,
      props.created_at,
      props.updated_at,
    )
  }

  rename(name: string): void {
    ProductCategoryModel.validateName(name)
    this.name = name.trim()
    this.touch()
  }

  changeDescription(description?: string | null): void {
    this.description = description?.trim() ?? null
    this.touch()
  }

  setActive(isActive: boolean): void {
    this.is_active = isActive
    this.touch()
  }

  toJSON(): ProductCategoryModelProps {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }

  private static validateName(name: string): void {
    if (!name?.trim()) {
      throw new BadRequestError('Product category name is required')
    }
  }

  private touch(): void {
    this.updated_at = new Date()
  }
}