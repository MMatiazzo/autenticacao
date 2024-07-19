import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarClienteUseCase } from './cadastrar-cliente.usecase';
import { IClienteGateway } from '../../../../application/operation/gateways/cliente/Icliente.gateway';
import { IAuthenticationGateway } from '../../../../application/operation/gateways/authentication/Iauthentication.gateway';
import { Cliente } from '../../entity/cliente.entity';
import { AutenticaClienteDto } from '../../dto/autentica-cliente.dto';
import { BadRequestException } from '@nestjs/common';
import { CadastrarClienteDto } from '../../dto/cadastrar-cliente.dto';

describe('CadastrarClienteUseCase', () => {
    let useCase: CadastrarClienteUseCase;
    let clienteGateway: IClienteGateway;
    let authenticationGateway: IAuthenticationGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CadastrarClienteUseCase,
                {
                    provide: IClienteGateway,
                    useValue: {
                        cadastrarCliente: jest.fn(),
                    },
                },
                {
                    provide: IAuthenticationGateway,
                    useValue: {
                        registrar: jest.fn(),
                        autenticar: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<CadastrarClienteUseCase>(CadastrarClienteUseCase);
        clienteGateway = module.get<IClienteGateway>(IClienteGateway);
        authenticationGateway = module.get<IAuthenticationGateway>(IAuthenticationGateway);
    });

    it('Não deve ser possível cadastrar cliente falsa autenticação', async () => {
        const dto: AutenticaClienteDto = {
            autenticar: false
        };

        await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
    });

    it('Deve ser possível invocar a função cadastrarCliente e registrar', async () => {
        const dto: CadastrarClienteDto = {
            cpf: "357.956.120-06",
            email: "test@test.com",
            nome: "test",
            senha: "123"
        };
        const cliente = Cliente.new(dto);
        const mockedToken = 'mockedToken';

        (clienteGateway.cadastrarCliente as jest.Mock).mockResolvedValueOnce(cliente);
        (authenticationGateway.registrar as jest.Mock).mockResolvedValueOnce({ UserConfirmed: true });
        (authenticationGateway.autenticar as jest.Mock).mockResolvedValueOnce(mockedToken);

        const result = await useCase.execute({ ...dto, autenticar: true });

        expect(clienteGateway.cadastrarCliente).toHaveBeenCalledWith(cliente);
        expect(authenticationGateway.registrar).toHaveBeenCalledWith(dto.nome, dto.email, dto.senha);
        expect(authenticationGateway.autenticar).toHaveBeenCalledWith(dto.nome, dto.senha);
        expect(result).toEqual(mockedToken);
    });

});
