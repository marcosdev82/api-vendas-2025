import { SearchInput, SearchOutput } from "@/common/domain/repositories/repository.interfaces";
import { ProductModel } from "@/products/domain/models/products.model";
import { CreateProductProps, ProductId, ProductsRepository } from "@/products/domain/respositories/products.respository";
import { Product } from "../entities/products.entity";
import { In, Repository } from "typeorm";
import { dataSource } from "@/common/infrastructure/typeorm";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { ConflictError } from "@/common/domain/errors/not-found-conflict-error";

export class ProductsTypeormRepository implements ProductsRepository {

  sortableFields: string[] = ["name", "created_at"]; 
  productsRepository: Repository<Product>

  constructor() {
    this.productsRepository = dataSource.getRepository(Product);
  }

  async findByName(name: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ name });

    if (!product) {
      throw new NotFoundError(`Product not found using Name ${name}`);
    }

    return product;
  }

  async findAllByIds(productsIds: { id: string }[]): Promise<ProductModel[]> {
    const ids = productsIds.map((productId) => productId.id);

    const productsFound = await this.productsRepository.find({
      where: { id: In(ids) }
    });

    return productsFound;
  }

  async conflictingName(name: string): Promise<void> {
    const product = await this.productsRepository.findOneBy({ name });

    if (product) {
      throw new ConflictError(`Name already used by another product`);
    }
  }

  create(props: CreateProductProps): ProductModel {
    return this.productsRepository.create(props)
  }

  async insert(model: ProductModel): Promise<ProductModel> {
    return this.productsRepository.save(model)
  }

  async findById(id: string): Promise<ProductModel> {
    return this._get(id)
  }

  async update(model: ProductModel): Promise<ProductModel> {
    await this._get(model.id)
    await this.productsRepository.update({id: model.id}, model);
    return model;
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.productsRepository.delete({id})
  }

  search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
    throw new Error("Method not implemented.");
  }

  protected async _get(id: string): Promise<ProductModel> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundError(`Product not found using ID ${id}`);
    }

    return product;
  }
}
