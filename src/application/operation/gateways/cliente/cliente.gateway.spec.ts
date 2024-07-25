import { ClienteGateway } from "./cliente.gateway";
import { IClienteRepository } from "../../../../infrastructure/persistence/repositories/Icliente.repository";
import { Medico } from "src/core/cliente/entity/medico.entity";
import { Paciente } from "src/core/cliente/entity/paciente.entity";

describe('ClienteGateway', () => {
  let clienteGateway: ClienteGateway;
  let clienteRepository: jest.Mocked<IClienteRepository>;

  beforeEach(() => {
    clienteRepository = {
      cadastrarMedico: jest.fn(),
      cadastrarPaciente: jest.fn(),
      getMedico: jest.fn(),
      getPaciente: jest.fn(),
      excluirCliente: jest.fn(),
      getCliente: jest.fn(),
    } as jest.Mocked<IClienteRepository>;

    clienteGateway = new ClienteGateway(clienteRepository);
  });

  describe('cadastrarCliente', () => {
    it('deve cadastrar um medico corretamente', async () => {
      const medico: Medico = { nome: 'Dr. Teste', email: 'medico@example.com', crm: 'CRM1234', especialidade: 'Cardiologia' };
      clienteRepository.cadastrarMedico.mockResolvedValue(medico);

      const result = await clienteGateway.cadastrarCliente(medico, 'medico');

      expect(result).toBe(medico);
      expect(clienteRepository.cadastrarMedico).toHaveBeenCalledWith(medico);
    });

    it('deve cadastrar um paciente corretamente', async () => {
      const paciente: Paciente = { nome: 'Paciente Teste', email: 'paciente@example.com', cpf: '12345678900' };
      clienteRepository.cadastrarPaciente.mockResolvedValue(paciente);

      const result = await clienteGateway.cadastrarCliente(paciente, 'paciente');

      expect(result).toBe(paciente);
      expect(clienteRepository.cadastrarPaciente).toHaveBeenCalledWith(paciente);
    });
  });

  describe('getCliente', () => {
    it('deve retornar um medico pelo autenticador', async () => {
      const medico: Medico = { nome: 'Dr. Teste', email: 'medico@example.com', crm: 'CRM1234', especialidade: 'Cardiologia' };
      clienteRepository.getMedico.mockResolvedValue([medico]);

      const result = await clienteGateway.getCliente('CRM1234', 'medico');

      expect(result).toBe(medico);
      expect(clienteRepository.getMedico).toHaveBeenCalledWith('CRM1234');
    });

    it('deve retornar um paciente pelo autenticador', async () => {
      const paciente: Paciente = { nome: 'Paciente Teste', email: 'paciente@example.com', cpf: '12345678900' };
      clienteRepository.getPaciente.mockResolvedValue([paciente]);

      const result = await clienteGateway.getCliente('12345678900', 'paciente');

      expect(result).toBe(paciente);
      expect(clienteRepository.getPaciente).toHaveBeenCalledWith('12345678900');
    });
  });

  describe('excluirCliente', () => {
    it('deve excluir um cliente corretamente', async () => {
      const email = 'cliente@example.com';
      await clienteGateway.excluirCliente(email, 'paciente');

      expect(clienteRepository.excluirCliente).toHaveBeenCalledWith(email, 'paciente');
    });
  });
});
