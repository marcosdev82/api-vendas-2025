import { randomUUID } from 'node:crypto'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

type UserModelProps = {
  id: string
  name: string
  email: string
  password: string
  created_at: Date
  updated_at: Date
}

type CreateUserModelProps = {
  id?: string
  name: string
  email: string
  password: string
  created_at?: Date
  updated_at?: Date
}

export class UserModel {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static create(props: CreateUserModelProps): UserModel {
    const name = props.name?.trim()
    const email = props.email?.trim().toLowerCase()
    const password = props.password?.trim()

    if (!name) {
      throw new BadRequestError('User name is required')
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestError('User email is invalid')
    }

    if (!password) {
      throw new BadRequestError('User password hash is required')
    }

    const now = new Date()
    return new UserModel(
      props.id ?? randomUUID(),
      name,
      email,
      password,
      props.created_at ?? now,
      props.updated_at ?? now,
    )
  }

  static reconstitute(props: UserModelProps): UserModel {
    return new UserModel(
      props.id,
      props.name,
      props.email,
      props.password,
      props.created_at,
      props.updated_at,
    )
  }

  rename(name: string): void {
    const normalizedName = name?.trim()
    if (!normalizedName) {
      throw new BadRequestError('User name is required')
    }
    this.name = normalizedName
    this.touch()
  }

  changeEmail(email: string): void {
    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new BadRequestError('User email is invalid')
    }
    this.email = normalizedEmail
    this.touch()
  }

  changePassword(passwordHash: string): void {
    const normalizedHash = passwordHash?.trim()
    if (!normalizedHash) {
      throw new BadRequestError('User password hash is required')
    }
    this.password = normalizedHash
    this.touch()
  }

  toJSON(): UserModelProps {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }

  private touch(): void {
    this.updated_at = new Date()
  }
}
