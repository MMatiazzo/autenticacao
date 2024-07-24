import { BadRequestException } from "@nestjs/common";
import { IAuthenticationGateway } from "../../../../application/operation/gateways/authentication/Iauthentication.gateway";
import { IClienteGateway } from "../../../../application/operation/gateways/cliente/Icliente.gateway";
import { AutenticaClienteDto } from "../../dto/autentica-cliente.dto";
import { Medico } from "../../entity/medico.entity";
import { Paciente } from "../../entity/paciente.entity";
import { CadastrarClienteUseCase } from "./cadastrar-cliente.usecase";

describe('CadastrarClienteUseCase', () => {
    let cadastrarClienteUseCase: CadastrarClienteUseCase;
    let clienteGateway: jest.Mocked<IClienteGateway>;
    let authenticationGateway: jest.Mocked<IAuthenticationGateway>;

    beforeEach(() => {
        clienteGateway = {
            cadastrarCliente: jest.fn(),
            excluirCliente: jest.fn(),
            getCliente: jest.fn()
        } as jest.Mocked<IClienteGateway>;

        authenticationGateway = {
            autenticar: jest.fn(),
            decodificarToken: jest.fn(),
            deletar: jest.fn(),
            registrar: jest.fn(),
        } as jest.Mocked<IAuthenticationGateway>;

        cadastrarClienteUseCase = new CadastrarClienteUseCase(clienteGateway, authenticationGateway);
    });

    describe('execute', () => {
        it('deve lançar BadRequestException se campos obrigatórios estiverem faltando para paciente', async () => {
            const dto: AutenticaClienteDto = { nome: 'Paciente', email: '', cpf: '', senha: '', type: 'paciente', crm: null, especialidade: null, autenticar: true };

            const result = await cadastrarClienteUseCase.execute(dto);

            expect(result).toBeInstanceOf(BadRequestException);
        });

        it('deve lançar BadRequestException se campos obrigatórios estiverem faltando para medico', async () => {
            const dto: AutenticaClienteDto = { nome: 'Medico', email: '', cpf: null, senha: '', type: 'medico', crm: '', especialidade: '', autenticar: true };

            const result = await cadastrarClienteUseCase.execute(dto);

            expect(result).toBeInstanceOf(BadRequestException);
        });

        it('deve cadastrar e autenticar um paciente corretamente', async () => {
            const dto: AutenticaClienteDto =
                { nome: 'Paciente', email: 'paciente@example.com', cpf: '12345678900', senha: 'senha123', type: 'paciente', crm: null, especialidade: null, autenticar: true };
            const paciente = Paciente.new({ cpf: dto.cpf, email: dto.email, nome: dto.nome, senha: dto.senha });
            const clienteCadastrado = { ...paciente, id: 1 };
            const authResponse = { UserConfirmed: true };

            clienteGateway.cadastrarCliente.mockResolvedValue(clienteCadastrado);
            authenticationGateway.registrar.mockResolvedValue(authResponse);
            authenticationGateway.autenticar.mockResolvedValue('token-jwt');

            const result = await cadastrarClienteUseCase.execute(dto);

            expect(result).toBe('token-jwt');
            expect(clienteGateway.cadastrarCliente).toHaveBeenCalledWith(paciente, dto.type);
            expect(authenticationGateway.registrar).toHaveBeenCalledWith(clienteCadastrado.nome, clienteCadastrado.email, dto.senha);
            expect(authenticationGateway.autenticar).toHaveBeenCalledWith(clienteCadastrado.nome, dto.senha);
        });

        it('deve cadastrar e autenticar um medico corretamente', async () => {
            const dto: AutenticaClienteDto =
                { nome: 'Medico', email: 'medico@example.com', cpf: null, senha: 'senha123', type: 'medico', crm: 'CRM1234', especialidade: 'Cardiologia', autenticar: true };
            const medico = Medico.new({ crm: dto.crm, email: dto.email, nome: dto.nome, senha: dto.senha, especialidade: dto.especialidade });
            const clienteCadastrado = { ...medico, id: 1 };
            const authResponse = { UserConfirmed: true };

            clienteGateway.cadastrarCliente.mockResolvedValue(clienteCadastrado);
            authenticationGateway.registrar.mockResolvedValue(authResponse);
            authenticationGateway.autenticar.mockResolvedValue('token-jwt');

            const result = await cadastrarClienteUseCase.execute(dto);

            expect(result).toBe('token-jwt');
            expect(clienteGateway.cadastrarCliente).toHaveBeenCalledWith(medico, dto.type);
            expect(authenticationGateway.registrar).toHaveBeenCalledWith(clienteCadastrado.nome, clienteCadastrado.email, dto.senha);
            expect(authenticationGateway.autenticar).toHaveBeenCalledWith(clienteCadastrado.nome, dto.senha);
        });

        it('deve lançar BadRequestException se a autenticação falhar', async () => {
            const dto: AutenticaClienteDto =
                { nome: 'Paciente', email: 'paciente@example.com', cpf: '12345678900', senha: 'senha123', type: 'paciente', crm: null, especialidade: null, autenticar: true };
            const paciente = Paciente.new({ cpf: dto.cpf, email: dto.email, nome: dto.nome, senha: dto.senha });
            const clienteCadastrado = { ...paciente, id: 1 };
            const authResponse = { UserConfirmed: false, message: 'Erro na autenticação' };

            clienteGateway.cadastrarCliente.mockResolvedValue(clienteCadastrado);
            authenticationGateway.registrar.mockResolvedValue(authResponse);

            await expect(cadastrarClienteUseCase.execute(dto)).rejects.toThrow(BadRequestException);
            expect(clienteGateway.cadastrarCliente).toHaveBeenCalledWith(paciente, dto.type);
            expect(authenticationGateway.registrar).toHaveBeenCalledWith(clienteCadastrado.nome, clienteCadastrado.email, dto.senha);
        });
    });
});
