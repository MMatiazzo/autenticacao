import { CadastrarClienteController } from "./cadastrar-cliente.controller";
import { AutenticaClienteDto } from "../../../core/cliente/dto/autentica-cliente.dto";
import { CadastrarClienteUseCase } from "../../../core/cliente/usecase/cadastrar-cliente/cadastrar-cliente.usecase";
import { IAuthenticationGateway } from "../gateways/authentication/Iauthentication.gateway";
import { IClienteGateway } from "../gateways/cliente/Icliente.gateway";

describe('CadastrarClienteController', () => {
  let cadastrarClienteController: CadastrarClienteController;
  let cadastrarClienteUseCase: CadastrarClienteUseCase;
  let executeMock: jest.Mock;

  beforeEach(() => {
    const clienteGateway: jest.Mocked<IClienteGateway> = {
      getCliente: jest.fn(),
      cadastrarCliente: jest.fn(),
      excluirCliente: jest.fn(),
    };

    const authenticationGateway: jest.Mocked<IAuthenticationGateway> = {
      autenticar: jest.fn(),
      decodificarToken: jest.fn(),
      deletar: jest.fn(),
      registrar: jest.fn(),
    };

    cadastrarClienteUseCase = new CadastrarClienteUseCase(clienteGateway, authenticationGateway);
    executeMock = jest.fn();
    cadastrarClienteUseCase.execute = executeMock;

    cadastrarClienteController = new CadastrarClienteController(cadastrarClienteUseCase);
  });

  describe('handle', () => {
    it('deve retornar a resposta do use case quando executado com sucesso', async () => {
      const payload: AutenticaClienteDto = {
        nome: 'Test', email: 'test@example.com', cpf: '12345678900', senha: 'password', type: 'paciente', crm: null, especialidade: null, autenticar: true
      };
      const response = { message: 'Cliente cadastrado com sucesso' };
      executeMock.mockResolvedValue(response);

      const result = await cadastrarClienteController.handle(payload);

      expect(result).toBe(response);
      expect(executeMock).toHaveBeenCalledWith(payload);
    });

    it('deve lançar uma exceção quando o use case lançar uma exceção', async () => {
      const payload: AutenticaClienteDto = {
        nome: 'Test', email: 'test@example.com', cpf: '12345678900', senha: 'password', type: 'paciente', crm: null, especialidade: null, autenticar: true
      };
      const error = new Error('Erro ao cadastrar cliente');
      executeMock.mockRejectedValue(error);

      await expect(cadastrarClienteController.handle(payload)).rejects.toThrow(error);
      expect(executeMock).toHaveBeenCalledWith(payload);
    });
  });
});
