import { RepositoryInterface } from '@/common/domain/repositories/repository.interfaces'
import { ProductCategoryModel } from '../models/product-category.model'

export type CreateProductCategoryProps = {
  id?: string
  name: string
  description?: string | null
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
}

export interface ProductCategoriesRepository
  extends RepositoryInterface<ProductCategoryModel, CreateProductCategoryProps> {
  findByName(name: string): Promise<ProductCategoryModel>
  conflictingName(name: string): Promise<void>
  ensureExistsByName(name: string): Promise<void>
}