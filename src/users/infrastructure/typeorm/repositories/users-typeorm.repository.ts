import { SearchInput, SearchOutput } from '@/common/domain/repositories/repository.interfaces'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { ConflictError } from '@/common/domain/errors/not-found-conflict-error'
import { inject, injectable } from 'tsyringe'
import { Repository, ILike } from 'typeorm'
import { User } from '../entities/users.entity'
import { CreateUserProps, UsersRepository } from '@/users/domain/repositories/users.repository'
import { UserModel } from '@/users/domain/models/users.model'

@injectable()
export class UsersTypeormRepository implements UsersRepository {
  sortableFields: string[] = ['name', 'email', 'created_at']

  constructor(
    @inject('UsersDefaultTypeormRepository')
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.usersRepository.findOneBy({ email })
    return user ? this.toDomain(user) : null
  }

  async conflictingEmail(email: string): Promise<void> {
    const user = await this.findByEmail(email)
    if (user) throw new ConflictError('Email already used by another user')
  }

  create(props: CreateUserProps): UserModel {
    return UserModel.create(props)
  }

  async insert(model: UserModel): Promise<UserModel> {
    const user = await this.usersRepository.save(this.toPersistence(model))
    return this.toDomain(user)
  }

  async findById(id: string): Promise<UserModel> {
    return this._get(id)
  }

  async update(model: UserModel): Promise<UserModel> {
    await this._get(model.id)
    const updatedUser = await this.usersRepository.save(this.toPersistence(model))
    return this.toDomain(updatedUser)
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.usersRepository.delete({ id })
  }

  async search(props: SearchInput): Promise<SearchOutput<UserModel>> {
    const validSort = this.sortableFields.includes(props.sort ?? '') || false
    const dirOps = ['asc', 'desc']
    const validSortDir = (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'
    const searchValue = props.filter ? `%${props.filter}%` : null

    const [users, total] = await this.usersRepository.findAndCount({
      ...(searchValue && {
        where: [
          { name: ILike(searchValue) },
          { email: ILike(searchValue) },
        ],
      }),
      order: { [orderByField as string]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: users.map((user) => this.toDomain(user)),
      per_page: props.per_page ?? 15,
      total,
      current_page: props.page ?? 1,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<UserModel> {
    const user = await this.usersRepository.findOneBy({ id })
    if (!user) throw new NotFoundError(`User not found using ID ${id}`)
    return this.toDomain(user)
  }

  private toDomain(user: User): UserModel {
    return UserModel.reconstitute({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })
  }

  private toPersistence(user: UserModel): User {
    return this.usersRepository.create(user.toJSON())
  }
}
