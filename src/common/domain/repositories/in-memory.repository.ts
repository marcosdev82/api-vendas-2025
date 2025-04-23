import { string } from "zod"
import { RepositoryInterface, SearchInput, SearchOutput } from "./repository.interfaces"
import { NotFoundError } from "../errors/not-found-error"

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
  async findById(id: string): Promise<Model> {
    return this._get(id)
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

  protected async _get(id: string): Promise<Model> {

    const model = this.items.find((item) => item.id === id)
    
    if (!model) {
      throw new NotFoundError(`Model with id ${id} not found`)
    }
  
    return model;
  }
}
