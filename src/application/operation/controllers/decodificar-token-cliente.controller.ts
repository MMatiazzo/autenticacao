import { Inject } from "@nestjs/common";
import { DecodificarTokenClienteDto } from "../../../core/cliente/dto/decodificar-token-cliente.dto";
import { DecodificarTokenClienteUseCase } from "../../../core/cliente/usecase/decodificar-token-cliente/decodificar-token-cliente.usecase";
import { ClientePresenter } from "../presenters/cliente.presenter";

export class DecodificarTokenClienteController {
  constructor(
    @Inject(DecodificarTokenClienteUseCase)
    private decodificarTokenClienteUseCase: DecodificarTokenClienteUseCase
  ) { }

  async handle(payload: DecodificarTokenClienteDto): Promise<any> {
    const cliente = await this.decodificarTokenClienteUseCase.execute(payload);

    if (cliente) return ClientePresenter.decodeTokenToUser(cliente);
    return null;
  }
}