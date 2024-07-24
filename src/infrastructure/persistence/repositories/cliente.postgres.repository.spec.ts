import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from "../prisma/prisma.service";
import { Medico, Paciente } from "@prisma/client";
import { ClientePostgresRepository } from './cliente.postgres.repository';

describe('ClientePostgresRepository', () => {
  let clientePostgresRepository: ClientePostgresRepository;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientePostgresRepository,
        {
          provide: PrismaService,
          useValue: {
            medico: {
              create: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
            },
            paciente: {
              create: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    clientePostgresRepository = module.get<ClientePostgresRepository>(ClientePostgresRepository);
    prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
  });

  describe('cadastrarMedico', () => {
    it('deve cadastrar um medico corretamente', async () => {
      const medico: Medico = { nome: 'Dr. Teste', email: 'medico@example.com', crm: 'CRM1234', especialidade: 'Cardiologia' };
      (prismaService.medico.create as jest.Mock).mockResolvedValue(medico);

      const result = await clientePostgresRepository.cadastrarMedico(medico);

      expect(result).toBe(medico);
      expect(prismaService.medico.create).toHaveBeenCalledWith({ data: medico });
    });
  });

  describe('cadastrarPaciente', () => {
    it('deve cadastrar um paciente corretamente', async () => {
      const paciente: Paciente = { nome: 'Paciente Teste', email: 'paciente@example.com', cpf: '12345678900' };
      (prismaService.paciente.create as jest.Mock).mockResolvedValue(paciente);

      const result = await clientePostgresRepository.cadastrarPaciente(paciente);

      expect(result).toBe(paciente);
      expect(prismaService.paciente.create).toHaveBeenCalledWith({ data: paciente });
    });
  });

  describe('getCliente', () => {
    it('deve retornar um paciente pelo CPF ou email', async () => {
      const paciente: Paciente = { nome: 'Paciente Teste', email: 'paciente@example.com', cpf: '12345678900' };
      (prismaService.paciente.findMany as jest.Mock).mockResolvedValue([paciente]);

      const result = await clientePostgresRepository.getCliente('12345678900');

      expect(result).toEqual([paciente]);
      expect(prismaService.paciente.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: '12345678900' },
            { cpf: '12345678900' },
          ],
        },
      });
    });
  });

  describe('getMedico', () => {
    it('deve retornar um medico pelo CRM', async () => {
      const medico: Medico = { nome: 'Dr. Teste', email: 'medico@example.com', crm: 'CRM1234', especialidade: 'Cardiologia' };
      (prismaService.medico.findMany as jest.Mock).mockResolvedValue([medico]);

      const result = await clientePostgresRepository.getMedico('CRM1234');

      expect(result).toEqual([medico]);
      expect(prismaService.medico.findMany).toHaveBeenCalledWith({ where: { crm: 'CRM1234' } });
    });
  });

  describe('getPaciente', () => {
    it('deve retornar um paciente pelo CPF ou email', async () => {
      const paciente: Paciente = { nome: 'Paciente Teste', email: 'paciente@example.com', cpf: '12345678900' };
      (prismaService.paciente.findMany as jest.Mock).mockResolvedValue([paciente]);

      const result = await clientePostgresRepository.getPaciente('12345678900');

      expect(result).toEqual([paciente]);
      expect(prismaService.paciente.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: '12345678900' },
            { cpf: '12345678900' },
          ],
        },
      });
    });
  });

  describe('excluirCliente', () => {
    it('deve excluir um medico pelo email', async () => {
      const email = 'medico@example.com';
      await clientePostgresRepository.excluirCliente(email, 'medico');

      expect(prismaService.medico.delete).toHaveBeenCalledWith({ where: { email } });
    });

    it('deve excluir um paciente pelo email', async () => {
      const email = 'paciente@example.com';
      await clientePostgresRepository.excluirCliente(email, 'paciente');

      expect(prismaService.paciente.delete).toHaveBeenCalledWith({ where: { email } });
    });
  });
});
