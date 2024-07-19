import { CadastrarMedicoDto } from "../dto/cadastrar-cliente.dto";

export class Medico {
  crm: string;
  nome: string;
  email: string;
  especialidade: string;

  private constructor(payload: CadastrarMedicoDto) {
    this.crm = payload.crm;
    this.nome = payload.nome;
    this.email = payload.email;
    this.especialidade = payload.especialidade;
  }

  public static new(payload: CadastrarMedicoDto): Medico {
    const medico = new Medico(payload);
    return medico;
  }
}
