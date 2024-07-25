import { AutenticaClienteDto } from "../../../core/cliente/dto/autentica-cliente.dto";
import { AutenticarClienteController } from "./autenticar-cliente.controller";
import { IClienteGateway } from "../gateways/cliente/Icliente.gateway";
import { IAuthenticationGateway } from "../gateways/authentication/Iauthentication.gateway";
import { AutenticarClienteUseCase } from "../../../core/cliente/usecase/autenticar-cliente/autenticar-cliente.usecase";

describe('AutenticarClienteController', () => {
    let autenticarClienteController: AutenticarClienteController;
    let autenticarClienteUseCase: AutenticarClienteUseCase;
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

        autenticarClienteUseCase = new AutenticarClienteUseCase(clienteGateway, authenticationGateway);
        executeMock = jest.fn();
        autenticarClienteUseCase.execute = executeMock;

        autenticarClienteController = new AutenticarClienteController(autenticarClienteUseCase);
    });

    describe('handle', () => {
        it('deve retornar a resposta do use case quando executado com sucesso', async () => {
            const payload: AutenticaClienteDto = {
                email: 'test@example.com',
                cpf: '12345678900',
                senha: 'password',
                type: 'paciente',
                crm: null,
                autenticar: false,
                especialidade: null,
                nome: 'nome'
            };
            const token = 'some-jwt-token';
            executeMock.mockResolvedValue(token);

            const response = await autenticarClienteController.handle(payload);

            expect(response).toBe(token);
            expect(executeMock).toHaveBeenCalledWith(payload);
        });

        it('deve lançar uma exceção quando o use case lançar uma exceção', async () => {
            const payload: AutenticaClienteDto = {
                email: 'test@example.com',
                cpf: '12345678900',
                senha: 'password',
                type: 'paciente',
                crm: null,
                autenticar: false,
                especialidade: null,
                nome: 'nome'
            };
            const error = new Error('Cliente não encontrado');
            executeMock.mockRejectedValue(error);

            await expect(autenticarClienteController.handle(payload)).rejects.toThrow(error);
            expect(executeMock).toHaveBeenCalledWith(payload);
        });
    });
});
