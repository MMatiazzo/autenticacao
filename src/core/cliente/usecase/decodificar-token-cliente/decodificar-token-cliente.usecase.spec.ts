import { BadRequestException } from "@nestjs/common";
import { IAuthenticationGateway } from "../../../../application/operation/gateways/authentication/Iauthentication.gateway";
import { DecodificarTokenClienteDto } from "../../dto/decodificar-token-cliente.dto";
import { DecodificarTokenClienteUseCase } from "./decodificar-token-cliente.usecase";

describe('DecodificarTokenClienteUseCase', () => {
  let decodificarTokenClienteUseCase: DecodificarTokenClienteUseCase;
  let authenticationGateway: jest.Mocked<IAuthenticationGateway>;

  beforeEach(() => {
    authenticationGateway = {
      autenticar: jest.fn(),
      decodificarToken: jest.fn(),
      deletar: jest.fn(),
      registrar: jest.fn(),
    } as jest.Mocked<IAuthenticationGateway>;

    decodificarTokenClienteUseCase = new DecodificarTokenClienteUseCase(authenticationGateway);
  });

  describe('execute', () => {
    it('deve lançar BadRequestException se o cliente não for encontrado', async () => {
      const dto: DecodificarTokenClienteDto = { acessToken: 'invalid-token' };
      authenticationGateway.decodificarToken.mockResolvedValue(null);

      await expect(decodificarTokenClienteUseCase.execute(dto)).rejects.toThrow(BadRequestException);
      expect(authenticationGateway.decodificarToken).toHaveBeenCalledWith(dto.acessToken);
    });

    it('deve retornar o cliente se o token for válido', async () => {
      const dto: DecodificarTokenClienteDto = { acessToken: 'valid-token' };
      const cliente = { nome: 'Test Cliente' };
      authenticationGateway.decodificarToken.mockResolvedValue(cliente);

      const result = await decodificarTokenClienteUseCase.execute(dto);

      expect(result).toBe(cliente);
      expect(authenticationGateway.decodificarToken).toHaveBeenCalledWith(dto.acessToken);
    });
  });
});
