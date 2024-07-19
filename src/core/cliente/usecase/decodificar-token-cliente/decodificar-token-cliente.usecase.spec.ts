import { BadRequestException } from "@nestjs/common";
import { DecodificarTokenClienteUseCase } from "./decodificar-token-cliente.usecase";
import { IAuthenticationGateway } from "../../../../application/operation/gateways/authentication/Iauthentication.gateway";

describe('DecodificarTokenClienteUseCase', () => {
  let useCase: DecodificarTokenClienteUseCase;
  let authenticationGateway: jest.Mocked<IAuthenticationGateway>;

  beforeEach(() => {
    authenticationGateway = {
      decodificarToken: jest.fn(),
    } as unknown as jest.Mocked<IAuthenticationGateway>;

    useCase = new DecodificarTokenClienteUseCase(authenticationGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve ser possível decodificar o token e retornar o cliente', async () => {
    const fakeToken = 'fakeToken';
    const fakeCliente = { id: 1, name: 'John Doe' };

    authenticationGateway.decodificarToken.mockResolvedValue(fakeCliente);

    const result = await useCase.execute({ acessToken: fakeToken });

    expect(result).toEqual(fakeCliente);
    expect(authenticationGateway.decodificarToken).toHaveBeenCalledWith(fakeToken);
  });

  it('Deve retornar a exceção BadRequestException quando o cliente for null', async () => {
    const fakeToken = 'fakeToken';

    authenticationGateway.decodificarToken.mockResolvedValue(null);

    await expect(useCase.execute({ acessToken: fakeToken }))
      .rejects.toThrow(BadRequestException);
    expect(authenticationGateway.decodificarToken).toHaveBeenCalledWith(fakeToken);
  });
});
