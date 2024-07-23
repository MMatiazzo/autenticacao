import { Module } from "@nestjs/common";
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { AutenticacaoControllerRoute } from "../api/http-rest/routes/cliente.routes";
import { PrismaService } from "src/infrastructure/persistence/prisma/prisma.service";
import { IClienteRepository } from "src/infrastructure/persistence/repositories/Icliente.repository";
import { ClientePostgresRepository } from "src/infrastructure/persistence/repositories/cliente.postgres.repository";
import { IClienteGateway } from "../operation/gateways/cliente/Icliente.gateway";
import { ClienteGateway } from "../operation/gateways/cliente/cliente.gateway";
import { CadastrarClienteUseCase } from "src/core/cliente/usecase/cadastrar-cliente/cadastrar-cliente.usecase";
import { CadastrarClienteController } from "../operation/controllers/cadastrar-cliente.controller";
import { IAuthenticationGateway } from "../operation/gateways/authentication/Iauthentication.gateway";
import { CognitoAuth } from "../operation/gateways/authentication/aws/authentication-cognito.gateway";
import { AutenticarClienteUseCase } from "src/core/cliente/usecase/autenticar-cliente/autenticar-cliente.usecase";
import { AutenticarClienteController } from "../operation/controllers/autenticar-cliente.controller";
import { DecodificarTokenClienteUseCase } from "src/core/cliente/usecase/decodificar-token-cliente/decodificar-token-cliente.usecase";
import { ExcluirClienteUseCase } from "src/core/cliente/usecase/excluir-cliente/excluir-cliente.usecase";
import { DecodificarTokenClienteController } from "../operation/controllers/decodificar-token-cliente.controller";
import { ExcluirClienteController } from "../operation/controllers/excluir-cliente.controller";
import { MockAuth } from "../operation/gateways/authentication/mock/authentication-mock.gateway";

const persistenceProviders: Provider[] = [
  PrismaService,
  {
    provide: IClienteRepository,
    useFactory: (prisma: PrismaService) => new ClientePostgresRepository(prisma),
    inject: [PrismaService]
  },
  {
    provide: IClienteGateway,
    useFactory: (clienteRepository: IClienteRepository) => new ClienteGateway(clienteRepository),
    inject: [IClienteRepository]
  },
  {
    provide: IAuthenticationGateway,
    useFactory: () => process.env.NODE_ENV === 'development' ? new MockAuth() : new CognitoAuth(),
    inject: [],
  }
]

const useCaseProviders: Provider[] = [
  {
    provide: CadastrarClienteUseCase,
    useFactory: (clienteGateway: IClienteGateway, authGateway: IAuthenticationGateway) =>
      new CadastrarClienteUseCase(clienteGateway, authGateway),
    inject: [IClienteGateway, IAuthenticationGateway]
  },
  {
    provide: AutenticarClienteUseCase,
    useFactory: (clienteGateway: IClienteGateway, autenticationGateway: IAuthenticationGateway) =>
      new AutenticarClienteUseCase(clienteGateway, autenticationGateway),
    inject: [IClienteGateway, IAuthenticationGateway]
  },
  {
    provide: DecodificarTokenClienteUseCase,
    useFactory: (authGateway: IAuthenticationGateway) =>
      new DecodificarTokenClienteUseCase(authGateway),
    inject: [IAuthenticationGateway]
  },
  {
    provide: ExcluirClienteUseCase,
    useFactory: (clienteGateway: IClienteGateway, autenticationGateway: IAuthenticationGateway) =>
      new ExcluirClienteUseCase(clienteGateway, autenticationGateway),
    inject: [IClienteGateway, IAuthenticationGateway]
  }
]

const controllerProviders: Provider[] = [
  {
    provide: CadastrarClienteController,
    useFactory: (cadastrarClienteUseCase: CadastrarClienteUseCase) => new CadastrarClienteController(cadastrarClienteUseCase),
    inject: [CadastrarClienteUseCase]
  },
  {
    provide: AutenticarClienteController,
    useFactory: (autenticarClienteUseCase: AutenticarClienteUseCase) =>
      new AutenticarClienteController(autenticarClienteUseCase),
    inject: [AutenticarClienteUseCase]
  },
  {
    provide: DecodificarTokenClienteController,
    useFactory: (decodificarTokenClienteUseCase: DecodificarTokenClienteUseCase) =>
      new DecodificarTokenClienteController(decodificarTokenClienteUseCase),
    inject: [DecodificarTokenClienteUseCase]
  },
  {
    provide: ExcluirClienteController,
    useFactory: (excluirClienteUseCase: ExcluirClienteUseCase) =>
      new ExcluirClienteController(excluirClienteUseCase),
    inject: [ExcluirClienteUseCase]
  }
]

@Module({
  imports: [],
  controllers: [AutenticacaoControllerRoute],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...controllerProviders
  ],
})
export class ClienteModule { }