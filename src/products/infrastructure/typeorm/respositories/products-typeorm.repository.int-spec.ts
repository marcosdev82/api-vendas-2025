import { ProductsTypeormRepository } from './products-typeorm.repository'
import { Product } from '../entities/products.entity'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { randomUUID } from 'crypto'
import { ProductsDataBuilder } from '../../in-memory/testing/helpers/products-data-builder'
import { testDataSource } from '@/common/infrastructure/typeorm/typeorm/testing/data-source'
import { ConflictError } from '@/common/domain/errors/not-found-conflict-error'

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

  describe('insert', () => {
    it('should insert a new product', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1'})
      const result = await ormRepository.insert(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('update', () => {
    it('should generate an error when the product is not found', async () => {
      const data = ProductsDataBuilder({})
      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`Product not found using ID ${data.id}`),
      )
    })

    it('should update a product', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)
      product.name = 'Nome atualizado'

      const result = await ormRepository.update(product)
      expect(result.name).toEqual('Nome atualizado')
    })
  })

  describe('delete', () => {
    it('should generate an error when the product is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.delete(id)).rejects.toThrow(
        new NotFoundError(`Product not found using ID ${id}`),
      )
    })

    it('should delete a product', async () => {
      const data = ProductsDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)
      await ormRepository.delete(data.id)

      const result = await testDataSource.manager.findOneBy(Product, {
        id: data.id,
      })
      
      expect(result).toBeNull()
    })
  })

  
  describe('findByName', () => {
    it('should generate an error when the product is not found', async () => {
      const name = 'Product 1'
      await expect(ormRepository.findByName(name)).rejects.toThrow(
        new NotFoundError(`Product not found using Name ${name}`),
      )
    })

    it('should finds a product by name', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1'})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findByName(product.name)
      expect(result.name).toEqual('Product 1')
    })
  })

  describe('conflictingName', () => {
    it('should generate an error when the product found', async () => {
      const data = ProductsDataBuilder({ name: 'Product 1'})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      await expect(ormRepository.conflictingName('Product 1')).rejects.toThrow(
        new ConflictError(`Name already used by another product`)
      )

    })
  })

  describe('findAllByIds', () => {
    it('should return an empty array when not find the products', async () => {
      const productsIds = [
        { id: 'e0b242a9-9606-4b25-ad24-8e6e2207ae45' },
        { id: randomUUID() },
      ]
      const result = await ormRepository.findAllByIds(productsIds)
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should find the products by the id field', async () => {
      const productsIds = [
        { id: 'e0b242a9-9606-4b25-ad24-8e6e2207ae45' },
        { id: randomUUID() },
      ]

      const data = ProductsDataBuilder({ id: productsIds[0].id })
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findAllByIds(productsIds)
      expect(result).toHaveLength(1)
    })
  })
});
