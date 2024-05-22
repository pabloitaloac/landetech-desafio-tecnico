# Vuetify Pokémon App

Este é um projeto Vue.js utilizando Vuetify para listar e visualizar detalhes de Pokémons. O projeto está configurado para ser executado em um contêiner Docker.

## Pré-requisitos

- Docker
- Docker Compose

## Configuração do Projeto

### Clonar o Repositório

Primeiro, clone o repositório para sua máquina local:

```bash
git clone https://github.com/pabloitaloac/landetech-desafio-tecnico.git
cd landetech-desafio-tecnico
```

### Construir e Executar o Contêiner
Use o Docker Compose para construir e executar o contêiner. Execute o seguinte comando na raiz do projeto:

```bash
docker-compose up --build
```

Este comando irá:

- Construir a imagem Docker definida no Dockerfile.
- Iniciar o contêiner e expor a aplicação na porta 3000 do localhost.

### Acessar o Aplicativo
Após o contêiner ser iniciado com sucesso, você pode acessar o aplicativo no seu navegador:

```bash
http://localhost:3000
```
