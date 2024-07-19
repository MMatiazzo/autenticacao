import { Inject } from "@nestjs/common";
import { AutenticaClienteDto } from "../../../core/cliente/dto/autentica-cliente.dto";
import { AutenticarClienteUseCase } from "../../../core/cliente/usecase/autenticar-cliente/autenticar-cliente.usecase";

export class AutenticarClienteController {
  constructor(
    @Inject(AutenticarClienteUseCase)
    private autenticarClienteUseCase: AutenticarClienteUseCase
  ) { }

  async handle(payload: AutenticaClienteDto): Promise<any> {
    const response = await this.autenticarClienteUseCase.execute(payload);
    return response;
  }
}