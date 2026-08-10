import { RepositoryInterface } from "@/common/domain/repositories/repository.interfaces";
import { ProductModel } from "../models/products.model";

export type ProductId = {
  id: string
}

export type CreateProductProps = {
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

export interface ProductsRepository
  extends RepositoryInterface<ProductModel, CreateProductProps> {
  findByName(name: string): Promise<ProductModel>
  findAllByIds(ids: ProductId[]): Promise<ProductModel[]>
  conflictingName(name: string): Promise<void>
}
