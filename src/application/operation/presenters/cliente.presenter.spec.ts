import { ClientePresenter } from './cliente.presenter';

describe('ClientePresenter', () => {
  describe('decodeTokenToUser', () => {
    it('Deve retornar o usuário com as propriedades nome e email', async () => {
      const token = {
        Username: 'test_user',
        UserAttributes: [
          { Name: 'email', Value: 'test_user@example.com' }
        ]
      };

      const result = await ClientePresenter.decodeTokenToUser(token);

      expect(result).toEqual({
        nome: 'test_user',
        email: 'test_user@example.com'
      });
    });

    it('Deve retornar o usuário com o email igual a null', async () => {
      const token = {
        Username: 'default_user',
        UserAttributes: [
          { Name: 'email', Value: 'default_user_tech@email.com.br' }
        ]
      };

      const result = await ClientePresenter.decodeTokenToUser(token);

      expect(result).toEqual({
        nome: 'default_user',
        email: null
      });
    });

    it('Deve retornar o resultado com o token vazio', async () => {
      const token = {
        Username: 'user_with_empty_email',
        UserAttributes: [
          { Name: 'email', Value: '' }
        ]
      };

      const result = await ClientePresenter.decodeTokenToUser(token);

      expect(result).toEqual({
        nome: 'user_with_empty_email',
        email: ''
      });
    });
  });
});
