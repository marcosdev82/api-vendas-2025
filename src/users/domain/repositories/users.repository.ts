import { RepositoryInterface, SearchInput, SearchOutput } from '@/common/domain/repositories/repository.interfaces'
import { UserModel } from '../models/users.model'

export type CreateUserProps = {
  id?: string
  name: string
  email: string
  password: string
  created_at?: Date
  updated_at?: Date
}

export interface UsersRepository extends RepositoryInterface<UserModel, CreateUserProps> {
  findByEmail(email: string): Promise<UserModel | null>
  conflictingEmail(email: string): Promise<void>
}
