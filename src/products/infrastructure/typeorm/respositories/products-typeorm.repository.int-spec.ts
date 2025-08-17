import { ProductsTypeormRepository } from './products-typeorm.repository'
import { Product } from '../entities/products.entity'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { randomUUID } from 'crypto'
import { ProductsDataBuilder } from '../../in-memory/testing/helpers/products-data-builder'
import { testDataSource } from '@/common/infrastructure/typeorm/typeorm/testing/data-source'

describe('ProductsTypeormRepository integrations tests', () => {
  let ormRepository: ProductsTypeormRepository

  beforeAll(async () => {
    try {
      if (!testDataSource.isInitialized) {
        await testDataSource.initialize()
      }
    } catch (err) {
      console.error('Erro ao inicializar o banco:', err)
    }
  })

  afterAll(async () => {
    if (testDataSource.isInitialized) {
      await testDataSource.destroy()
    }
  })

  beforeEach(async () => {
    if (!testDataSource.isInitialized) {
      await testDataSource.initialize()
    }

    await testDataSource.manager.query('DELETE FROM products')
    ormRepository = new ProductsTypeormRepository()
    ormRepository.productsRepository = testDataSource.getRepository(Product)
  })

  describe('findById', () => {
    it('should generate an error when the product is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`Product not found using ID ${id}`),
      )
    })

    it('should finds a product by id', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findById(product.id)
      expect(result.id).toEqual(product.id)
      expect(result.name).toEqual(product.name)
    })
  })

  describe('create', () => {
    it('should create a new product object', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1'})
      const result = ormRepository.create(data)
      expect(result.name).toEqual(data.name)
    })
  })

});
