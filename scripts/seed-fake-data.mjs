import 'dotenv/config'
import pg from 'pg'
import crypto from 'node:crypto'

const { Client } = pg

const ITERATIONS = 310000
const KEY_LENGTH = 32
const DIGEST = 'sha256'
const ALGORITHM = 'pbkdf2'

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem(items) {
  return items[randomInt(0, items.length - 1)]
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (error, key) => {
      if (error) {
        reject(error)
        return
      }

      resolve(key)
    })
  })

  const encodedSalt = salt.toString('base64')
  const encodedKey = Buffer.from(derivedKey).toString('base64')
  return `${ALGORITHM}$${ITERATIONS}$${encodedSalt}$${encodedKey}`
}

async function main() {
  const stamp = Date.now()
  const client = new Client({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? 'postgres',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'postgres',
  })

  await client.connect()

  const seedUser = {
    name: 'Seeder Admin',
    email: `seeder-${stamp}@fake.local`,
    password: '12345678',
  }

  try {
    await client.query('BEGIN')

    const createdUsers = []
    const createdCustomers = []
    const createdCategories = []
    const createdProducts = []

    const adminHash = await hashPassword(seedUser.password)
    const adminResult = await client.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [seedUser.name, seedUser.email, adminHash],
    )
    createdUsers.push(adminResult.rows[0])

    for (let i = 1; i <= 5; i++) {
      const passwordHash = await hashPassword('12345678')
      const result = await client.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, name, email`,
        [`Usuario Fake ${i}`, `usuario-${stamp}-${i}@fake.local`, passwordHash],
      )
      createdUsers.push(result.rows[0])
    }

    for (let i = 1; i <= 12; i++) {
      const result = await client.query(
        `INSERT INTO customers (name, email, phone, document)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email`,
        [
          `Cliente Fake ${i}`,
          `cliente-${stamp}-${i}@fake.local`,
          `1199${String(stamp + i).slice(-7)}`,
          `${String(stamp + i).slice(-11)}${String(i).padStart(2, '0')}`,
        ],
      )
      createdCustomers.push(result.rows[0])
    }

    const categorySeeds = [
      { name: 'Eletronicos', description: 'Celulares, notebooks e gadgets' },
      { name: 'Informatica', description: 'Perifericos e acessorios' },
      { name: 'Audio', description: 'Fones, caixas e microfones' },
      { name: 'Casa', description: 'Itens utilitarios para casa' },
      { name: 'Escritorio', description: 'Produtos para escritorio' },
      { name: 'Games', description: 'Acessorios e produtos gamer' },
    ]

    for (const categoryInput of categorySeeds) {
      const result = await client.query(
        `INSERT INTO product_categories (name, description, is_active)
         VALUES ($1, $2, $3)
         RETURNING id, name`,
        [categoryInput.name, categoryInput.description, true],
      )
      createdCategories.push(result.rows[0])
    }

    for (let i = 1; i <= 18; i++) {
      const category = randomItem(createdCategories)
      const costPrice = randomInt(20, 300)
      const price = costPrice + randomInt(5, 80)

      const result = await client.query(
        `INSERT INTO products (sku, name, description, price, cost_price, quantity, category, is_active, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, name, price`,
        [
          `SKU-${stamp}-${i}`,
          `Produto Fake ${i}`,
          `Descricao do produto fake ${i}`,
          price,
          costPrice,
          randomInt(60, 150),
          category.name,
          true,
          null,
        ],
      )
      createdProducts.push(result.rows[0])
    }

    const saleStatuses = ['PENDING', 'APPROVED', 'CANCELLED']
    let createdSales = 0

    for (let i = 1; i <= 16; i++) {
      const customer = randomItem(createdCustomers)
      const product = randomItem(createdProducts)
      const quantity = randomInt(1, 3)
      const totalPrice = Number(product.price) * quantity

      await client.query(
        `INSERT INTO sales (customer_name, product_id, quantity, total_price, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [customer.name, product.id, quantity, totalPrice, randomItem(saleStatuses)],
      )
      createdSales++
    }

    let createdCartItems = 0

    for (let i = 1; i <= 16; i++) {
      const user = randomItem(createdUsers)
      const product = randomItem(createdProducts)

      await client.query(
        `INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [user.id, product.id, randomInt(1, 4)],
      )
      createdCartItems++
    }

    await client.query('COMMIT')

    console.log('Seed finalizado com sucesso.')
    console.log(`Usuarios criados: ${createdUsers.length}`)
    console.log(`Clientes criados: ${createdCustomers.length}`)
    console.log(`Categorias criadas: ${createdCategories.length}`)
    console.log(`Produtos criados: ${createdProducts.length}`)
    console.log(`Vendas criadas: ${createdSales}`)
    console.log(`Itens de carrinho criados: ${createdCartItems}`)
    console.log(`Usuario para login: ${seedUser.email} / ${seedUser.password}`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error('Erro ao executar seed fake:', error.message)
  process.exit(1)
})
