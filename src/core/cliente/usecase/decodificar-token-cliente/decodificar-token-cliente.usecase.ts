import { BadRequestException, Inject } from "@nestjs/common";
import { IAuthenticationGateway } from "../../../../application/operation/gateways/authentication/Iauthentication.gateway";
import { DecodificarTokenClienteDto } from "../../dto/decodificar-token-cliente.dto";

export class DecodificarTokenClienteUseCase {
  constructor(
    @Inject(IAuthenticationGateway)
    private autenticationGateway: IAuthenticationGateway
  ) { }

  async execute({ acessToken }: DecodificarTokenClienteDto): Promise<any> {
    const cliente = await this.autenticationGateway.decodificarToken(acessToken);

    if (cliente === null) {
      throw new BadRequestException('Cliente não encontrado, token inválido');
    }

    return cliente;
  }
}