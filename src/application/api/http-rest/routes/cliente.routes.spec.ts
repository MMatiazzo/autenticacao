// cliente.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarClienteController } from '../../../../application/operation/controllers/cadastrar-cliente.controller';
import { AutenticarClienteController } from '../../../../application/operation/controllers/autenticar-cliente.controller';
import { DecodificarTokenClienteController } from '../../../../application/operation/controllers/decodificar-token-cliente.controller';
import { AutenticaClienteDto } from '../../../../core/cliente/dto/autentica-cliente.dto';
import { DecodificarTokenClienteDto } from '../../../../core/cliente/dto/decodificar-token-cliente.dto';
import { AutenticacaoControllerRoute } from './cliente.routes';
import { ExcluirClienteController } from '../../../../application/operation/controllers/excluir-cliente.controller';

jest.mock('../../../../application/operation/controllers/cadastrar-cliente.controller');
jest.mock('../../../../application/operation/controllers/autenticar-cliente.controller');
jest.mock('../../../../application/operation/controllers/decodificar-token-cliente.controller');
jest.mock('../../../../application/operation/controllers/excluir-cliente.controller');

describe('AutenticacaoControllerRoute', () => {
  let controller: AutenticacaoControllerRoute;
  let cadastrarClienteController: CadastrarClienteController;
  let autenticarClienteController: AutenticarClienteController;
  let decodificarTokenClienteController: DecodificarTokenClienteController;
  let excluirClienteController: ExcluirClienteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutenticacaoControllerRoute],
      providers: [
        CadastrarClienteController,
        AutenticarClienteController,
        DecodificarTokenClienteController,
        ExcluirClienteController
      ],
    }).compile();

    controller = module.get<AutenticacaoControllerRoute>(AutenticacaoControllerRoute);
    cadastrarClienteController = module.get<CadastrarClienteController>(CadastrarClienteController);
    autenticarClienteController = module.get<AutenticarClienteController>(AutenticarClienteController);
    decodificarTokenClienteController = module.get<DecodificarTokenClienteController>(DecodificarTokenClienteController);
    excluirClienteController = module.get<ExcluirClienteController>(ExcluirClienteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('Deve retornar o status de saude', () => {
      const result = controller.healthCheck();
      expect(result).toEqual({ health: true });
    });
  });

  describe('cadastrar', () => {
    it('Deve chamar o controller e retornar corretamente o token', async () => {
      const payload: AutenticaClienteDto = { autenticar: false, cpf: '000000000' };
      const mockToken = { token: 'mock-token' };

      jest.spyOn(cadastrarClienteController, 'handle').mockResolvedValue(mockToken);

      const result = await controller.cadastrar(payload);

      expect(cadastrarClienteController.handle).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockToken);
    });
  });

  describe('autenticar', () => {
    it('deve chamar o controller e autenticar', async () => {
      const payload: AutenticaClienteDto = { autenticar: false, cpf: '000000000' };
      const mockToken = { token: 'mock-token' };

      jest.spyOn(autenticarClienteController, 'handle').mockResolvedValue(mockToken);

      const result = await controller.autenticar(payload);

      expect(autenticarClienteController.handle).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockToken);
    });
  });

  describe('decodificarToken', () => {
    it('Deve chamar o controller e retornar o usuário', async () => {
      const payload: DecodificarTokenClienteDto = { acessToken: 'mock-token' };
      const mockDecodedToken = { decoded: 'mock-decoded-token' };

      jest.spyOn(decodificarTokenClienteController, 'handle').mockResolvedValue(mockDecodedToken);

      const result = await controller.decodificarToken(payload);

      expect(decodificarTokenClienteController.handle).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockDecodedToken);
    });
  });
});
