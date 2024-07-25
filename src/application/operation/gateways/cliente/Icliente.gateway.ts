import { Medico } from "src/core/cliente/entity/medico.entity";
import { Paciente } from "src/core/cliente/entity/paciente.entity";

export interface IClienteGateway {
  cadastrarCliente(cliente: Medico | Paciente, type: 'medico' | 'paciente'): Promise<Medico | Paciente>;
  getCliente(cpfOrEmail: string, type: 'medico' | 'paciente'): Promise<Medico | Paciente>;
  excluirCliente(email: string, type: 'medico' | 'paciente'): Promise<void>
}

export const IClienteGateway = Symbol('IClienteGateway');