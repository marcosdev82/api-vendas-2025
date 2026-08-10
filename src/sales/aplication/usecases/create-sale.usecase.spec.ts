import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { ProductsInMemoryRepository } from '@/products/infrastructure/in-memory/repositories/products-in-memory.repository'
import { ProductDataBuilder } from '@/products/infrastructure/in-memory/testing/helpers/products-data-builder'
import { CreateSaleUseCase } from './create-sale.usecase'
import { SalesInMemoryRepository } from '@/sales/infrastructure/in-memory/repositories/sales-in-memory.repository'

describe('CreateSaleUseCase Unit Tests', () => {
  it('should create a sale and decrease product stock', async () => {
    const productRepository = new ProductsInMemoryRepository()
    const salesRepository = new SalesInMemoryRepository()
    const sut = new CreateSaleUseCase.UseCase(productRepository, salesRepository)

    const product = await productRepository.insert(
      ProductDataBuilder({ name: 'Keyboard', price: 100, quantity: 5 }),
    )

    const result = await sut.execute({
      customer_name: 'Jane Doe',
      product_id: product.id,
      quantity: 2,
      status: 'PENDING',
    })

    expect(result.id).toBeDefined()
    expect(result.total_price).toBe(200)
    expect(result.status).toBe('PENDING')
    expect(productRepository.items[0].quantity).toBe(3)
  })

  it('should reject sales when requested quantity exceeds stock', async () => {
    const productRepository = new ProductsInMemoryRepository()
    const salesRepository = new SalesInMemoryRepository()
    const sut = new CreateSaleUseCase.UseCase(productRepository, salesRepository)

    const product = await productRepository.insert(
      ProductDataBuilder({ name: 'Mouse', price: 50, quantity: 1 }),
    )

    await expect(
      sut.execute({
        customer_name: 'John Doe',
        product_id: product.id,
        quantity: 2,
        status: 'PENDING',
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })
})
