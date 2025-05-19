import { InMemoryRepository } from "./in-memory.repository"

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
    filter: string
  ): Promise<StubModelProps[]> {
    if (!filter) return items
    return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()),)
  }

}
