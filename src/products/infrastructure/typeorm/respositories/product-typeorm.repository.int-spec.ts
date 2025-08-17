import { testDataSource } from "@/common/infrastructure/typeorm/typeorm/testing/data-source";
import { ProductsTypeormRepository } from "./product-typeorm.repository";
import { Product } from "../entities/products.entity";
import { Not } from "typeorm";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { randomUUID } from "crypto";
import { ProductDataBuilder } from "../../in-memory/testing/helpers/products-data-builder";

describe('ProductsTypeormRepository integrations tests', () => {
  let ormRepository: ProductsTypeormRepository

  beforeAll(async() => {
    await testDataSource.initialize() 
  })

  afterAll(async() => {
    await testDataSource.destroy()
  })

  beforeEach(async() => {
    await testDataSource.manager.query('DELETE from products')
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
      const data = ProductDataBuilder({})
      const product = testDataSource.manager.create(Product, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findById(product.id)
      expect(result.id).toEqual(product.id)
      expect(result.name).toEqual(product.name)
    })
  })
});
