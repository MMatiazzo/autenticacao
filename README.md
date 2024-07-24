<p align="center"><img src="assets/logo.png" alt="Health&Med"/></p>

### FIAP - Hackathon 2024 - SOAT4 - Grupo 11 
- Alexandre Mikio Kimura Fukano - **RM 351127** (alexandremkimura@hotmail.com)
- Lucas Proença Renó - **RM 351351** (lucasreno9@gmail.com)
- Matheus Agusuto Leme Matiazzo - **RM 351128** (mathmatiazzo@gmail.com)
- Vinicius Carloto Carnelocce - **RM 351126** (viniciuscarloto@gmail.com)

---

### Links úteis
[![Hackathon 2024](https://img.shields.io/badge/Hackathon%20(.pdf)-2024-blue?logo=readthedocs)](/assets/hackathon-soat.pdf)
[![Documentação](https://img.shields.io/badge/Documentação%20Projeto-044464?logo=github)](https://github.com/lucasreno/docs-hackathon/)
<br>
[![Infraestrutura](https://img.shields.io/badge/Infraestrutura-gray?logo=github)](https://github.com/MMatiazzo/infra-hackathon)
[![Microsserviço-Autenticacao](https://img.shields.io/badge/Microsserviço%20Autenticação-gray?logo=github)](https://github.com/MMatiazzo/autenticacao)
[![Microsserviço-Consulta](https://img.shields.io/badge/Microsserviço%20Consulta-gray?logo=github)](https://github.com/MMatiazzo/consulta)

# Microsserviço Autenticação
Este microsserviço é responsável por autenticar usuários e gerar tokens de acesso para os demais microsserviços.
O middleware de autenticação é feito com JWT e o banco de dados utilizado é o PostgreSQL. As interceptações de requisições para validação de tokens são feitas com o uso da API Gateway da AWS.

## Rodando o projeto localmente
Para rodar o projeto localmente, siga os passos abaixo:

- ### 1. Clone o projeto e utilize a branch principal `master`
    ```bash
    git clone https://github.com/MMatiazzo/autenticacao.git
    cd autenticacao
    ```

- ### 2. Execute o docker-compose
    ```bash
    docker-compose up --build
    ```
- ### 3. Aplicação
     [http://localhost:3332](http://localhost:3332)

    _*O docker compose irá compilar a aplicação usando o Dockerfile e subir dois containers: um para a aplicação e outro para o banco de dados PostgreSQL._

    _*Ao rodar em ambiente local (desenvolvimento), a autenticação via Cognito não é utilizada._

## Clean Architecture
A arquitetura do projeto foi baseada no conceito de Clean Architecture, conforme a imagem abaixo:
![Clean Architecture](https://github.com/lucasreno/docs-hackathon/blob/master/arquitetura/hackathon-clean-arch.drawio.png?raw=true)

## CI/CD
O projeto está configurado para realizar integração contínua e entrega contínua com o Github Actions. O funcionamento do CI/CD é o seguinte:

 - **Trigger**: A cada push/pull request na branch `master` ou manualmente.
 - **Configuração**: Variáveis de ambiente definidas para a região AWS e repositório ECR.
 - **Permissões**: Permissão de leitura para o conteúdo.
 - **Jobs:**
    - **Checkout**: O código é clonado no ambiente de execução do Github Actions.
    - **Configure AWS Credentials**: As credenciais da AWS são configuradas.
    - **Login ECR**: O Github Actions faz login no Elastic Container Registry da AWS.
    - **Build Docker Image**: A imagem Docker é construída a partir do Dockerfile.
    - **Push Docker Image**: A imagem Docker é enviada para o ECR.
    - **Inject Secrets**: As variáveis de ambiente são injetadas no arquivo de configuração.
    - **KubeConfig**: O arquivo de configuração do Kubernetes é configurado.
    - **Pod Deployment**: O arquivo de configuração do Kubernetes é aplicado.
    - **Refresh image**: O serviço é atualizado com a nova imagem.
    - **Restart Service**: Reinicia o deployment do pod no EKS.

## Postman
Para testar a API, utilize o arquivo de coleção do Postman disponível aqui:

[collection.json](assets/postman.json)

## Stack

- #### Principais
    - TypeScript: Superset da linguagem JavaScript que adiciona tipagem estática opcional.
    - Node.js: Ambiente de execução JavaScript server-side.
    - npm: Gerenciador de pacotes do Node.js.
    - NestJS: Framework para construção de aplicações server-side eficientes e escaláveis.
    - Prisma: ORM para Node.js e TypeScript.
    - AWS SDK: SDK para interagir com os serviços da AWS.
    - SQS Client: Cliente para interagir com o Amazon Simple Queue Service.

- #### Testes
    - Jest: Framework de testes em JavaScript.
    - Cucumber: Ferramenta para executar testes de aceitação.
    - NestJS Testing: Biblioteca para testar aplicações NestJS.

- #### Qualidade de Código
    - ESLint: Ferramenta para identificar e reportar padrões encontrados no código ECMAScript/JavaScript.
    - Prettier: Ferramenta para formatar o código.
    - SonarQube: Ferramenta para análise contínua da qualidade do código.

- #### Infraestrutura
    - Github Actions: Ferramenta de integração contínua.
    - Docker: Plataforma para desenvolvimento, envio e execução de aplicações em containers.
    - Docker Compose: Ferramenta para definir e executar aplicações Docker multi-container.

- #### Outros
    - Git: Sistema de controle de versão distribuído.
    - Github: Repositório de código na nuvem.
    - Postman: Ferramenta para testar APIs.
