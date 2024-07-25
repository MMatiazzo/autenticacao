import { BadRequestException } from "@nestjs/common";
import { AutenticaClienteDto } from "../../dto/autentica-cliente.dto";
import { IClienteGateway } from "../../../../application/operation/gateways/cliente/Icliente.gateway";
import { IAuthenticationGateway } from "../../../../application/operation/gateways/authentication/Iauthentication.gateway";
import { AutenticarClienteUseCase } from "./autenticar-cliente.usecase";

describe('AutenticarClienteUseCase', () => {
    let autenticarClienteUseCase: AutenticarClienteUseCase;
    let clienteGateway: jest.Mocked<IClienteGateway>;
    let authenticationGateway: jest.Mocked<IAuthenticationGateway>;

    beforeEach(() => {
        clienteGateway = {
            getCliente: jest.fn(),
            cadastrarCliente: jest.fn(),
            excluirCliente: jest.fn(),
        };

        authenticationGateway = {
            autenticar: jest.fn(),
            decodificarToken: jest.fn(),
            deletar: jest.fn(),
            registrar: jest.fn(),
        };

        autenticarClienteUseCase = new AutenticarClienteUseCase(clienteGateway, authenticationGateway);
    });

    describe('execute', () => {
        it('should throw BadRequestException if cliente is not found', async () => {
            const dto: AutenticaClienteDto = {
                email: 'test@example.com',
                cpf: '12345678900',
                senha: 'password',
                type: 'paciente',
                crm: null,
                especialidade: 'teste',
                nome: null,
                autenticar: true
            };
            clienteGateway.getCliente.mockResolvedValue(null);

            await expect(autenticarClienteUseCase.execute(dto)).rejects.toThrow(BadRequestException);
            expect(clienteGateway.getCliente).toHaveBeenCalledWith(dto.email, dto.type);
        });

        it('should return a token if cliente is found and authenticated', async () => {
            const dto: AutenticaClienteDto = {
                email: 'test@example.com',
                cpf: '12345678900',
                senha: 'password',
                type: 'paciente',
                crm: null,
                especialidade: 'teste',
                nome: null,
                autenticar: true
            };

            const cliente = {
                crm: '123456',
                email: 'email@email.com',
                nome: 'nome',
                especialidade: 'especialidade',
            };
            const token = 'some-jwt-token';
            clienteGateway.getCliente.mockResolvedValue(cliente);
            authenticationGateway.autenticar.mockResolvedValue(token);

            const result = await autenticarClienteUseCase.execute(dto);

            expect(result).toBe(token);
            expect(clienteGateway.getCliente).toHaveBeenCalledWith(dto.email, dto.type);
            expect(authenticationGateway.autenticar).toHaveBeenCalledWith(cliente.nome, dto.senha);
        });

        it('should use CPF if type is paciente and email is not provided', async () => {
            const dto: AutenticaClienteDto = {
                email: null,
                cpf: '12345678900',
                senha: 'password',
                type: 'paciente',
                crm: null,
                especialidade: 'teste',
                nome: null,
                autenticar: true
            };
            const cliente = {
                cpf: '123456',
                email: null,
                nome: 'nome',
            };
            const token = 'some-jwt-token';
            clienteGateway.getCliente.mockResolvedValue(cliente);
            authenticationGateway.autenticar.mockResolvedValue(token);

            const result = await autenticarClienteUseCase.execute(dto);

            expect(result).toBe(token);
            expect(clienteGateway.getCliente).toHaveBeenCalledWith(dto.cpf, dto.type);
            expect(authenticationGateway.autenticar).toHaveBeenCalledWith(cliente.nome, dto.senha);
        });

        it('should use CRM if type is medico', async () => {
            const dto: AutenticaClienteDto = {
                email: 'test@example.com',
                cpf: null,
                senha: 'password',
                type: 'medico',
                crm: '123456',
                especialidade: 'teste',
                nome: 'nome',
                autenticar: true
            };

            const cliente = {
                crm: '123456',
                email: 'test@example.com',
                nome: 'nome',
                especialidade: 'teste',
            };
            const token = 'some-jwt-token';
            clienteGateway.getCliente.mockResolvedValue(cliente);
            authenticationGateway.autenticar.mockResolvedValue(token);

            const result = await autenticarClienteUseCase.execute(dto);

            expect(result).toBe(token);
            expect(clienteGateway.getCliente).toHaveBeenCalledWith(dto.crm, dto.type);
            expect(authenticationGateway.autenticar).toHaveBeenCalledWith(cliente.nome, dto.senha);
        });
    });
});
