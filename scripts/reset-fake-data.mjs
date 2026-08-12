import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

async function main() {
  const client = new Client({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? 'postgres',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'postgres',
  })

  await client.connect()

  try {
    await client.query('BEGIN')
    await client.query(
      'TRUNCATE TABLE cart_items, sales, products, product_categories, customers, users RESTART IDENTITY CASCADE',
    )
    await client.query('COMMIT')
    console.log('Banco limpo com sucesso (cart_items, sales, products, product_categories, customers, users).')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error('Erro ao limpar banco para seed fake:', error.message)
  process.exit(1)
})
