import { NotFoundError } from "@/common/domain/errors/not-found-error"
import { ProductsInMemoryRepository } from "./products-in-memory.repository"
import { ProductDataBuilder } from "../testing/helpers/products-data-builder"
import { ConflictError } from "@/common/domain/errors/not-found-conflict-error"

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

  describe('conflictingName', () => {
      it('should throw error when product not found', async () => {
        const data = ProductDataBuilder({ name: 'Curso nodejs' })
        sut.items.push(data)

        await expect(() => sut.conflictingName('Curso nodejs')).rejects.toThrow(
          new ConflictError(`Name already used on another product: Curso nodejs`)
        )

        await expect(() => sut.conflictingName('Curso nodejs')).rejects.toBeInstanceOf(ConflictError)
      })

      it('should not find product by name', async () => {
        expect.assertions(0)
        await sut.conflictingName('Curso nodejs')
      })
  })

  describe('applyFilter', () => {
      it('should no filter items when filter param is null', async () => {
        const data = ProductDataBuilder({})
        sut.items.push(data)

        const spyFilterMethod = jest.spyOn(sut.items, 'filter' as any)
        const result = await sut['applyFilter'](sut.items, null)
        expect(spyFilterMethod).not.toHaveBeenCalled()
        expect(result).toStrictEqual(sut.items)
      })
  
      it('should filter the data using filter param', async () => {
        const items = [
          ProductDataBuilder({ name: 'Test' }),
          ProductDataBuilder({ name: 'TEST' }),
          ProductDataBuilder({ name: 'fake' }),
        ]
        sut.items.push(...items)

        const spyFilterMethod = jest.spyOn(Array.prototype, 'filter')
        const result = await sut['applyFilter'](sut.items, 'TEST')
        expect(spyFilterMethod).toHaveBeenCalled()
        expect(result).toStrictEqual([items[0], items[1]])

        spyFilterMethod.mockRestore() // restaura o método original após o teste
      })
  })
})
