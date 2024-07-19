// decodificar-token-cliente.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { DecodificarTokenClienteController } from './decodificar-token-cliente.controller';
import { DecodificarTokenClienteUseCase } from '../../../core/cliente/usecase/decodificar-token-cliente/decodificar-token-cliente.usecase';
import { ClientePresenter } from '../presenters/cliente.presenter';
import { DecodificarTokenClienteDto } from '../../../core/cliente/dto/decodificar-token-cliente.dto';

jest.mock('../../../core/cliente/usecase/decodificar-token-cliente/decodificar-token-cliente.usecase');
jest.mock('../presenters/cliente.presenter');

describe('DecodificarTokenClienteController', () => {
  let controller: DecodificarTokenClienteController;
  let decodificarTokenClienteUseCase: DecodificarTokenClienteUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecodificarTokenClienteController],
      providers: [
        DecodificarTokenClienteUseCase,
      ],
    }).compile();

    controller = module.get<DecodificarTokenClienteController>(DecodificarTokenClienteController);
    decodificarTokenClienteUseCase = module.get<DecodificarTokenClienteUseCase>(DecodificarTokenClienteUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('Deve retornar o usuário decodificado caso o token estiver correto', async () => {
      const payload: DecodificarTokenClienteDto = { acessToken: 'super_token' };
      const mockCliente = { /* mock cliente object */ };
      const mockDecodedUser = { nome: 'username', email: 'user@example.com' };

      jest.spyOn(decodificarTokenClienteUseCase, 'execute').mockResolvedValue(mockCliente);
      jest.spyOn(ClientePresenter, 'decodeTokenToUser').mockResolvedValue(mockDecodedUser);

      const result = await controller.handle(payload);

      expect(decodificarTokenClienteUseCase.execute).toHaveBeenCalledWith(payload);
      expect(ClientePresenter.decodeTokenToUser).toHaveBeenCalledWith(mockCliente);
      expect(result).toEqual(mockDecodedUser);
    });

    it('Deve retornar null caso não encontrar o usuário', async () => {
      const payload: DecodificarTokenClienteDto = { acessToken: 'some-token' };

      jest.spyOn(decodificarTokenClienteUseCase, 'execute').mockResolvedValue(null);

      const result = await controller.handle(payload);

      expect(decodificarTokenClienteUseCase.execute).toHaveBeenCalledWith(payload);
      expect(result).toBeNull();
    });
  });
});
