import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { IClienteRepository } from "./Icliente.repository";
import { Medico } from "src/core/cliente/entity/medico.entity";
import { Paciente } from "src/core/cliente/entity/paciente.entity";

@Injectable()
export class ClientePostgresRepository implements IClienteRepository {

  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) { }
  async cadastrarMedico(cliente: Medico): Promise<Medico> {
    const novoCliente = await this.prisma.medico.create({ data: cliente });
    return novoCliente;
  }
  async cadastrarPaciente(cliente: Paciente): Promise<Paciente> {
    const novoCliente = await this.prisma.paciente.create({ data: cliente });
    return novoCliente;
  }

  async getCliente(cpfOrEmail: string): Promise<Medico[] | Paciente[]> {
    try {
      const clientes = await this.prisma.paciente.findMany({
        where: {
          OR: [
            {
              email: cpfOrEmail
            },
            {
              cpf: cpfOrEmail
            },
          ]
        },
      });

      return clientes;
    } catch (e) {
      console.error('error prisma => ', e);
    }
    return [];
  }

  async getMedico(crm: string): Promise<Medico[] | null> {
    console.log('crm inside ');
    try {
      const medicos = await this.prisma.medico.findMany({
        where: { crm },
      });

      return medicos;
    } catch (e) {
      console.error('error prisma => ', e);
    }
    return [];
  }

  async getPaciente(cpfOrEmail: string): Promise<Paciente[] | null> {
    try {
      const pacientes = await this.prisma.paciente.findMany({
        where: {
          OR: [
            {
              email: cpfOrEmail
            },
            {
              cpf: cpfOrEmail
            },
          ]
        },
      });

      return pacientes;
    } catch (e) {
      console.error('error prisma => ', e);
    }
    return [];
  }

  async excluirCliente(email: string, type: 'medico' | 'paciente'): Promise<void> {

    if (type === 'medico') {
      await this.prisma.medico.delete({
        where: {
          email
        },
      });
    } else if (type === 'paciente') {
      await this.prisma.paciente.delete({
        where: {
          email
        },
      });
    }

  }
}