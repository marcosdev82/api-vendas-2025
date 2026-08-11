import 'reflect-metadata'
import '@/common/infrastructure/container'

import { AddressInfo } from 'net'
import jwt from 'jsonwebtoken'
import { Server } from 'http'
import { app } from '@/common/infrastructure/http/app'
import { dataSource } from '@/common/infrastructure/typeorm'
import { Product } from '@/products/infrastructure/typeorm/entities/products.entity'
import { Customer } from '@/customers/infrastructure/typeorm/entities/customers.entity'
import { User } from '@/users/infrastructure/typeorm/entities/users.entity'
import { Sale } from '@/sales/infrastructure/typeorm/entities/sales.entity'
import { CartItem } from '@/cart/infrastructure/typeorm/entities/cart.entity'
import { hashPassword } from '@/common/infrastructure/auth/password'

type JsonResponse = {
  status: number
  body: any
}

describe('HTTP resources integration tests', () => {
  let server: Server
  let baseUrl: string

  beforeAll(async () => {
    if (!dataSource.isInitialized) {
      await dataSource.initialize()
    }

    await dataSource.synchronize(true)

    server = app.listen(0)
    await new Promise<void>((resolve) => server.once('listening', resolve))
    const address = server.address() as AddressInfo
    baseUrl = `http://127.0.0.1:${address.port}`
  })

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      })
    }

    if (dataSource.isInitialized) {
      await dataSource.destroy()
    }
  })

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE cart_items, sales, products, customers, users RESTART IDENTITY CASCADE')
  })

  async function requestJson(path: string, init?: RequestInit): Promise<JsonResponse> {
    const response = await fetch(`${baseUrl}${path}`, init)
    const text = await response.text()
    const body = text ? JSON.parse(text) : null

    return {
      status: response.status,
      body,
    }
  }

  async function createUserAndToken(overrides?: Partial<User>): Promise<{ user: User; token: string }> {
    const repository = dataSource.getRepository(User)
    const user = repository.create({
      name: overrides?.name ?? 'Admin User',
      email: overrides?.email ?? 'admin@local.test',
      password: await hashPassword(overrides?.password ?? 'admin12345'),
    })

    const savedUser = await repository.save(user)
    const token = jwt.sign(
      { sub: savedUser.id, role: 'admin', email: savedUser.email },
      process.env.JWT_SECRET ?? 'dev-secret',
      { expiresIn: '8h' },
    )

    return { user: savedUser, token }
  }

  async function createProduct(overrides?: Partial<Product>): Promise<Product> {
    return dataSource.getRepository(Product).save({
      sku: overrides?.sku ?? `SKU-${Math.random().toString(36).slice(2, 8)}`,
      name: overrides?.name ?? 'Default Product',
      description: overrides?.description ?? 'Product description',
      price: overrides?.price ?? 100,
      cost_price: overrides?.cost_price ?? 60,
      quantity: overrides?.quantity ?? 10,
      category: overrides?.category ?? 'General',
      is_active: overrides?.is_active ?? true,
      image_url: overrides?.image_url ?? null,
    })
  }

  describe('products', () => {
    it('should list products using pagination, search and sort', async () => {
      await createUserAndToken()

      await dataSource.getRepository(Product).save([
        {
          sku: 'SKU-1',
          name: 'Mouse',
          description: 'Wireless mouse',
          price: 70,
          cost_price: 40,
          quantity: 5,
          category: 'Accessories',
          is_active: true,
          image_url: null,
        },
        {
          sku: 'SKU-2',
          name: 'Monitor',
          description: '4k monitor',
          price: 900,
          cost_price: 650,
          quantity: 3,
          category: 'Accessories',
          is_active: true,
          image_url: null,
        },
        {
          sku: 'SKU-3',
          name: 'Keyboard',
          description: 'Mechanical keyboard',
          price: 250,
          cost_price: 180,
          quantity: 8,
          category: 'Peripherals',
          is_active: true,
          image_url: null,
        },
      ])

      const { token } = await createUserAndToken({ email: 'viewer@local.test' } as Partial<User>)
      const response = await requestJson('/products?page=1&limit=2&search=Mo&sortBy=name&sortOrder=asc', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.total).toBe(2)
      expect(response.body.current_page).toBe(1)
      expect(response.body.per_page).toBe(2)
      expect(response.body.last_page).toBe(1)
      expect(response.body.items).toHaveLength(2)
      expect(response.body.items[0].name).toBe('Monitor')
      expect(response.body.items[1].name).toBe('Mouse')
    })

    it('should get product by id', async () => {
      const { token } = await createUserAndToken()
      const product = await dataSource.getRepository(Product).save({
        sku: 'SKU-10',
        name: 'Headset',
        description: 'Gaming headset',
        price: 320,
        cost_price: 190,
        quantity: 4,
        category: 'Audio',
        is_active: true,
        image_url: null,
      })

      const response = await requestJson(`/products/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(product.id)
      expect(response.body.name).toBe('Headset')
    })
  })

  describe('customers', () => {
    it('should list customers searching by email with pagination and sort', async () => {
      const { token } = await createUserAndToken()
      await dataSource.getRepository(Customer).save([
        {
          name: 'Carlos',
          email: 'carlos@corp.test',
          phone: '111111111',
          document: '12345678901',
        },
        {
          name: 'Ana',
          email: 'ana@corp.test',
          phone: '222222222',
          document: '12345678902',
        },
        {
          name: 'Joao',
          email: 'joao@other.test',
          phone: '333333333',
          document: '12345678903',
        },
      ])

      const response = await requestJson('/customers?page=1&limit=2&search=corp.test&sortBy=email&sortOrder=asc', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.total).toBe(2)
      expect(response.body.items).toHaveLength(2)
      expect(response.body.items[0].email).toBe('ana@corp.test')
      expect(response.body.items[1].email).toBe('carlos@corp.test')
    })

    it('should get customer by id', async () => {
      const { token } = await createUserAndToken()
      const customer = await dataSource.getRepository(Customer).save({
        name: 'Maria',
        email: 'maria@corp.test',
        phone: '444444444',
        document: '12345678904',
      })

      const response = await requestJson(`/customers/${customer.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(customer.id)
      expect(response.body.email).toBe('maria@corp.test')
    })
  })

  describe('users', () => {
    it('should list users without exposing password', async () => {
      const { token } = await createUserAndToken()
      await dataSource.getRepository(User).save({
        name: 'Secondary User',
        email: 'secondary@local.test',
        password: await hashPassword('secondary123'),
      })

      const response = await requestJson('/users?page=1&limit=10&search=local.test&sortBy=email&sortOrder=asc', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.total).toBe(2)
      expect(response.body.items[0]).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          email: expect.any(String),
        }),
      )
      expect(response.body.items[0].password).toBeUndefined()
    })

    it('should get a user by id without exposing password', async () => {
      const { user, token } = await createUserAndToken()

      const response = await requestJson(`/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(user.id)
      expect(response.body.email).toBe(user.email)
      expect(response.body.password).toBeUndefined()
    })

    it('should reset a user password securely', async () => {
      const { user, token } = await createUserAndToken()

      const resetResponse = await requestJson(`/users/${user.id}/reset-password`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: 'newPassword123' }),
      })

      expect(resetResponse.status).toBe(204)

      const loginResponse = await requestJson('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.email,
          password: 'newPassword123',
        }),
      })

      expect(loginResponse.status).toBe(200)
      expect(loginResponse.body.access_token).toEqual(expect.any(String))
    })
  })

  describe('sales', () => {
    it('should list sales using pagination, search and sort', async () => {
      const { token } = await createUserAndToken()
      const product = await createProduct({ quantity: 30, price: 150 })

      await dataSource.getRepository(Sale).save([
        {
          customer_name: 'Maria Silva',
          product_id: product.id,
          quantity: 1,
          total_price: 150,
          status: 'PENDING',
        },
        {
          customer_name: 'Marcos Lima',
          product_id: product.id,
          quantity: 2,
          total_price: 300,
          status: 'APPROVED',
        },
        {
          customer_name: 'Joao Costa',
          product_id: product.id,
          quantity: 1,
          total_price: 150,
          status: 'CANCELLED',
        },
      ])

      const response = await requestJson('/sales?page=1&limit=2&search=Mar&sortBy=status&sortOrder=asc', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.total).toBe(2)
      expect(response.body.per_page).toBe(2)
      expect(response.body.items).toHaveLength(2)
      expect(response.body.items[0].customer_name).toBe('Marcos Lima')
      expect(response.body.items[1].customer_name).toBe('Maria Silva')
    })
  })

  describe('cart', () => {
    it('should list cart items using pagination, search and sort', async () => {
      const { user, token } = await createUserAndToken()
      const productA = await createProduct({ name: 'Notebook' })
      const productB = await createProduct({ name: 'Mousepad' })
      const productC = await createProduct({ name: 'Monitor Arm' })

      await dataSource.getRepository(CartItem).save([
        {
          user_id: user.id,
          product_id: productA.id,
          quantity: 1,
        },
        {
          user_id: user.id,
          product_id: productB.id,
          quantity: 2,
        },
        {
          user_id: user.id,
          product_id: productC.id,
          quantity: 3,
        },
      ])

      const response = await requestJson(`/cart?page=1&limit=2&search=${productB.id.slice(0, 8)}&sortBy=created_at&sortOrder=desc`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      expect(response.status).toBe(200)
      expect(response.body.total).toBe(1)
      expect(response.body.items).toHaveLength(1)
      expect(response.body.items[0].product_id).toBe(productB.id)
      expect(response.body.items[0].quantity).toBe(2)
    })
  })

  describe('validation', () => {
    it('should reject invalid sort field for products list', async () => {
      const { token } = await createUserAndToken()

      const response = await requestJson('/products?sortBy=quantity', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      expect(response.status).toBe(400)
      expect(response.body.message).toContain('sortBy')
    })
  })
})
