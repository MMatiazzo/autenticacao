import { Inject } from "@nestjs/common";
import { ExcluirClienteDto } from "../../../core/cliente/dto/excluir-cliente.dto";
import { ExcluirClienteUseCase } from "../../../core/cliente/usecase/excluir-cliente/excluir-cliente.usecase";

export class ExcluirClienteController {
  constructor(
    @Inject(ExcluirClienteUseCase)
    private excluirClienteUseCase: ExcluirClienteUseCase
  ) { }

  async handle(payload: ExcluirClienteDto): Promise<void> {
    return await this.excluirClienteUseCase.execute(payload);
  }
}