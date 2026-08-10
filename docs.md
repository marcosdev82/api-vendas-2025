## Documentação com Swagger

O [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) é um middleware para aplicações Express que permite integrar a interface do Swagger UI com sua API, facilitando a visualização e a interação com a documentação da API gerada pelo Swagger, diretamente no navegador.

### Como funciona

- Geração da documentação: utiliza a biblioteca [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) para extrair informações a partir de comentários JSDoc no código.
- Interface interativa: serve a UI do Swagger em `/docs`, permitindo testar os endpoints diretamente no navegador.

### Funcionalidades principais

- Visualização das rotas, métodos, parâmetros e respostas da API
- Testes interativos sem depender de ferramentas externas
- Atualização dinâmica sempre que a documentação é alterada

### Instalação

```shell
npm install swagger-ui-express swagger-jsdoc
npm install -D @types/swagger-ui-express @types/swagger-jsdoc
```

## Funcionalidades recentes documentadas

A API agora inclui:

- módulos de produtos, vendas, clientes, usuários e carrinho
- endpoint de autenticação em `/auth/login`
- endpoint de saúde em `/health`
- proteção da documentação Swagger com autenticação básica
- proteção dos endpoints da API com JWT Bearer
- cache com Redis para leituras frequentes
- logs de requisições e respostas
- segurança com Helmet, rate limiting e hashing de senhas

## Proteção do Swagger e da API

A documentação do Swagger está protegida por autenticação básica. Para acessá-la, informe usuário e senha configurados nas variáveis de ambiente `SWAGGER_USER` e `SWAGGER_PASS`.

Os endpoints da API exigem um token JWT no header `Authorization`:

```http
Authorization: Bearer <seu-token-jwt>
```

Para gerar um token de teste, faça uma requisição para o endpoint de login:

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Depois de obter o token, utilize-o nas chamadas à API para acessar os endpoints protegidos.

## Endpoints principais

- `GET /health` — verificação de saúde
- `POST /auth/login` — autenticação
- `GET/POST/PUT/DELETE /products` — catálogo de produtos
- `GET/POST/PUT/DELETE /sales` — vendas
- `GET/POST /customers` — clientes
- `GET/POST /users` — usuários
- `GET/POST /cart` — carrinho

## Exemplos prontos de uso

### Health check

```bash
curl http://localhost:3333/health
```

### Login

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Criar produto

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

### Criar cliente

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

### Adicionar item ao carrinho

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
