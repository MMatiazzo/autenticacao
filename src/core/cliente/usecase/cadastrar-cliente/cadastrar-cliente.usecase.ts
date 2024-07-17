import { BadRequestException, Inject } from "@nestjs/common";
import { IAuthenticationGateway } from "../../../../application/operation/gateways/authentication/Iauthentication.gateway";
import { IClienteGateway } from "../../../../application/operation/gateways/cliente/Icliente.gateway";
import { AutenticaClienteDto } from "../../dto/autentica-cliente.dto";
import { Medico } from "../../entity/medico.entity";
import { Paciente } from "../../entity/paciente.entity";

export class CadastrarClienteUseCase {
  constructor(
    @Inject(IClienteGateway)
    private clienteGateway: IClienteGateway,

    @Inject(IAuthenticationGateway)
    private authenticationGateway: IAuthenticationGateway,
  ) { }

  async execute({ nome, email, cpf, senha, crm, type, especialidade }: AutenticaClienteDto): Promise<any> {

    if (type === 'paciente' && (!email || !cpf || !senha)) {
      return new BadRequestException("Missing fields");
    } else if (type === 'medico' && (!email || !crm || !senha || !especialidade)) {
      return new BadRequestException("Missing fields");
    }

    console.log('type => ', type)

    const entidade = type === 'medico' ? Medico.new({ crm, email, nome, senha, especialidade }) : Paciente.new({ cpf, email, nome, senha });

    console.log('entidade => ', entidade);

    const clienteCadastrado = await this.clienteGateway.cadastrarCliente(entidade, type);

    console.log('clienteCadastrado => ', clienteCadastrado);

    const autenticacaoCriada = await this.authenticationGateway.registrar(
      clienteCadastrado.nome,
      clienteCadastrado.email,
      senha,
    );

    console.log('autenticacaoCriada => ', autenticacaoCriada);
    if (!autenticacaoCriada?.UserConfirmed) {
      throw new BadRequestException(`Não foi possível cadastrar usuário: ${autenticacaoCriada?.message}`);
    }

    const token = await this.authenticationGateway.autenticar(clienteCadastrado.nome, senha);

    return token;
  }
}