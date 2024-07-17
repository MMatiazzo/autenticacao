import { BadRequestException, Inject } from "@nestjs/common";
import { IClienteGateway } from "../../../../application/operation/gateways/cliente/Icliente.gateway";
import { ExcluirClienteDto } from "../../dto/excluir-cliente.dto";
import { IAuthenticationGateway } from "../../../../application/operation/gateways/authentication/Iauthentication.gateway";

export class ExcluirClienteUseCase {
  constructor(
    @Inject(IClienteGateway)
    private clienteGateway: IClienteGateway,

    @Inject(IAuthenticationGateway)
    private autenticationGateway: IAuthenticationGateway
  ) { }

  async execute({ email, senha, type }: ExcluirClienteDto): Promise<void> {

    const username = email.split('@')[0]

    const tokens = await this.autenticationGateway.autenticar(username, senha);

    if (!tokens) throw new BadRequestException('Usuário não encontrado');

    await this.clienteGateway.excluirCliente(email, type);
    await this.autenticationGateway.deletar(tokens.AuthenticationResult.AccessToken);
  }
}