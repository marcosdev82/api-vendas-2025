import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { InMemoryRepository } from "@/common/domain/repositories/in-memory.repository";
import { ProductModel } from "@/products/models/products.model";
import { ProductId, ProductsRepository } from "@/products/respositories/products.respository";

export class ProductsInMemoryRepository
  extends InMemoryRepository<ProductModel> 
  implements  ProductsRepository {

  sortableFields: string[] = ['name', 'created_at']

  async findByName(name: string): Promise<ProductModel> {
    const model = this.items.find(item => item.name === name)
    if(!model) {
      throw new NotFoundError(`Product not found using name ${name}`)
    }
    return model
  }

  async findAllById(productIds: ProductId[]): Promise<ProductModel[]> {
    const existingProducts = []

    for(const productId of productIds) {
      const product = this.items.find(item => item.id === productId.id)
      if (product) {
        existingProducts.push(product)
      }
    }

    return existingProducts;
  }

  conflictingName(name: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  protected async applyFilter(
    items: ProductModel[], 
    filter: string | null): Promise<ProductModel>
  {
    throw new Error("Method not implemented.");
  }

  
}
