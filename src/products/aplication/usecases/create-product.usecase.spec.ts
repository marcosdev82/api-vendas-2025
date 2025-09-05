import { ProductsRepository } from "@/products/domain/respositories/products.respository"
import { CreateProductUseCase } from "./create-product.usecase"
import { ProductsInMemoryRepository } from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository"

describe('CreateProductUseCase Unit Tests', () => {
  
  let sut: CreateProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new CreateProductUseCase.UseCase(repository)
  })

  it('should create a product', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 5
    }
    const result = await sut.execute(props)
    expect(result.id).toBeDefined()
    expect(result.created_at).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

})
