import { ProductsRepository } from "@/products/domain/respositories/products.respository"
import { CreateProductUseCase } from "./create-product.usecase"
import { ProductsInMemoryRepository } from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository"
import { ConflictError } from "@/common/domain/errors/not-found-conflict-error"
import { BadRequestError } from "@/common/domain/errors/bad-request-error"

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
      sku: 'SKU-001',
      name: 'Product 1',
      description: 'A realistic product description',
      price: 10,
      cost_price: 6,
      quantity: 5,
      category: 'Electronics',
    }
    const result = await sut.execute(props)
    expect(result.id).toBeDefined()
    expect(result.created_at).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should not be possible to register a product with the name of another product', async () => {
    const props = {
      sku: 'SKU-001',
      name: 'Product 1',
      description: 'A realistic product description',
      price: 10,
      cost_price: 6,
      quantity: 5,
      category: 'Electronics',
    }
    await sut.execute(props)
    await expect(sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('should throw error when name not provided', async () => {
    const props = {
      sku: 'SKU-002',
      name: null,
      description: 'A realistic product description',
      price: 10,
      cost_price: 6,
      quantity: 5,
      category: 'Electronics',
    }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })
  it('should throw error when price not provided', async () => {
    const props = {
      sku: 'SKU-003',
      name: 'Product 1',
      description: 'A realistic product description',
      price: 0,
      cost_price: 0,
      quantity: 5,
      category: 'Electronics',
    }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })
  it('should throw error when quantity not provided', async () => {
    const props = {
      sku: 'SKU-004',
      name: 'Product 1',
      description: 'A realistic product description',
      price: 10,
      cost_price: 6,
      quantity: 0,
      category: 'Electronics',
    }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

})
