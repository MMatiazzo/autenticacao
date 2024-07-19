// cliente.gateway.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ClienteGateway } from './cliente.gateway';
import { IClienteRepository } from '../../../../infrastructure/persistence/repositories/Icliente.repository';
import { Cliente } from '../../../../core/cliente/entity/cliente.entity';

describe('ClienteGateway', () => {
  let clienteGateway: ClienteGateway;
  let clienteRepository: IClienteRepository;

  const mockClienteRepository = {
    cadastrar: jest.fn(),
    getCliente: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteGateway,
        { provide: IClienteRepository, useValue: mockClienteRepository }
      ]
    }).compile();

    clienteGateway = module.get<ClienteGateway>(ClienteGateway);
    clienteRepository = module.get<IClienteRepository>(IClienteRepository);
  });

  it('should be defined', () => {
    expect(clienteGateway).toBeDefined();
  });

  describe('cadastrarCliente', () => {
    it('Deve chamar clienteRepository.cadastrar com os parametros corretos e retornar o resultado', async () => {
      const cliente: Cliente = { cpf: '507.297.600-90', email: 'email@email.com', nome: 'nome' };
      const savedCliente: Cliente = { cpf: '507.297.600-90', email: 'email@email.com', nome: 'nome' };

      mockClienteRepository.cadastrar.mockResolvedValue(savedCliente);

      const result = await clienteGateway.cadastrarCliente(cliente);

      expect(mockClienteRepository.cadastrar).toHaveBeenCalledWith(cliente);
      expect(result).toEqual(savedCliente);
    });
  });

  describe('getCliente', () => {
    it('Deve retornar o primeiro cliente encontrado', async () => {
      const cpfOrEmail = 'test@example.com';
      const clientes: Cliente[] = [{ cpf: '507.297.600-90', email: 'email@email.com', nome: 'nome' }];

      mockClienteRepository.getCliente.mockResolvedValue(clientes);

      const result = await clienteGateway.getCliente(cpfOrEmail);

      expect(mockClienteRepository.getCliente).toHaveBeenCalledWith(cpfOrEmail);
      expect(result).toEqual(clientes[0]);
    });

    it('Deve retornar null caso não encontre nenhum cliente', async () => {
      const cpfOrEmail = 'nonexistent@example.com';

      mockClienteRepository.getCliente.mockResolvedValue([]);

      const result = await clienteGateway.getCliente(cpfOrEmail);

      expect(mockClienteRepository.getCliente).toHaveBeenCalledWith(cpfOrEmail);
      expect(result).toBeNull();
    });
  });
});
