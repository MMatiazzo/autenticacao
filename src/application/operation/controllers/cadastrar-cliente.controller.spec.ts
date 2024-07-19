// cadastrar-cliente.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarClienteController } from './cadastrar-cliente.controller';
import { CadastrarClienteUseCase } from '../../../core/cliente/usecase/cadastrar-cliente/cadastrar-cliente.usecase';
import { AutenticaClienteDto } from '../../../core/cliente/dto/autentica-cliente.dto';

jest.mock('../../../core/cliente/usecase/cadastrar-cliente/cadastrar-cliente.usecase');

describe('CadastrarClienteController', () => {
  let controller: CadastrarClienteController;
  let cadastrarClienteUseCase: CadastrarClienteUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CadastrarClienteController],
      providers: [
        CadastrarClienteUseCase,
      ],
    }).compile();

    controller = module.get<CadastrarClienteController>(CadastrarClienteController);
    cadastrarClienteUseCase = module.get<CadastrarClienteUseCase>(CadastrarClienteUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('Deve retornar a resposta correta quando chamar o CadastrarClienteUsecase.execute', async () => {
      const payload: AutenticaClienteDto = { autenticar: false, cpf: '000000000', };
      const mockResponse = { success: true };

      jest.spyOn(cadastrarClienteUseCase, 'execute').mockResolvedValue(mockResponse);

      const result = await controller.handle(payload);

      expect(cadastrarClienteUseCase.execute).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockResponse);
    });

    it('Deve gerar uma exeção caso não consiga cadastrar um usuário', async () => {
      const payload: AutenticaClienteDto = { autenticar: true, cpf: '000000000' };
      const mockError = new Error('Registration failed');

      jest.spyOn(cadastrarClienteUseCase, 'execute').mockRejectedValue(mockError);

      await expect(controller.handle(payload)).rejects.toThrow(mockError);
    });
  });
});
