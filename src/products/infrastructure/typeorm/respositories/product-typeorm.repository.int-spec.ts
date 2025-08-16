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

  beforeEach(() => {
    
  })

  describe('method', () => {
    it('testing', () => {
    
    })
  })
});
