# API de Vendas

Esta API foi desenvolvida com Node.js, TypeScript, Express, TypeORM e Docker. O projeto inclui módulos de produtos, vendas, clientes, usuários e carrinho, além de documentação Swagger, autenticação JWT, cache com Redis, logs estruturados e uma infraestrutura local pronta para PostgreSQL e Redis.

## Funcionalidades principais

- Gestão de produtos, vendas, clientes, usuários e carrinho
- Autenticação com JWT e endpoint de login em `/auth/login`
- Proteção da documentação Swagger com autenticação básica
- Health check em `/health`
- Cache de leitura com Redis para listagens e detalhes
- Logs de requisições e respostas para rastreabilidade
- CI com lint, typecheck e testes automatizados

## Requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js 22+
- Docker e Docker Compose
- npm

## Configuração inicial

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd api-vendas-2025
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo de ambiente:

O projeto já inclui o arquivo [.env](.env) com valores padrão para execução local. Você pode ajustar conforme necessário.

Exemplo:

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
SWAGGER_SERVER_URL=http://localhost:3333
SWAGGER_SERVER_URL_TEST=http://localhost:3334
SWAGGER_SERVER_URL_PROD=https://api.example.com
```

## Endpoints principais

- `GET /health` — verificação de saúde da API
- `POST /auth/login` — emissão de token JWT
- `GET/POST/PUT/DELETE /products` — gestão de produtos
- `GET/POST/PUT/DELETE /sales` — gestão de vendas
- `GET/POST /customers` — cadastro e consulta de clientes
- `GET/POST /users` — cadastro e consulta de usuários
- `GET/POST /cart` — consulta e inclusão de itens no carrinho

## Executando localmente

### Sem Docker

Para rodar a API localmente:

```bash
npm run dev
```

A aplicação ficará disponível em:

- http://localhost:3333
- Documentação Swagger: http://localhost:3333/docs

## Executando com Docker

O projeto já possui um fluxo Docker com os serviços abaixo:

- API
- PostgreSQL
- Redis

### Subir todos os serviços

```bash
npm run docker:up
```

### Ver logs

```bash
npm run docker:logs
```

### Encerrar os serviços

```bash
npm run docker:down
```

## Bancos de dados

### PostgreSQL

O PostgreSQL é o banco padrão da aplicação. Ele fica disponível em:

- Host: localhost
- Porta: 5432
- Usuário: postgres
- Senha: postgres
- Banco: postgres

### Redis

O Redis é usado para cache e outras integrações locais:

- Host: localhost
- Porta: 6379

## Swagger

A documentação Swagger da API está disponível em:

```text
http://localhost:3333/docs
```

Ela contém as rotas de produtos, vendas, clientes, usuários e carrinho, com exemplos de request e response.

### Proteção da documentação

A interface do Swagger agora está protegida por autenticação básica.

Credenciais padrão:

- Usuário: `admin`
- Senha: `admin123`

Você pode alterar essas credenciais via variáveis de ambiente:

```env
SWAGGER_USER=admin
SWAGGER_PASS=admin123
```

### Autenticação da API (JWT)

Os endpoints da API agora exigem um token JWT no header `Authorization`:

```http
Authorization: Bearer <seu-token-jwt>
```

Para obter um token de teste, faça uma requisição para o endpoint de login:

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Exemplo de uso:

```bash
curl http://localhost:3333/products \
  -H "Authorization: Bearer <seu-token-jwt>"
```

### Ambientes disponíveis

A documentação inclui servidores para os ambientes abaixo:

- Desenvolvimento: `http://localhost:3333`
- Teste: `http://localhost:3334`
- Produção: `https://api.example.com`

Você pode sobrescrever esses valores com:

```env
SWAGGER_SERVER_URL=http://localhost:3333
SWAGGER_SERVER_URL_TEST=http://localhost:3334
SWAGGER_SERVER_URL_PROD=https://api.example.com
```

## Exemplos prontos de uso

### 1. Verificar a saúde da API

```bash
curl http://localhost:3333/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "api",
  "database": "connected"
}
```

### 2. Obter um token JWT

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 3. Criar um produto

```bash
curl -X POST http://localhost:3333/products \
  -H "Authorization: Bearer <seu-token-jwt>" \
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

### 4. Criar uma venda

```bash
curl -X POST http://localhost:3333/sales \
  -H "Authorization: Bearer <seu-token-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Jane Doe",
    "product_id": "<id-do-produto>",
    "quantity": 2,
    "total_price": 599.98,
    "status": "PENDING"
  }'
```

### 5. Criar um cliente

```bash
curl -X POST http://localhost:3333/customers \
  -H "Authorization: Bearer <seu-token-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "11999999999",
    "document": "12345678900"
  }'
```

### 6. Criar um usuário

```bash
curl -X POST http://localhost:3333/users \
  -H "Authorization: Bearer <seu-token-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 7. Adicionar um item ao carrinho

```bash
curl -X POST http://localhost:3333/cart \
  -H "Authorization: Bearer <seu-token-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<id-do-usuario>",
    "product_id": "<id-do-produto>",
    "quantity": 1
  }'
```

## Scripts disponíveis

```bash
npm run dev
npm run lint
npm run test
npm run docker:up
npm run docker:down
npm run docker:logs
```

## Estrutura principal

- src/common: configurações compartilhadas, erros, validações e infraestrutura comum
- src/products: módulo de produtos
- src/sales: módulo de vendas
- src/common/infrastructure/http: rotas, app e middleware
- src/common/infrastructure/typorm: migrations e configuração do TypeORM

<img src="/fluxograma.png" />
