import { Inject } from "@nestjs/common";
import { IClienteRepository } from "../../../../infrastructure/persistence/repositories/Icliente.repository";
import { IClienteGateway } from "./Icliente.gateway";
import { Paciente } from "src/core/cliente/entity/paciente.entity";
import { Medico } from "src/core/cliente/entity/medico.entity";

export class ClienteGateway implements IClienteGateway {

  constructor(
    @Inject(IClienteRepository)
    private clienteRepository: IClienteRepository
  ) { }

  async cadastrarCliente(cliente: Medico | Paciente, type: 'medico' | 'paciente'): Promise<Medico | Paciente> {
    return type === 'medico' ?
      await this.clienteRepository.cadastrarMedico(cliente as Medico) :
      await this.clienteRepository.cadastrarPaciente(cliente as Paciente);
  }

  async getCliente(autenticador: string, type: 'medico' | 'paciente'): Promise<Medico | Paciente> {

    if (type === 'medico') {
      const medicos = await this.clienteRepository.getMedico(autenticador);
      return medicos[0]
    } else if (type === 'paciente') {
      const pacientes = await this.clienteRepository.getPaciente(autenticador);
      return pacientes[0];
    }

    return null;
  }

  async excluirCliente(email: string, type: 'medico' | 'paciente'): Promise<void> {
    await this.clienteRepository.excluirCliente(email, type);
  }
}