import { randomUUID } from 'node:crypto'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

type CustomerModelProps = {
  id: string
  name: string
  email: string
  phone: string
  document: string
  created_at: Date
  updated_at: Date
}

type CreateCustomerModelProps = {
  id?: string
  name: string
  email: string
  phone: string
  document: string
  created_at?: Date
  updated_at?: Date
}

export class CustomerModel {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public document: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static create(props: CreateCustomerModelProps): CustomerModel {
    const name = props.name?.trim()
    const email = props.email?.trim().toLowerCase()
    const phone = props.phone?.trim()
    const document = props.document?.trim()

    if (!name || !email || !phone || !document) {
      throw new BadRequestError('Customer input data not provided or invalid')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestError('Customer email is invalid')
    }

    const now = new Date()
    return new CustomerModel(
      props.id ?? randomUUID(),
      name,
      email,
      phone,
      document,
      props.created_at ?? now,
      props.updated_at ?? now,
    )
  }

  static reconstitute(props: CustomerModelProps): CustomerModel {
    return new CustomerModel(
      props.id,
      props.name,
      props.email,
      props.phone,
      props.document,
      props.created_at,
      props.updated_at,
    )
  }

  rename(name: string): void {
    const normalizedName = name?.trim()
    if (!normalizedName) {
      throw new BadRequestError('Customer name is required')
    }
    this.name = normalizedName
    this.touch()
  }

  changeEmail(email: string): void {
    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new BadRequestError('Customer email is invalid')
    }
    this.email = normalizedEmail
    this.touch()
  }

  changePhone(phone: string): void {
    const normalizedPhone = phone?.trim()
    if (!normalizedPhone) {
      throw new BadRequestError('Customer phone is required')
    }
    this.phone = normalizedPhone
    this.touch()
  }

  changeDocument(document: string): void {
    const normalizedDocument = document?.trim()
    if (!normalizedDocument) {
      throw new BadRequestError('Customer document is required')
    }
    this.document = normalizedDocument
    this.touch()
  }

  toJSON(): CustomerModelProps {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      document: this.document,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }

  private touch(): void {
    this.updated_at = new Date()
  }
}
