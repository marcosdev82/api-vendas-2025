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
    it('should gerenerate an error when the product is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`Product not found using ID ${id}`),
      )
    })
  })

  describe('should finds product by id ', async () => {
    const data = ProductDataBuilder({})
    const product = testDataSource.getRepository(Product).create(data)
    await testDataSource.manager.save(product)
  })

})
