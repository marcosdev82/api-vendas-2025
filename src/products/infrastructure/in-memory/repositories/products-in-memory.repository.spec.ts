import { NotFoundError } from "@/common/domain/errors/not-found-error"
import { ProductsInMemoryRepository } from "./products-in-memory.repository"
import { ProductDataBuilder } from "../testing/helpers/products-data-builder"

describe('ProductsInMemoryRepository unit tests', () => {
  let sut: ProductsInMemoryRepository

  beforeEach(() => {
    sut = new ProductsInMemoryRepository()
    
  })

  describe('findByName', () => {
    it('should throw error when product not found', async () => {
      await expect(() => sut.findByName ('fake_name')).rejects.toThrow(
        new NotFoundError(`Product not found using name fake_name`)
      )

      await expect(() => sut.findByName ('fake_name')).rejects.toBeInstanceOf(NotFoundError)
    })

    it('should find product by name', async () => {
      const data = ProductDataBuilder({ name: 'Curso nodejs'})
      sut.items.push(data)
      const result = await sut.findByName('Curso nodejs')
      expect(result).toEqual(data)
    })
  })
})
