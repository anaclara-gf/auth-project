# API para cadastro e autenticação de usuários

Essa API foi desenvolvida para cadastrar e autenticar usuários.

Para rodar a aplicação, você deve ter o Docker instalado e um banco de dados MongoDB. Caso você não tenha o Docker na sua máquina, a forma mais fácil é instalar o [Docker Desktop](https://docs.docker.com/desktop/). Para criar um banco de dados MongoDB gratuito, crie uma conta no [site do MongoDB](https://www.mongodb.com/).

Antes de rodar a aplicação, você deve criar um arquivo .env na raíz do projeto com as configurações de porta, do seu banco de dados e sua chave do Json Web Token.

Para rodar a aplicação, primeiro você deve criar uma imagem docker com o comando:

    docker build -t [nomeimagem] .

Substitua o [nomeimagem] pelo que fizer mais sentido para você.

Depois você deve criar um container a partir da imagem que você criou anteriormente. Para isso rode o comando:

    docker run --name [nomecontainer] -p 5000:5000 [nomeimagem]

Substitua o [nomecontainer] pelo que fizer mais sentido para você e o [nomeimagem] pelo nome da imagem que você criou anteriormente.

# Endpoints

Os endpoints da API estão descritos abaixo.

## Criar usuário

### Request

`POST /users`

Body

    nomeusuario: String,
    email: String,
    senha: String,
    nomecompleto: String,
    telefone: String,

### Responses

HTTP/1.1 201 CREATED

    {
        "message": "Usuário cadastrado com sucesso"
    }

HTTP/1.1 500 INTERNAL SERVER ERROR

    {
        "output": "Erro ao gerar a senha: [erro]"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "Erro ao tentar cadastrar [erro]"
    }

## Achar usuários

### Request

`GET /users`

Headers

    token: JWT

### Responses

HTTP/1.1 200 OK

    {
        "resultado": [
            {
                "_id": String,
                "nomeusuario": String,
                "email": String,
                "nomecompleto": String,
                "telefone": String,
                "dataCadastro": String,
                "__v": Number,
            }
        ]
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "Ocorreu um erro durante o processamento da requisição [erro]"
    }

## Achar usuário pelo id

### Request

`GET /users/:id`

Headers

    token: JWT

### Responses

HTTP/1.1 200 OK

    {
        "resultado":
            {
                "_id": String,
                "nomeusuario": String,
                "email": String,
                "nomecompleto": String,
                "telefone": String,
                "dataCadastro": String,
                "__v": Number,
            }
    }

HTTP/1.1 400 BAD REQUEST

    {
        "erro": "Ocorreu um erro durante o processamento da requisição [erro]"
    }

## Fazer login

### Request

`POST /login`

Body

    nomeusuario: String,
    senha: String,

### Responses

HTTP/1.1 200 OK

    {
        "output": "Autenticado com sucesso",
        "token": JWT
    }

HTTP/1.1 500 INTERNAL SERVER ERROR

    {
        "output": "Erro ao processar dados: [erro]"
    }

HTTP/1.1 500 INTERNAL SERVER ERROR

    {
        "output": "Erro ao tentar efetuar o login: [erro]"
    }

HTTP/1.1 404 NOT FOUND

    {
        "output": "Usuário não encontrado"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "output": "Usuário ou senha incorretos"
    }

## Mudar senha

### Request

`PUT users/changePassword/:id`

Body

    senha: String,

Headers

    token: JWT

### Responses

HTTP/1.1 200 OK

    {
       "message": "Você atualizou com sucesso a senha do usuário com id [:id]!"
    }

HTTP/1.1 500 INTERNAL SERVER ERROR

    {
        "output": "Erro ao gerar a senha: [erro]"
    }

HTTP/1.1 500 INTERNAL SERVER ERROR

    {
        "output": "Erro ao processar a solicitação: [erro]"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "message": "É preciso mandar a nova senha a ser cadastrada"
    }

HTTP/1.1 400 BAD REQUEST

    {
        "message": "Não foi possível atualizar a senha do usuário"
    }
