import { Medico } from "src/core/cliente/entity/medico.entity";
import { Paciente } from "src/core/cliente/entity/paciente.entity";

export interface IClienteRepository {
  cadastrarMedico(cliente: Medico): Promise<Medico>;
  cadastrarPaciente(cliente: Paciente): Promise<Paciente>;
  getCliente(cpfOrEmail: string): Promise<Medico[] | Paciente[] | null>;
  getMedico(crm: string): Promise<Medico[] | null>;
  getPaciente(cpfOrEmail: string): Promise<Paciente[] | null>;
  excluirCliente(cpf: string, type: 'medico' | 'paciente'): Promise<void>;
}

export const IClienteRepository = Symbol('IClienteRepository');
