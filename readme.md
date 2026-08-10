# API de Vendas

Esta API foi desenvolvida com Node.js, TypeScript, Express, TypeORM e Docker. O projeto inclui módulos de produtos e vendas, documentação Swagger e uma infraestrutura local pronta para PostgreSQL, MySQL e Redis.

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
```

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
- MySQL
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

### MySQL

O MySQL também está disponível para uso local:

- Host: localhost
- Porta: 3306
- Usuário: mysql
- Senha: mysql
- Banco: vendas

### Redis

O Redis é usado para cache e outras integrações locais:

- Host: localhost
- Porta: 6379

## Swagger

A documentação Swagger da API está disponível em:

```text
http://localhost:3333/docs
```

Ela contém as rotas de produtos e vendas, com exemplos de request e response.

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

## Próximos passos

Se você quiser evoluir a aplicação, os próximos pontos naturais são:

- autenticação e autorização
- camada de clientes
- pedidos completos
- cache com Redis mais integrado
- testes de integração adicionais
