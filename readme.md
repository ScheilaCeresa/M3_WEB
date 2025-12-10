TRABALHO WEB M3

-----------------------------------------------------------------------------------------

A. Cadastro de Dívidas

 [x] Cliente: nome, cpf, email (obrigatórios)

 [x] Endereço (opcional)

 [x] Valor, objeto, situação (obrigatórios)

 [x] Processo e comprovante PDF (opcionais)

 [x] Operações: POST, GET, DELETE

B. Serviços Web

 [x] Comunicação somente via API

 [x] Requisições assíncronas (fetch)

 [x] Respostas sempre em JSON

C. Cache Local

 [x] Salvar dados no localStorage

 [x] Usar localStorage se o servidor cair

D. Persistência

 [x] Servidor grava em arquivo/banco (JSON, CSV, MySQL etc.)

E. Validação

 [x] Validação no cliente (HTML/JS)

 [x] Validação no servidor

F. Estrutura

 [x] Cliente e servidor separados em projetos/pastas distintas

------------------------------------------------------------------------------------------

Pasta Cliente: 

- index.html
- style.css
- main.js


Pasta Servidor: 

- server.js
- package.json


Servidor

- Node.js
- Express
- CORS

Cliente

- HTML + CSS
- JavaScript (fetch API)
- localStorage
- Manipulação assíncrona


Rodar código

- Acessar a pasta: cd "server_http"

- Dentro da pasta "server_http":  node server.js

- Na Web acessar a porta 4500: http://localhost:4500/
- Ou localmente a pasta index.html


Instalar Dependências: 

- npm init -y

- npm install express cors multer@2



