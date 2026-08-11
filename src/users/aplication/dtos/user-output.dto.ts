import { UserModel } from '@/users/domain/models/users.model'

export type UserOutputDto = {
  id: string
  name: string
  email: string
  created_at: Date
  updated_at: Date
}

export class UserOutputMapper {
  static toOutput(user: UserModel): UserOutputDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  }

  static toOutputList(users: UserModel[]): UserOutputDto[] {
    return users.map((user) => this.toOutput(user))
  }
}
