import { randomUUID } from 'crypto'
import { InMemoryRepository } from './in-memory.repository'
import { NotFoundError } from '../errors/not-found-error'

type StubModelProps = {
  id: string
  name: string
  price: number
  created_at: Date
  updated_at: Date
}

class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
  constructor() {
    super()
    this.sortableFields = ['name']
  }

  protected async applyFilter(
    items: StubModelProps[],
    filter: string | null,
  ): Promise<StubModelProps[]> {
    if (!filter) return items
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }
}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository
  let model: StubModelProps
  let props: any
  let created_at: Date
  let updated_at: Date

  beforeEach(() => {
    sut = new StubInMemoryRepository()
    created_at = new Date()
    updated_at = new Date()
    props = {
      name: 'test name',
      price: 10,
    }
    model = {
      id: randomUUID(),
      created_at,
      updated_at,
      ...props,
    }
  })

  describe('create', () => {
    it('should create a new model', () => {
      const result = sut.create(props)
      expect(result.name).toStrictEqual('test name')
    })
  })

})
