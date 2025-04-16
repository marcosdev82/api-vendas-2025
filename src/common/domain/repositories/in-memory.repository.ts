import { RepositoryInterface, SearchInput, SearchOutput } from "./repository.interfaces"

export type ModelProps = {
  id?: string
  [key: string]: any
}

export type CreateProps = {
  [key: string]: any
}

export abstract class InMemoryRepository<Model extends ModelProps> implements RepositoryInterface<Model, CreateProps> {
  
  items: Model[] = []
  sortableFields: string[] = []

  create(props: CreateProps): Model {
    throw new Error("Method not implemented.");
  }
  insert(model: Model): Promise<Model> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Model> {
    throw new Error("Method not implemented.");
  }
  update(model: Model): Promise<Model> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  search(props: SearchInput): Promise<SearchOutput<Model>> {
    throw new Error("Method not implemented.");
  }
}
