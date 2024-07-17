import { BadRequestException, Inject } from "@nestjs/common";
import { AutenticaClienteDto } from "../../dto/autentica-cliente.dto";
import { IClienteGateway } from "../../../../application/operation/gateways/cliente/Icliente.gateway";
import { IAuthenticationGateway } from "../../../../application/operation/gateways/authentication/Iauthentication.gateway";
import { env } from "process";

export class AutenticarClienteUseCase {
  constructor(
    @Inject(IClienteGateway)
    private clienteGateway: IClienteGateway,
    @Inject(IAuthenticationGateway)
    private autenticationGateway: IAuthenticationGateway
  ) { }

  async execute({ nome, email, cpf, senha, type, crm }: AutenticaClienteDto): Promise<any> {

    let autenticador = email;
    if (type === 'paciente') {
      autenticador = email ? email : cpf;
    } else if (type === 'medico') {
      autenticador = crm
    }

    // if (((!email && !cpf) || !senha) && (!crm || !senha)) {
    //   throw new BadRequestException('Não podemos criar um usuario sem email, cpf e/ou senha não estão preenchidos');
    // }

    console.log('autenticador => ', autenticador);
    console.log('type => ', type);

    const cliente = await this.clienteGateway.getCliente(autenticador, type);

    if (!cliente) {
      throw new BadRequestException('Cliente não encontrado');
    }

    const token = await this.autenticationGateway.autenticar(cliente.nome, senha);

    return token;
  }
}