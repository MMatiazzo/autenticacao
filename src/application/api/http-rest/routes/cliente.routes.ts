import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { AutenticarClienteController } from '../../../../application/operation/controllers/autenticar-cliente.controller';

import { ExcluirClienteDto } from 'src/core/cliente/dto/excluir-cliente.dto';
import { CadastrarClienteController } from '../../../../application/operation/controllers/cadastrar-cliente.controller';
import { DecodificarTokenClienteController } from '../../../../application/operation/controllers/decodificar-token-cliente.controller';
import { ExcluirClienteController } from '../../../../application/operation/controllers/excluir-cliente.controller';
import { AutenticaClienteDto } from '../../../../core/cliente/dto/autentica-cliente.dto';
import { DecodificarTokenClienteDto } from '../../../../core/cliente/dto/decodificar-token-cliente.dto';

@Controller('/autenticacao')
export class AutenticacaoControllerRoute {

  constructor(
    @Inject(CadastrarClienteController)
    private cadastrarClienteController: CadastrarClienteController,

    @Inject(AutenticarClienteController)
    private autenticarClienteController: AutenticarClienteController,

    @Inject(DecodificarTokenClienteController)
    private decodificarTokenClienteController: DecodificarTokenClienteController,

    @Inject(ExcluirClienteController)
    private excluirClienteController: ExcluirClienteController,
  ) { }

  @Get('/')
  healthCheck(): any {
    return { health: true }
  }

  @Post('/cadastrar/:type')
  @HttpCode(200)
  async cadastrar(
    @Body() payload: AutenticaClienteDto,
    @Param() type: { type: 'medico' | 'paciente' }
  ): Promise<void> {
    const token = await this.cadastrarClienteController.handle({ ...payload, ...type });
    return token;
  }

  @Post('/autenticar/:type')
  @HttpCode(200)
  async autenticar(
    @Body() payload: AutenticaClienteDto,
    @Param() type: { type: 'medico' | 'paciente' }
  ): Promise<any> {
    const token = await this.autenticarClienteController.handle({ ...payload, ...type });
    return token;
  }

  @Post('/decodificar-acessToken')
  @HttpCode(200)
  async decodificarToken(
    @Body() payload: DecodificarTokenClienteDto
  ): Promise<any> {
    const token = await this.decodificarTokenClienteController.handle(payload);
    return token;
  }

  @Delete('/deletar')
  @HttpCode(200)
  async deletar(
    @Body() payload: ExcluirClienteDto
  ): Promise<any> {
    await this.excluirClienteController.handle(payload);
  }
}
