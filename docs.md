## Documentação com Swagger

O [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) é um middleware para aplicações Express que permite integrar a interface do Swagger UI com sua API, facilitando a visualização e a interação com a documentação da API gerada pelo Swagger, diretamente no navegador.

Como Funciona:

- Geração da Documentação: Utiliza a biblioteca [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) para gerar a documentação a partir de comentários JSDoc em seu código.
- Servir a Interface Swagger UI: Usa o swagger-ui-express para servir a interface gráfica do Swagger UI em um endpoint especificado (por exemplo, /api-docs).

Principais Funcionalidades:

- Visualização da Documentação da API: Permite que desenvolvedores vejam e entendam facilmente as diferentes rotas, métodos, parâmetros e respostas da API.
- Testes Interativos: Através da interface, é possível enviar requisições para a API diretamente do navegador, testando endpoints sem a necessidade de uma ferramenta externa como Postman.
- Atualização Dinâmica: Qualquer alteração na documentação da API (comentários JSDoc, por exemplo) é refletida automaticamente na interface do Swagger UI.

Instalação:

```shell
npm install swagger-ui-express swagger-jsdoc

npm install -D @types/swagger-ui-express @types/swagger-jsdoc
```
