import { SearchInput, SearchOutput } from "@/common/domain/repositories/repository.interfaces";
import { ProductModel } from "@/products/domain/models/products.model";
import { CreateProductProps, ProductId, ProductsRepository } from "@/products/domain/respositories/products.respository";
import { Product } from "../entities/products.entity";
import { ILike, In, Repository } from "typeorm";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { ConflictError } from "@/common/domain/errors/not-found-conflict-error";
import { inject, injectable } from "tsyringe";

@injectable()
export class ProductsTypeormRepository implements ProductsRepository {

  sortableFields: string[] = ['name', 'price', 'created_at'];

  constructor(
    @inject('ProductsDefaultTypeormRepository')
    private productsRepository: Repository<Product>,
  ) { }

  async findByName(name: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ name });

    if (!product) {
      throw new NotFoundError(`Product not found using Name ${name}`);
    }

    return this.toDomain(product);
  }

  async findAllByIds(productsIds: { id: string }[]): Promise<ProductModel[]> {
    const ids = productsIds.map((productId) => productId.id);

    const productsFound = await this.productsRepository.find({
      where: { id: In(ids) }
    });

    return productsFound.map((product) => this.toDomain(product));
  }

  async conflictingName(name: string): Promise<void> {
    const product = await this.productsRepository.findOneBy({ name });

    if (product) {
      throw new ConflictError(`Name already used by another product`);
    }
  }

  create(props: CreateProductProps): ProductModel {
    return ProductModel.create(props)
  }

  async insert(model: ProductModel): Promise<ProductModel> {
    const product = await this.productsRepository.save(this.toPersistence(model))
    return this.toDomain(product)
  }

  async findById(id: string): Promise<ProductModel> {
    return this._get(id)
  }

  async update(model: ProductModel): Promise<ProductModel> {
    await this._get(model.id)
    const updatedProduct = await this.productsRepository.save(this.toPersistence(model));
    return this.toDomain(updatedProduct);
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.productsRepository.delete({id})
  }

  async search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc','desc']
    const validSortDir = (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [products, total] = await this.productsRepository.findAndCount({
      ...(props.filter && {where: [{ name: ILike(`%${props.filter}%`) }, { sku: ILike(`%${props.filter}%`) }, { category: ILike(`%${props.filter}%`) }] }),
      order: {[orderByField]: orderByDir},
      skip: (props.page - 1) * props.per_page,
      take: props.per_page
    })

    return {
      items: products.map((product) => this.toDomain(product)),
        per_page: props.per_page,
        total,
        current_page: props.page,
        sort: orderByField,
        sort_dir: orderByDir,
        filter: props.filter
    }
  }

  protected async _get(id: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundError(`Product not found using ID ${id}`);
    }

    return this.toDomain(product);
  }

  private toDomain(product: Product): ProductModel {
    return ProductModel.reconstitute({
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      cost_price: product.cost_price,
      quantity: product.quantity,
      category: product.category,
      is_active: product.is_active,
      image_url: product.image_url ?? null,
      created_at: product.created_at,
      updated_at: product.updated_at,
    })
  }

  private toPersistence(product: ProductModel): Product {
    return this.productsRepository.create(product.toJSON())
  }
}
