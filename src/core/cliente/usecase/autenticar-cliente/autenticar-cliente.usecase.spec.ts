import { AutenticarClienteUseCase } from './autenticar-cliente.usecase';
import { IClienteGateway } from '../../../../application/operation/gateways/cliente/Icliente.gateway';
import { IAuthenticationGateway } from '../../../../application/operation/gateways/authentication/Iauthentication.gateway';
import { BadRequestException } from '@nestjs/common';

const clienteGatewayMock: Partial<IClienteGateway> = {
    getCliente: jest.fn(),
};

const authenticationGatewayMock: Partial<IAuthenticationGateway> = {
    autenticar: jest.fn(),
};

describe('AutenticarClienteUseCase', () => {
    let useCase: AutenticarClienteUseCase;

    beforeEach(() => {
        useCase = new AutenticarClienteUseCase(
            clienteGatewayMock as IClienteGateway,
            authenticationGatewayMock as IAuthenticationGateway,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve ser possível autenticar com usário padrão', async () => {
        const defaultNome = 'default_user';
        const defaultSenha = 'default_password';

        process.env.DEFAULT_USER_NOME = defaultNome;
        process.env.DEFAULT_USER_SENHA = defaultSenha;

        await useCase.execute({ autenticar: false });

        expect(authenticationGatewayMock.autenticar).toHaveBeenCalledWith(defaultNome, defaultSenha);
    });

    it('Deve gerar uma exceção BadRequestException quando o email ou cpf não for informado', async () => {
        await expect(useCase.execute({
            autenticar: true,
            cpf: "357.956.120-06",
            email: "test@test.com",
            nome: "test",
            senha: "123"
        })).rejects.toThrow(BadRequestException);
    });

    it('Deve gerar uma exceção BadRequestException quando não informar a senha', async () => {
        await expect(useCase.execute({
            autenticar: true,
            cpf: "357.956.120-06",
            email: "test@test.com",
            nome: "test",
            senha: "123"
        })).rejects.toThrow(BadRequestException);
    });

});
