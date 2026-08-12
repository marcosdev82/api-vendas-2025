# API de Vendas

API REST construida com Node.js, TypeScript, Express, TypeORM, PostgreSQL e Redis.

O projeto cobre os modulos de produtos, vendas, clientes, usuarios e carrinho, com autenticacao JWT, protecao opcional por API Key, documentacao Swagger, cache de leitura e testes automatizados.

## Recursos

- Autenticacao por JWT em `/auth/login`
- Protecao opcional por API Key para distribuicao da API
- Swagger protegido por Basic Auth em `/docs`
- Health check em `/health`
- Listagens padronizadas com paginacao, busca e ordenacao
- Busca por ID para produtos, clientes, usuarios e vendas
- Reset seguro de senha de usuario
- Testes unitarios e testes de integracao HTTP

## Stack

- Node.js 22+
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Redis
- Docker Compose

## Instalacao

```bash
git clone <url-do-repositorio>
cd api-vendas-2025
npm install
```

## Ambiente

Exemplo de configuracao local:

```env
PORT=3333
API_URL=http://localhost:3333
NODE_ENV=development

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_SCHELMA=public
DB_NAME=postgres
DB_USER=postgres
DB_PASS=postgres

REDIS_HOST=localhost
REDIS_PORT=6379

SWAGGER_USER=admin
SWAGGER_PASS=admin123
JWT_SECRET=dev-secret

API_KEY_REQUIRED=false
API_KEYS=chave-cliente-1,chave-cliente-2

SWAGGER_SERVER_URL=http://localhost:3333
SWAGGER_SERVER_URL_TEST=http://localhost:3334
SWAGGER_SERVER_URL_PROD=https://api.example.com
```

## Execucao

### Local

```bash
npm run dev
```

### Docker

```bash
npm run docker:up
npm run docker:logs
npm run docker:down
```

### Migrations apos subir o Docker

Depois de iniciar os containers, execute as migrations manualmente para criar as tabelas no banco:

```bash
npx dotenv-cli -e .env -- npx typeorm-ts-node-commonjs migration:show -d src/common/infrastructure/typeorm/index.ts
npx dotenv-cli -e .env -- npx typeorm-ts-node-commonjs migration:run -d src/common/infrastructure/typeorm/index.ts
```

Se precisar desfazer a ultima migration:

```bash
npx dotenv-cli -e .env -- npx typeorm-ts-node-commonjs migration:revert -d src/common/infrastructure/typeorm/index.ts
```

Aplicacao local:

- API: http://localhost:3333
- Swagger: http://localhost:3333/docs

## Autenticacao

### Swagger

A documentacao em `/docs` usa Basic Auth.

Credenciais padrao:

- Usuario: `admin`
- Senha: `admin123`

### JWT

As rotas protegidas exigem:

```http
Authorization: Bearer <token>
```

O login JWT usa um usuario real salvo no banco.

Se ainda nao existir usuario, crie o primeiro:

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@local.test","password":"admin12345"}'
```

Depois faca login:

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@local.test","password":"admin12345"}'
```

### API Key

Para distribuir a API a terceiros, ative a camada extra de API Key:

```env
API_KEY_REQUIRED=true
API_KEYS=chave-cliente-1,chave-cliente-2
```

Quando `API_KEY_REQUIRED=true`, as chamadas devem enviar:

```http
x-api-key: chave-cliente-1
Authorization: Bearer <token>
```

Exemplo de login com API Key:

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "x-api-key: chave-cliente-1" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@local.test","password":"admin12345"}'
```

## Padrao de Listagem

Todo endpoint de lista segue o mesmo contrato de query string:

- `page`: pagina atual, minimo `1`
- `limit`: quantidade por pagina, minimo `1`, maximo `100`
- `search`: termo de busca
- `sortBy`: campo permitido para ordenacao
- `sortOrder`: `asc` ou `desc`

Compatibilidade legada mantida:

- `per_page`
- `filter`
- `sort`
- `sort_dir`

Formato de resposta paginada:

```json
{
  "items": [],
  "total": 25,
  "current_page": 1,
  "per_page": 10,
  "last_page": 3
}
```

Exemplo:

```bash
curl "http://localhost:3333/products?page=1&limit=10&search=mouse&sortBy=name&sortOrder=asc" \
  -H "Authorization: Bearer <token>"
```

## Endpoints

### Base

- `GET /` - mensagem inicial da API
- `GET /health` - status da API e do banco
- `POST /auth/login` - gera token JWT

### Produtos

- `POST /products` - cria produto
- `POST /products/:id/image` - faz upload da imagem do produto
- `GET /products` - lista produtos
- `GET /products/:id` - busca produto por ID
- `PUT /products/:id` - atualiza produto
- `DELETE /products/:id` - remove produto

Regras:

- A categoria informada no produto precisa existir em `product-categories`
- Upload aceita `jpeg`, `png` e `webp` (maximo de 5MB)

### Categorias de Produto

- `POST /product-categories` - cria categoria
- `GET /product-categories` - lista categorias
- `GET /product-categories/:id` - busca categoria por ID
- `PUT /product-categories/:id` - atualiza categoria
- `DELETE /product-categories/:id` - remove categoria

Listagem de produtos:

- Busca por `name`, `sku` e `category`
- Ordenacao permitida: `name`, `price`, `created_at`

### Clientes

- `POST /customers` - cria cliente
- `GET /customers` - lista clientes
- `GET /customers/:id` - busca cliente por ID

Listagem de clientes:

- Busca por `name` e `email`
- Ordenacao permitida: `name`, `email`, `created_at`

### Usuarios

- `POST /users` - cria usuario
- `GET /users` - lista usuarios
- `GET /users/:id` - busca usuario por ID
- `PATCH /users/:id/reset-password` - reseta senha do usuario

Listagem de usuarios:

- Busca por `name` e `email`
- Ordenacao permitida: `name`, `email`, `created_at`
- Resposta nao expoe `password`

Reset de senha:

- recebe `newPassword`
- senha e sempre armazenada com hash
- senha em texto puro nunca e retornada

### Vendas

- `POST /sales` - cria venda
- `GET /sales` - lista vendas
- `GET /sales/:id` - busca venda por ID
- `PUT /sales/:id` - atualiza venda
- `DELETE /sales/:id` - remove venda

Listagem de vendas:

- Busca por `customer_name`
- Ordenacao permitida: `created_at`, `status`

### Carrinho

- `POST /cart` - adiciona item ao carrinho
- `GET /cart` - lista itens do carrinho

Listagem de carrinho:

- Busca por `product_id`
- Ordenacao permitida: `created_at`

## Exemplos

### Criar produto

```bash
curl -X POST http://localhost:3333/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "SKU-1001",
    "name": "Headphones",
    "description": "Wireless headphones",
    "price": 299.99,
    "cost_price": 180.5,
    "quantity": 120,
    "category": "Electronics",
    "is_active": true,
    "image_url": "https://example.com/headphones.png"
  }'
```

### Listar clientes

```bash
curl "http://localhost:3333/customers?page=1&limit=10&search=maria&sortBy=name&sortOrder=asc" \
  -H "Authorization: Bearer <token>"
```

### Buscar usuario por ID

```bash
curl http://localhost:3333/users/<id> \
  -H "Authorization: Bearer <token>"
```

### Resetar senha de usuario

```bash
curl -X PATCH http://localhost:3333/users/<id>/reset-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"newPassword":"NovaSenhaSegura123"}'
```

### Listar vendas

```bash
curl "http://localhost:3333/sales?page=1&limit=10&search=Maria&sortBy=status&sortOrder=asc" \
  -H "Authorization: Bearer <token>"
```

### Listar carrinho

```bash
curl "http://localhost:3333/cart?page=1&limit=10&search=<prefixo-do-product-id>&sortBy=created_at&sortOrder=desc" \
  -H "Authorization: Bearer <token>"
```

## Testes

### Unitarios

```bash
npm test
```

### Integracao

```bash
npm run test:int
```

A suite de integracao HTTP cobre:

- produtos
- clientes
- usuarios
- reset de senha
- vendas
- carrinho
- validacao de parametros de listagem

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run test:int
npm run docker:up
npm run docker:down
npm run docker:logs
```

## Estrutura

- `src/common` - infraestrutura compartilhada, auth, cache, env, validacao e HTTP
- `src/products` - modulo de produtos
- `src/customers` - modulo de clientes
- `src/users` - modulo de usuarios
- `src/sales` - modulo de vendas
- `src/cart` - modulo de carrinho

## Observacoes

- Em desenvolvimento local, mantenha `API_KEY_REQUIRED=false`.
- Em distribuicao, ative `API_KEY_REQUIRED=true` e defina `API_KEYS`.
- O contrato mais completo da API pode ser consultado diretamente em `/docs`.

<img src="/fluxograma.png" />
