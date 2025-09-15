import "reflect-metadata"
import { ProductsRepository } from "@/products/domain/respositories/products.respository"
import { getProductUseCase } from "./get-product.usecase"
import { ProductsInMemoryRepository } from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository"
import { ConflictError } from "@/common/domain/errors/not-found-conflict-error"
import { BadRequestError } from "@/common/domain/errors/bad-request-error"
import { Not } from "typeorm"
import { NotFoundError } from "@/common/domain/errors/not-found-error"

describe('GetProductUseCase Unit Tests', () => {
  
  let sut: getProductUseCase.UseCase
  let repository: ProductsRepository

  beforeEach(() => {
    repository = new ProductsInMemoryRepository()
    sut = new getProductUseCase.UseCase(repository)
  })

  it('should be able to get a product', async () => {
    const spyFinById = jest.spyOn(repository, 'findById')
    const props = {
      name: 'Product 1',
      price: 10,
      quantity: 5
    }

    const model = repository.create(props)
    await repository.insert(model)

    const result = await sut.execute({id: model.id })
    expect(result).toMatchObject(model)
    expect(spyFinById).toHaveBeenCalledTimes(1)
  })

  it('should throws error when product not found', async () => {

    await expect(sut.execute({id: 'fake-id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })


})
