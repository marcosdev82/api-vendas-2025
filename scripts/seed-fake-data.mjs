const API_URL = process.env.API_URL ?? 'http://localhost:3333'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem(items) {
  return items[randomInt(0, items.length - 1)]
}

async function requestJson(path, { method = 'GET', body, token, retry = 0 } = {}) {
  const headers = {}

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') ?? ''
  let parsed = null

  if (contentType.includes('application/json')) {
    parsed = await response.json()
  } else {
    parsed = await response.text()
  }

  if (response.status === 429 && retry < 5) {
    const backoffMs = 1200 * (retry + 1)
    await sleep(backoffMs)
    return requestJson(path, { method, body, token, retry: retry + 1 })
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${method} ${path} -> ${JSON.stringify(parsed)}`)
  }

  return parsed
}

async function main() {
  const stamp = Date.now()
  const createdUsers = []
  const createdCustomers = []
  const createdCategories = []
  const createdProducts = []
  const createdSales = []
  const createdCartItems = []

  const seedUser = {
    name: 'Seeder Admin',
    email: `seeder-${stamp}@fake.local`,
    password: '12345678',
  }

  const userResponse = await requestJson('/users', {
    method: 'POST',
    body: seedUser,
  })
  createdUsers.push(userResponse)

  const loginResponse = await requestJson('/auth/login', {
    method: 'POST',
    body: {
      username: seedUser.email,
      password: seedUser.password,
    },
  })
  const token = loginResponse.access_token

  for (let i = 1; i <= 5; i++) {
    const user = await requestJson('/users', {
      method: 'POST',
      token,
      body: {
        name: `Usuario Fake ${i}`,
        email: `usuario-${stamp}-${i}@fake.local`,
        password: '12345678',
      },
    })
    createdUsers.push(user)
  }

  for (let i = 1; i <= 12; i++) {
    const customer = await requestJson('/customers', {
      method: 'POST',
      token,
      body: {
        name: `Cliente Fake ${i}`,
        email: `cliente-${stamp}-${i}@fake.local`,
        phone: `1199${String(stamp + i).slice(-7)}`,
        document: `${String(stamp + i).slice(-11)}${String(i).padStart(2, '0')}`,
      },
    })
    createdCustomers.push(customer)
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
    const category = await requestJson('/product-categories', {
      method: 'POST',
      token,
      body: categoryInput,
    })
    createdCategories.push(category)
  }

  for (let i = 1; i <= 18; i++) {
    const category = randomItem(createdCategories)
    const costPrice = randomInt(20, 300)
    const price = costPrice + randomInt(5, 80)

    const product = await requestJson('/products', {
      method: 'POST',
      token,
      body: {
        sku: `SKU-${stamp}-${i}`,
        name: `Produto Fake ${i}`,
        description: `Descricao do produto fake ${i}`,
        price,
        cost_price: costPrice,
        quantity: randomInt(60, 150),
        category: category.name,
        is_active: true,
      },
    })
    createdProducts.push(product)
  }

  const saleStatuses = ['PENDING', 'APPROVED', 'CANCELLED']

  for (let i = 1; i <= 16; i++) {
    const customer = randomItem(createdCustomers)
    const product = randomItem(createdProducts)

    const sale = await requestJson('/sales', {
      method: 'POST',
      token,
      body: {
        customer_name: customer.name,
        product_id: product.id,
        quantity: randomInt(1, 3),
        status: randomItem(saleStatuses),
      },
    })
    createdSales.push(sale)
  }

  for (let i = 1; i <= 16; i++) {
    const user = randomItem(createdUsers)
    const product = randomItem(createdProducts)

    const cartItem = await requestJson('/cart', {
      method: 'POST',
      token,
      body: {
        user_id: user.id,
        product_id: product.id,
        quantity: randomInt(1, 4),
      },
    })
    createdCartItems.push(cartItem)
  }

  console.log('Seed finalizado com sucesso.')
  console.log(`Usuarios criados: ${createdUsers.length}`)
  console.log(`Clientes criados: ${createdCustomers.length}`)
  console.log(`Categorias criadas: ${createdCategories.length}`)
  console.log(`Produtos criados: ${createdProducts.length}`)
  console.log(`Vendas criadas: ${createdSales.length}`)
  console.log(`Itens de carrinho criados/atualizados: ${createdCartItems.length}`)
  console.log(`Usuario para login: ${seedUser.email} / ${seedUser.password}`)
}

main().catch((error) => {
  console.error('Erro ao executar seed fake:', error.message)
  process.exit(1)
})
