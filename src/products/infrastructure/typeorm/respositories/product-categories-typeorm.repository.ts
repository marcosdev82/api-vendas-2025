import { ConflictError } from '@/common/domain/errors/not-found-conflict-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { SearchInput, SearchOutput } from '@/common/domain/repositories/repository.interfaces'
import { ProductCategoryModel } from '@/products/domain/models/product-category.model'
import {
  CreateProductCategoryProps,
  ProductCategoriesRepository,
} from '@/products/domain/respositories/product-categories.respository'
import { ProductCategory } from '../entities/product-categories.entity'
import { ILike, Repository } from 'typeorm'
import { inject, injectable } from 'tsyringe'

@injectable()
export class ProductCategoriesTypeormRepository implements ProductCategoriesRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(
    @inject('ProductCategoriesDefaultTypeormRepository')
    private productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  async findByName(name: string): Promise<ProductCategoryModel> {
    const category = await this.productCategoriesRepository.findOne({
      where: { name: ILike(name.trim()) },
    })

    if (!category) {
      throw new NotFoundError(`Product category not found using name ${name}`)
    }

    return this.toDomain(category)
  }

  async conflictingName(name: string): Promise<void> {
    const category = await this.productCategoriesRepository.findOne({
      where: { name: ILike(name.trim()) },
    })

    if (category) {
      throw new ConflictError('Name already used by another category')
    }
  }

  async ensureExistsByName(name: string): Promise<void> {
    await this.findByName(name)
  }

  create(props: CreateProductCategoryProps): ProductCategoryModel {
    return ProductCategoryModel.create(props)
  }

  async insert(model: ProductCategoryModel): Promise<ProductCategoryModel> {
    const category = await this.productCategoriesRepository.save(this.toPersistence(model))
    return this.toDomain(category)
  }

  async findById(id: string): Promise<ProductCategoryModel> {
    return this._get(id)
  }

  async update(model: ProductCategoryModel): Promise<ProductCategoryModel> {
    await this._get(model.id)
    const category = await this.productCategoriesRepository.save(this.toPersistence(model))
    return this.toDomain(category)
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.productCategoriesRepository.delete({ id })
  }

  async search(props: SearchInput): Promise<SearchOutput<ProductCategoryModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir = (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [categories, total] = await this.productCategoriesRepository.findAndCount({
      ...(props.filter && { where: [{ name: ILike(`%${props.filter}%`) }] }),
      order: { [orderByField]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: categories.map((category) => this.toDomain(category)),
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  private async _get(id: string): Promise<ProductCategoryModel> {
    const category = await this.productCategoriesRepository.findOneBy({ id })

    if (!category) {
      throw new NotFoundError(`Product category not found using ID ${id}`)
    }

    return this.toDomain(category)
  }

  private toDomain(category: ProductCategory): ProductCategoryModel {
    return ProductCategoryModel.reconstitute({
      id: category.id,
      name: category.name,
      description: category.description ?? null,
      is_active: category.is_active,
      created_at: category.created_at,
      updated_at: category.updated_at,
    })
  }

  private toPersistence(category: ProductCategoryModel): ProductCategory {
    return this.productCategoriesRepository.create(category.toJSON())
  }
}