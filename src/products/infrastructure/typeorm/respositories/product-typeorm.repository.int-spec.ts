import { testDataSource } from "@/common/infrastructure/typeorm/typeorm/testing/data-source";
import { ProductsTypeormRepository } from "./product-typeorm.repository";
import { Product } from "../entities/products.entity";

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

  describe('method', () => {
    it('testing', () => {
    
    })
  })
});
