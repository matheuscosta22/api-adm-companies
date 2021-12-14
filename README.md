Rest API para registro e gerência usando: node.js, express, knex ORM, Database: postgreSQL
Para rodar o projeto é necessário um banco de dados postgreSQL e o node.js instalado na maquina.

use algum client http para consumir a api, como por exemplo postman, insomnia. Na pasta files tem arquivos
importantes, uma documentação para você importar no postman que vai ajuda-lo a consumir a api, também
um arquivo com as queries para criar as tabelas no postgreSQL, configure as credenciais do seu DB
na pasta database/connection.js, instale as dependências com o comando 'npm install', se possível instale o 
nodemon 'npm install nodemon' aí podera utilizar o comando 'npm start' para rodar o projeto ou então use
o comando 'node index'.

rotas:
subistitua 'uri' pelo modelo que quer gerenciar (user, company, place), é necessário um bearer token requisitado na rota de login

POST "http://localhost:8686/api/login"

GET "http://localhost:8686/api/check-token" envie um BEARER token para checar se é válido

GET "http://localhost:8686/api/'uri'" BEARER token

POST "http://localhost:8686/api/'uri'" BEARER token

SELECT "http://localhost:8686/api/'uri'/{id}" BEARER token

PUT "http://localhost:8686/api/'uri'/{id}" BEARER token

DELETE "http://localhost:8686/api/'uri'/{id}" BEARER token
