import { testDataSource } from "@/common/infrastructure/typeorm/typeorm/testing/data-source";
import { ProductsTypeormRepository } from "./product-typeorm.repository";

describe('ProductsTypeormRepository integrations tests', () => {
  let productsRepository: ProductsTypeormRepository

  beforeAll(async() => {
    await testDataSource.initialize() 
  })

  afterAll(async() => {
    await testDataSource.destroy()
  })

  beforeEach(async() => {
    await testDataSource.manager.query('DELETE from products')
  })

  describe('method', () => {
    it('testing', () => {
    
    })
  })
});
