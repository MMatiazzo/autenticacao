// cognito.auth.spec.ts
import { BadRequestException } from '@nestjs/common';
import { cognitoApi } from '../../../../../shared/axios/api';
import { env } from 'process';
import { CognitoAuth } from './authentication-cognito.gateway';

// Mock the axios instance
jest.mock('../../../../../shared/axios/api', () => ({
  cognitoApi: {
    post: jest.fn(),
  },
}));

describe('CognitoAuth', () => {
  let cognitoAuth: CognitoAuth;

  beforeEach(() => {
    cognitoAuth = new CognitoAuth();
    jest.clearAllMocks();
  });

  describe('registrar', () => {
    it('Deve registra o usuário e retornar o token de resposta', async () => {
      const mockData = { success: true };
      (cognitoApi.post as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await cognitoAuth.registrar('username', 'email@example.com', 'password');

      expect(cognitoApi.post).toHaveBeenCalledWith(
        '/',
        {
          ClientId: env.COGNITO_CLIENT_ID,
          Password: 'password',
          Username: 'username',
          UserAttributes: [
            {
              Name: 'email',
              Value: 'email@example.com',
            },
          ],
        },
        {
          headers: {
            'X-Amz-Target': env.COGNITO_HEADER_SIGNUP,
          },
        }
      );

      expect(result).toEqual(mockData);
    });
  });

  describe('autenticar', () => {
    it('Deve autenticar o usuário e retornar o token de resposta', async () => {
      const mockData = { success: true };
      (cognitoApi.post as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await cognitoAuth.autenticar('username', 'password');

      expect(cognitoApi.post).toHaveBeenCalledWith(
        '/',
        {
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: env.COGNITO_CLIENT_ID,
          AuthParameters: {
            USERNAME: 'username',
            PASSWORD: 'password',
          },
        },
        {
          headers: {
            'X-Amz-Target': env.GOGNITO_HEADER_SIGNIN,
          },
        }
      );

      expect(result).toEqual(mockData);
    });

    it('Deve gerar a exeção BadRequestException caso a autenticação falhar', async () => {
      (cognitoApi.post as jest.Mock).mockRejectedValue(new Error('Authentication failed'));

      await expect(cognitoAuth.autenticar('username', 'password')).rejects.toThrow(BadRequestException);
      await expect(cognitoAuth.autenticar('username', 'password')).rejects.toThrow('Cliente não encontrado');
    });
  });

  describe('decodificarToken', () => {
    it('Deve decodificar o token e retornar as propriedades do usuário', async () => {
      const mockData = { success: true };
      (cognitoApi.post as jest.Mock).mockResolvedValue({ data: mockData });

      const result = await cognitoAuth.decodificarToken('token');

      expect(cognitoApi.post).toHaveBeenCalledWith(
        '/',
        {
          AccessToken: 'token',
        },
        {
          headers: {
            'X-Amz-Target': env.COGNITO_HEADER_GETUSER,
          },
        }
      );

      expect(result).toEqual(mockData);
    });

    it('Deve retornar null caso o token seja inválido', async () => {
      (cognitoApi.post as jest.Mock).mockRejectedValue(new Error('Decode token failed'));

      const result = await cognitoAuth.decodificarToken('token');

      expect(result).toBeNull();
    });
  });
});
