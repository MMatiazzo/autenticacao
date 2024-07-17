import { CadastrarPacienteDto } from "../dto/cadastrar-cliente.dto";

export class Paciente {
  cpf: string;
  nome: string;
  email: string;

  private constructor(payload: CadastrarPacienteDto) {
    this.cpf = payload.cpf;
    this.nome = payload.nome;
    this.email = payload.email;
  }

  public static new(payload: CadastrarPacienteDto): Paciente {
    const paciente = new Paciente(payload);
    return paciente;
  }
}
